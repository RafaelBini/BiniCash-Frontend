import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {

  constructor(private http: HttpClient) { }

  listConversations() {
    return this.http.get<any[]>(`${environment.apiHost}/ai-chat/conversations`);
  }

  getMessages(conversationId: number) {
    return this.http.get<any>(`${environment.apiHost}/ai-chat/conversations/${conversationId}/messages`);
  }

  sendMessage(message: string, conversationId?: number) {
    return this.http.post<any>(`${environment.apiHost}/ai-chat/chat`, {
      message,
      conversationId: conversationId || null,
    });
  }
}
