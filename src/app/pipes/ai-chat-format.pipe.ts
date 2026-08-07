import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Negrito/itálico/código inline (markdown comum em respostas de IA). */
function formatInline(raw: string): string {
  let s = escapeHtml(raw);

  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

  // ***texto*** ou ___texto___
  s = s.replace(/\*\*\*([^*\n]+?)\*\*\*/g, '<strong>$1</strong>');
  s = s.replace(/___([^_\n]+?)___/g, '<strong>$1</strong>');

  let prev = '';
  while (s !== prev) {
    prev = s;
    s = s.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_\n]+?)__/g, '<strong>$1</strong>');
  }

  // *itálico* (evita ** já convertido)
  s = s.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');

  // Marcadores ** ou * soltos que sobraram
  s = s.replace(/\*\*/g, '');
  s = s.replace(/(^|\s)\*(\s|$)/g, '$1$2');

  return s;
}

function isBulletLine(line: string): { content: string } | null {
  const m = line.match(/^[\s]*(?:[-*•]|\u2022)\s+(.+)$/);
  return m ? { content: m[1] } : null;
}

function isNumberedLine(line: string): { content: string } | null {
  const m = line.match(/^[\s]*\d+[.)]\s+(.+)$/);
  return m ? { content: m[1] } : null;
}

function isHeaderLine(line: string): { content: string } | null {
  const m = line.match(/^#{1,4}\s+(.+)$/);
  return m ? { content: m[1] } : null;
}

/** Formatação de markdown leve para respostas da IA. */
export function formatAiChatMessage(text: string): string {
  const normalized = (text || '').replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const chunks: string[] = [];
  let listTag: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listTag) {
      chunks.push(listTag === 'ul' ? '</ul>' : '</ol>');
      listTag = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    const header = isHeaderLine(trimmed);
    if (header) {
      closeList();
      chunks.push(`<p class="ai-md-heading">${formatInline(header.content)}</p>`);
      continue;
    }

    const bullet = isBulletLine(trimmed);
    if (bullet) {
      if (listTag !== 'ul') {
        closeList();
        chunks.push('<ul class="ai-md-list">');
        listTag = 'ul';
      }
      chunks.push(`<li>${formatInline(bullet.content)}</li>`);
      continue;
    }

    const numbered = isNumberedLine(trimmed);
    if (numbered) {
      if (listTag !== 'ol') {
        closeList();
        chunks.push('<ol class="ai-md-list">');
        listTag = 'ol';
      }
      chunks.push(`<li>${formatInline(numbered.content)}</li>`);
      continue;
    }

    closeList();
    chunks.push(`<p class="ai-md-para">${formatInline(trimmed)}</p>`);
  }

  closeList();
  return chunks.join('') || formatInline(normalized);
}

@Pipe({ name: 'aiChatFormat' })
export class AiChatFormatPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (value == null || value === '') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(formatAiChatMessage(value));
  }
}
