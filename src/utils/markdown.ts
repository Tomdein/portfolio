import showdown from 'showdown';
import DOMPurify from 'dompurify';

const converter = new showdown.Converter({
    noHeaderId: true,
    tables: true,
    strikethrough: true,
});

/**
 * Converts Markdown to sanitized HTML, keeping block-level structure
 * (showdown wraps top-level text in <p> tags).
 * Use as the source for dangerouslySetInnerHTML on a <div> container.
 */
export function mdToHtml(md: string): string {
    if (!md) return '';
    return DOMPurify.sanitize(converter.makeHtml(md));
}

/**
 * Converts Markdown to sanitized inline HTML, stripping the outer <p>…</p>
 * that showdown adds. Use when setting dangerouslySetInnerHTML on an existing
 * block element (e.g. <p>, <cite>) so you don't get nested paragraphs.
 */
export function mdToInlineHtml(md: string): string {
    if (!md) return '';
    const html = DOMPurify.sanitize(converter.makeHtml(md));
    // Strip a single wrapping <p>…</p> produced by showdown for simple text
    return html.replace(/^<p>([\s\S]*)<\/p>\s*$/, '$1').trim();
}

/**
 * Walks all text nodes inside `container` and wraps each word in:
 *   <span class={wordClass}><span class={innerClass}>word</span></span>
 *
 * Used by the About component so GSAP can animate individual words even after
 * markdown HTML has been injected via innerHTML.
 */
export function wrapTextWords(
    container: HTMLElement,
    wordClass: string,
    innerClass: string,
): void {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
        const t = node as Text;
        if (t.textContent?.trim()) textNodes.push(t);
    }

    for (const textNode of textNodes) {
        const text = textNode.textContent ?? '';
        const frag = document.createDocumentFragment();
        // Split on whitespace runs, preserving them as separate tokens
        const parts = text.split(/(\s+)/);
        for (const part of parts) {
            if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(part));
            } else if (part) {
                const outer = document.createElement('span');
                outer.className = wordClass;
                const inner = document.createElement('span');
                inner.className = innerClass;
                inner.textContent = part;
                outer.appendChild(inner);
                frag.appendChild(outer);
            }
        }
        textNode.parentNode?.replaceChild(frag, textNode);
    }
}
