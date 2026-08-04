/**
 * Sanitizes and cleans raw product descriptions that may contain
 * HTML tags (<br>, <p>, <li>), HTML entities (&nbsp;, &amp;, etc.), or messy whitespace.
 */
export function cleanProductDescription(rawText?: string): string {
    if (!rawText) return ''
    let text = rawText

    // Replace HTML break tags with line breaks
    text = text.replace(/<br\s*\/?>/gi, '\n')

    // Replace block tags
    text = text.replace(/<p\s*[^>]*>/gi, '\n\n')
    text = text.replace(/<\/p>/gi, '')
    text = text.replace(/<div\s*[^>]*>/gi, '\n')
    text = text.replace(/<\/div>/gi, '')
    text = text.replace(/<li\s*[^>]*>/gi, '\n• ')
    text = text.replace(/<\/li>/gi, '')
    text = text.replace(/<ul\s*[^>]*>/gi, '\n')
    text = text.replace(/<\/ul>/gi, '')
    text = text.replace(/<ol\s*[^>]*>/gi, '\n')
    text = text.replace(/<\/ol>/gi, '')

    // Decode common HTML entities
    text = text.replace(/&nbsp;/gi, ' ')
    text = text.replace(/&#160;/gi, ' ')
    text = text.replace(/&amp;/gi, '&')
    text = text.replace(/&#38;/gi, '&')
    text = text.replace(/&lt;/gi, '<')
    text = text.replace(/&#60;/gi, '<')
    text = text.replace(/&gt;/gi, '>')
    text = text.replace(/&#62;/gi, '>')
    text = text.replace(/&quot;/gi, '"')
    text = text.replace(/&#34;/gi, '"')
    text = text.replace(/&#39;/gi, "'")
    text = text.replace(/&apos;/gi, "'")
    text = text.replace(/&bull;/gi, '•')
    text = text.replace(/&mdash;/gi, '—')
    text = text.replace(/&ndash;/gi, '–')

    // Strip any remaining unhandled HTML tags
    text = text.replace(/<[^>]*>/g, '')

    // Clean up per-line trailing spaces and multiple blank lines
    const lines = text
        .split('\n')
        .map((line) => line.trimEnd())
        .join('\n')

    return lines.replace(/\n{3,}/g, '\n\n').trim()
}
