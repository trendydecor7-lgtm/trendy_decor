'use client'

import React, { useState, useRef } from 'react'
import {
    Bold,
    Italic,
    Heading,
    List,
    ListOrdered,
    Quote,
    Sparkles,
    Eye,
    Edit3,
} from 'lucide-react'
import FormattedProductDescription from '@/components/product/FormattedProductDescription'

interface MarkdownEditorProps {
    value: string
    onChange: (val: string) => void
    placeholder?: string
    rows?: number
    className?: string
    id?: string
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = 'Enter handcrafted luxury description detailing materials, items included, and gifting occasions...',
    rows = 6,
    className = '',
    id = 'description-editor',
}) => {
    const [mode, setMode] = useState<'write' | 'preview'>('write')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Inserts or wraps text with markdown formatting at cursor/selection position
    const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = value.substring(start, end) || defaultText

        const replacement = `${prefix}${selected}${suffix}`
        const newValue = value.substring(0, start) + replacement + value.substring(end)

        onChange(newValue)

        // Set cursor position after edit
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(
                start + prefix.length,
                start + prefix.length + selected.length
            )
        }, 0)
    }

    const insertBlock = (blockText: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const prefixNewline = start > 0 && value[start - 1] !== '\n' ? '\n' : ''

        const replacement = `${prefixNewline}${blockText}\n`
        const newValue = value.substring(0, start) + replacement + value.substring(end)

        onChange(newValue)

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + replacement.length, start + replacement.length)
        }, 0)
    }

    return (
        <div className={`border border-[#b6ac9f]/40 bg-[#f4f1ea] rounded-none ${className}`}>
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#e8e3da]/80 border-b border-[#b6ac9f]/40 flex-wrap gap-2">
                {/* Formatting Tools */}
                <div className="flex items-center gap-1 flex-wrap">
                    <button
                        type="button"
                        onClick={() => insertFormatting('**', '**', 'bold text')}
                        title="Bold (**text**)"
                        className="p-1.5 hover:bg-[#1c1c1c]/10 text-[#1c1c1c] rounded transition-colors cursor-pointer"
                        aria-label="Bold"
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormatting('*', '*', 'italic text')}
                        title="Italic (*text*)"
                        className="p-1.5 hover:bg-[#1c1c1c]/10 text-[#1c1c1c] rounded transition-colors cursor-pointer"
                        aria-label="Italic"
                    >
                        <Italic size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertBlock('### Heading')}
                        title="Heading (### Heading)"
                        className="p-1.5 hover:bg-[#1c1c1c]/10 text-[#1c1c1c] rounded transition-colors cursor-pointer"
                        aria-label="Heading"
                    >
                        <Heading size={14} />
                    </button>
                    <div className="w-px h-4 bg-[#b6ac9f]/40 mx-1" />
                    <button
                        type="button"
                        onClick={() => insertBlock('- Item 1\n- Item 2\n- Item 3')}
                        title="Bullet List (- item)"
                        className="p-1.5 hover:bg-[#1c1c1c]/10 text-[#1c1c1c] rounded transition-colors cursor-pointer"
                        aria-label="Bullet List"
                    >
                        <List size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertBlock('1. First item\n2. Second item')}
                        title="Numbered List (1. item)"
                        className="p-1.5 hover:bg-[#1c1c1c]/10 text-[#1c1c1c] rounded transition-colors cursor-pointer"
                        aria-label="Numbered List"
                    >
                        <ListOrdered size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertBlock('> Note: Customization details here')}
                        title="Callout Box (> text)"
                        className="p-1.5 hover:bg-[#1c1c1c]/10 text-[#1c1c1c] rounded transition-colors cursor-pointer"
                        aria-label="Callout Box"
                    >
                        <Quote size={14} />
                    </button>
                    <div className="w-px h-4 bg-[#b6ac9f]/40 mx-1" />
                    <button
                        type="button"
                        onClick={() =>
                            insertBlock(
                                'INCLUDES:-\n- 1 Customisable Rakhi\n- 2 Customised Chocolates\n- 1 Personalised Card'
                            )
                        }
                        title="Insert Preset Package Includes List"
                        className="px-2 py-1 bg-[#1c1c1c] text-[#f4f1ea] hover:bg-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Sparkles size={11} />
                        <span>Insert Package List</span>
                    </button>
                </div>

                {/* Write / Preview Tab Switcher */}
                <div className="flex items-center gap-1 bg-[#1c1c1c]/10 p-0.5 border border-[#b6ac9f]/40">
                    <button
                        type="button"
                        onClick={() => setMode('write')}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                            mode === 'write'
                                ? 'bg-[#1c1c1c] text-white shadow-sm'
                                : 'text-[#1c1c1c]/70 hover:text-[#1c1c1c]'
                        }`}
                    >
                        <Edit3 size={11} />
                        <span>Write</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('preview')}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                            mode === 'preview'
                                ? 'bg-[#1c1c1c] text-white shadow-sm'
                                : 'text-[#1c1c1c]/70 hover:text-[#1c1c1c]'
                        }`}
                    >
                        <Eye size={11} />
                        <span>Live Preview</span>
                    </button>
                </div>
            </div>

            {/* Editor Body */}
            <div className="p-3">
                {mode === 'write' ? (
                    <textarea
                        id={id}
                        ref={textareaRef}
                        rows={rows}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-[13px] md:text-[14px] font-light text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 focus:outline-none resize-y leading-relaxed font-sans"
                    />
                ) : (
                    <div className="min-h-[140px] p-3 bg-white/70 border border-[#b6ac9f]/30">
                        {value.trim() ? (
                            <FormattedProductDescription description={value} />
                        ) : (
                            <p className="text-[12px] italic text-[#1c1c1c]/40">
                                Nothing to preview yet. Switch to Write mode to type description.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom helper text */}
            <div className="px-3 py-1.5 bg-[#e8e3da]/40 border-t border-[#b6ac9f]/20 flex items-center justify-between text-[10px] text-[#1c1c1c]/60 font-mono">
                <span>Markdown supported: **bold**, *italic*, ### Heading, - Lists, &gt; Callouts</span>
                <span>{value.length} chars</span>
            </div>
        </div>
    )
}

export default MarkdownEditor
