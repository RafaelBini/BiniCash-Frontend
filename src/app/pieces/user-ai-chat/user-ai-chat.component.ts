import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { AiChatService } from 'src/app/services/ai-chat.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-user-ai-chat',
  templateUrl: './user-ai-chat.component.html',
  styleUrls: ['./user-ai-chat.component.css']
})
export class UserAiChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBox') scrollBox?: ElementRef<HTMLDivElement>;

  isOpen = false;
  private historyLoaded = false;
  private scrollToBottomPending = false;
  conversationId: number | null = null;
  messages: { role: string; content: string; createdAt?: string }[] = [];
  draft = '';
  isLoading = false;
  isSending = false;
  error = '';

  constructor(private aiChat: AiChatService) { }

  ngOnInit() {
    // Histórico carregado ao abrir o painel
  }

  ngAfterViewChecked() {
    if (!this.scrollToBottomPending || !this.scrollBox) {
      return;
    }
    const el = this.scrollBox.nativeElement;
    el.scrollTop = el.scrollHeight;
    this.scrollToBottomPending = false;
  }

  private markScrollToBottom() {
    this.scrollToBottomPending = true;
  }

  async openChat() {
    this.isOpen = true;
    this.markScrollToBottom();
    if (!this.historyLoaded) {
      this.historyLoaded = true;
      await this.loadLatestConversation();
    } else {
      this.markScrollToBottom();
    }
  }

  closeChat() {
    this.isOpen = false;
  }

  async loadLatestConversation() {
    this.isLoading = true;
    this.error = '';
    try {
      const conversations = await this.aiChat.listConversations().toPromise() || [];
      if (conversations.length) {
        const id = conversations[0].id;
        this.conversationId = id;
        const data = await this.aiChat.getMessages(id).toPromise();
        this.messages = (data.messages || []).filter((m: any) => m.role === 'user' || m.role === 'assistant');
      }
    } catch (e) {
      this.error = 'Não foi possível carregar o histórico do assistente.';
    } finally {
      this.isLoading = false;
      this.markScrollToBottom();
    }
  }

  async send() {
    const text = this.draft.trim();
    if (!text || this.isSending) {
      return;
    }

    this.messages = [...this.messages, { role: 'user', content: text }];
    this.draft = '';
    this.isSending = true;
    this.error = '';
    this.markScrollToBottom();

    try {
      const res = await this.aiChat.sendMessage(text, this.conversationId ?? undefined)
        .pipe(timeout(100000))
        .toPromise();
      this.conversationId = res.conversationId != null ? Number(res.conversationId) : null;
      this.messages = [...this.messages, {
        role: 'assistant',
        content: res.message.content,
        createdAt: res.message.createdAt,
      }];
    } catch (e) {
      const err = e as { name?: string };
      if (err && err.name === 'TimeoutError') {
        this.error = 'A resposta demorou demais. Tente novamente em instantes.';
      } else {
        this.error = 'Falha ao enviar mensagem. Verifique se o backend e a GEMINI_API_KEY estão configurados.';
      }
      this.messages = this.messages.slice(0, -1);
      this.draft = text;
    } finally {
      this.isSending = false;
      this.markScrollToBottom();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
