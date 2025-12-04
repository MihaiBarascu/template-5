/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Use this when inserting user-provided content into HTML templates.
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char])
}

/**
 * Escapes HTML and converts newlines to <br> tags.
 * Use for user messages that should preserve line breaks.
 */
export function escapeHtmlWithLineBreaks(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>')
}
