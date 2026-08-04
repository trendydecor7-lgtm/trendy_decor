'use client'

import React from 'react'
import { cleanProductDescription } from '@/lib/formatDescription'
import { Check, Sparkles, HelpCircle, Gift, Info, Quote } from 'lucide-react'

interface FormattedProductDescriptionProps {
    description?: string
    className?: string
}

interface ParsedSection {
    type: 'h1' | 'h2' | 'h3' | 'header' | 'list_item' | 'callout_title' | 'callout_body' | 'blockquote' | 'paragraph'
    text: string
    rawLine: string
}

/**
 * Parses inline Markdown syntax:
 * **bold** -> <strong>
 * *italic* or _italic_ -> <em>
 * `code` -> <code>
 */
export function parseInlineMarkdown(text: string): React.ReactNode {
    if (!text) return ''

    // Split text by markdown tokens: **bold**, *italic*, _italic_, `code`
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g
    const parts = text.split(regex)

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
                <strong key={index} className="font-semibold text-[#1c1c1c]">
                    {part.slice(2, -2)}
                </strong>
            )
        }
        if (
            (part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
            (part.startsWith('_') && part.endsWith('_') && part.length > 2)
        ) {
            return (
                <em key={index} className="italic text-[#1c1c1c]/90">
                    {part.slice(1, -1)}
                </em>
            )
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            return (
                <code
                    key={index}
                    className="px-1.5 py-0.5 bg-[#1c1c1c]/10 rounded text-[11px] font-mono text-[#1c1c1c]"
                >
                    {part.slice(1, -1)}
                </code>
            )
        }
        return part
    })
}

export const FormattedProductDescription: React.FC<FormattedProductDescriptionProps> = ({
    description,
    className = '',
}) => {
    const cleaned = cleanProductDescription(description)
    if (!cleaned) return null

    const rawLines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean)

    const parsedElements: ParsedSection[] = []

    for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i]

        // Markdown Headings: # Heading 1, ## Heading 2, ### Heading 3
        if (/^#\s+/.test(line)) {
            parsedElements.push({ type: 'h1', text: line.replace(/^#\s+/, ''), rawLine: line })
            continue
        }
        if (/^##\s+/.test(line)) {
            parsedElements.push({ type: 'h2', text: line.replace(/^##\s+/, ''), rawLine: line })
            continue
        }
        if (/^###\s+/.test(line)) {
            parsedElements.push({ type: 'h3', text: line.replace(/^###\s+/, ''), rawLine: line })
            continue
        }

        // Markdown Blockquote: > text
        if (/^>\s*/.test(line)) {
            parsedElements.push({ type: 'blockquote', text: line.replace(/^>\s*/, ''), rawLine: line })
            continue
        }

        // Custom Section Header (e.g. INCLUDES:- or WHAT'S INCLUDED:)
        const isHeader =
            /^(includes|what's included|package includes|features|key features|details):?[-:]*$/i.test(line) ||
            /^[A-Z\s]{4,}:[-]*$/.test(line) ||
            line.toUpperCase().includes('CUSTOMISABLE ITS INCLUDES') ||
            line.toUpperCase().endsWith('INCLUDES:-') ||
            line.toUpperCase().endsWith('INCLUDES:')

        // Custom Question / Callout Title (e.g. How It will be customised ?)
        const isQuestion =
            /^(how\s+it\s+will\s+be\s+customised|how\s+to\s+customise|how\s+to\s+order|customization\s+details)/i.test(
                line
            ) ||
            (line.endsWith('?') && line.toLowerCase().includes('customis'))

        // List item match: "1 ", "1.", "- ", "* ", "• ", "1pack "
        const listItemMatch = line.match(/^([•\-\*]|\d+[\.\s]|\d+\s*pack\b)\s*(.*)/i)

        if (isHeader) {
            parsedElements.push({ type: 'header', text: line, rawLine: line })
        } else if (isQuestion) {
            parsedElements.push({ type: 'callout_title', text: line, rawLine: line })
        } else if (listItemMatch) {
            // Strip leading bullet marker for clean output
            const itemText = line.replace(/^([•\-\*]|\d+[\.\s])\s*/, '')
            parsedElements.push({
                type: 'list_item',
                text: itemText,
                rawLine: line,
            })
        } else {
            const prev = parsedElements[parsedElements.length - 1]
            if (prev && (prev.type === 'callout_title' || prev.type === 'callout_body')) {
                parsedElements.push({ type: 'callout_body', text: line, rawLine: line })
            } else {
                parsedElements.push({ type: 'paragraph', text: line, rawLine: line })
            }
        }
    }

    return (
        <div className={`space-y-3 text-[#1c1c1c] ${className}`}>
            {parsedElements.map((item, idx) => {
                if (item.type === 'h1') {
                    return (
                        <h1
                            key={idx}
                            className="text-lg md:text-xl font-bold tracking-tight text-[#1c1c1c] pt-2 pb-1 border-b border-[#b6ac9f]/30"
                        >
                            {parseInlineMarkdown(item.text)}
                        </h1>
                    )
                }

                if (item.type === 'h2') {
                    return (
                        <h2
                            key={idx}
                            className="text-base md:text-lg font-bold tracking-tight text-[#1c1c1c] pt-1.5"
                        >
                            {parseInlineMarkdown(item.text)}
                        </h2>
                    )
                }

                if (item.type === 'h3') {
                    return (
                        <h3
                            key={idx}
                            className="text-sm md:text-base font-semibold tracking-wide text-[#1c1c1c]"
                        >
                            {parseInlineMarkdown(item.text)}
                        </h3>
                    )
                }

                if (item.type === 'blockquote') {
                    return (
                        <div
                            key={idx}
                            className="p-3 my-2 bg-[#f4f1ea] border-l-4 border-[#1c1c1c] text-[12px] md:text-[13px] font-light text-[#1c1c1c]/90 leading-relaxed italic flex items-start gap-2"
                        >
                            <Quote size={14} className="text-[#1c1c1c]/40 shrink-0 mt-0.5" />
                            <div>{parseInlineMarkdown(item.text)}</div>
                        </div>
                    )
                }

                if (item.type === 'header') {
                    return (
                        <div
                            key={idx}
                            className="pt-2 pb-1 border-b border-[#b6ac9f]/30 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c]"
                        >
                            <Gift size={13} className="text-[#1c1c1c]/60 shrink-0" />
                            <span>{parseInlineMarkdown(item.text)}</span>
                        </div>
                    )
                }

                if (item.type === 'list_item') {
                    return (
                        <div key={idx} className="flex items-start gap-2.5 py-0.5 group">
                            <span className="shrink-0 w-4 h-4 rounded-full bg-[#1c1c1c]/10 text-[#1c1c1c] flex items-center justify-center text-[9px] mt-0.5 group-hover:bg-[#1c1c1c] group-hover:text-white transition-colors">
                                <Check size={10} strokeWidth={3} />
                            </span>
                            <span className="text-[13px] md:text-[14px] font-light leading-relaxed text-[#1c1c1c]/85">
                                {parseInlineMarkdown(item.text)}
                            </span>
                        </div>
                    )
                }

                if (item.type === 'callout_title') {
                    return (
                        <div
                            key={idx}
                            className="mt-3 p-3.5 rounded-none bg-[#f4f1ea] border border-[#b6ac9f]/40 space-y-1.5"
                        >
                            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1c1c1c]">
                                <HelpCircle size={15} className="text-amber-800 shrink-0" />
                                <span>{parseInlineMarkdown(item.text)}</span>
                            </div>
                        </div>
                    )
                }

                if (item.type === 'callout_body') {
                    return (
                        <div key={idx} className="p-3 bg-[#f4f1ea]/60 border-x border-b border-[#b6ac9f]/30 -mt-2">
                            <p className="text-[12px] md:text-[13px] font-light text-[#1c1c1c]/80 leading-relaxed">
                                {parseInlineMarkdown(item.text)}
                            </p>
                        </div>
                    )
                }

                return (
                    <p key={idx} className="text-[13px] md:text-[14px] font-light leading-[1.85] text-[#1c1c1c]/80">
                        {parseInlineMarkdown(item.text)}
                    </p>
                )
            })}
        </div>
    )
}

export default FormattedProductDescription
