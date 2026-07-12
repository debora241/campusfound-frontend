import { apiClient } from "./apiClient";

export interface Conversation {
  userId: string;
  fullName: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
}

export interface ThreadMessage {
  id: string;
  fromMe: boolean;
  body: string;
  sentAt: string;
}

export const messagesApi = {
  listConversations: (token: string) => apiClient.get<Conversation[]>("/messages/conversations", token),
  getThread: (token: string, userId: string) => apiClient.get<ThreadMessage[]>(`/messages/conversations/${userId}`, token),
  send: (token: string, userId: string, body: string) =>
    apiClient.post(`/messages/conversations/${userId}`, { body }, token),
};
