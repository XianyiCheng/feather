export interface EmailAddress {
  name: string;
  email: string;
}

export interface Attachment {
  id: string;       // Gmail attachment ID
  messageId: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface Email {
  id: string;
  provider: "gmail" | "outlook";
  threadId: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  hasAttachments: boolean;
  attachments: Attachment[];
}

export interface EmailThread {
  id: string; // threadId (Gmail) or conversationId (Outlook)
  provider: "gmail" | "outlook";
  subject: string; // cleaned subject (no Re:/Fwd:)
  snippet: string; // snippet from latest message
  participants: EmailAddress[];
  messageCount: number;
  messages: Email[]; // ordered oldest → newest
  latestDate: string;
  isRead: boolean; // true only if ALL messages are read
  isStarred: boolean;
  hasAttachments: boolean;
}

export interface ThreadListResult {
  threads: EmailThread[];
  nextPageToken?: string;
}

export interface EmailListParams {
  folder?: string;
  query?: string;
  pageToken?: string;
  maxResults?: number;
}

export interface EmailListResult {
  emails: Email[];
  nextPageToken?: string;
}

export interface ForwardedAttachment {
  id: string;       // Gmail attachment ID
  messageId: string; // Source message ID
  filename: string;
  mimeType: string;
  size: number;
}

export interface UploadedAttachment {
  filename: string;
  mimeType: string;
  size: number;
  base64Data: string; // standard base64-encoded file content
}

export interface SendEmailParams {
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body: string;
  replyToMessageId?: string; // Gmail message ID being replied to (for In-Reply-To/References headers)
  threadId?: string;          // Gmail thread ID (for Gmail API threading)
  attachments?: ForwardedAttachment[];
  uploadedAttachments?: UploadedAttachment[];
}

export interface DraftParams {
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body: string;
  threadId?: string;
  attachments?: ForwardedAttachment[];
}

export interface GmailDraft {
  id: string;
  threadId?: string;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  subject: string;
  body: string;
}

export interface EmailClient {
  listThreads(accessToken: string, params: EmailListParams): Promise<ThreadListResult>;
  getThread(accessToken: string, threadId: string): Promise<EmailThread>;
  listEmails(accessToken: string, params: EmailListParams): Promise<EmailListResult>;
  getEmail(accessToken: string, messageId: string): Promise<Email>;
  archiveEmail(accessToken: string, messageId: string): Promise<void>;
  archiveThread(accessToken: string, threadId: string): Promise<void>;
  moveToDone(accessToken: string, threadId: string): Promise<void>;
  moveToInbox(accessToken: string, threadId: string): Promise<void>;
  markAsRead(accessToken: string, messageId: string): Promise<void>;
  markThreadAsRead(accessToken: string, threadId: string): Promise<void>;
  sendEmail(accessToken: string, params: SendEmailParams): Promise<void>;
  searchEmails(accessToken: string, query: string, maxResults?: number): Promise<EmailListResult>;
  createDraft(accessToken: string, params: DraftParams): Promise<GmailDraft>;
  updateDraft(accessToken: string, draftId: string, params: DraftParams): Promise<GmailDraft>;
  markThreadAsUnread(accessToken: string, threadId: string): Promise<void>;
  deleteDraft(accessToken: string, draftId: string): Promise<void>;
  getDraftsForThread(accessToken: string, threadId: string): Promise<GmailDraft | null>;
  getAttachment(accessToken: string, messageId: string, attachmentId: string): Promise<{ data: string }>;
}

export function cleanSubject(subject: string): string {
  // Strip Re:/Fwd:/Fw: prefixes and [EXTERNAL]/[WARNING - EXTERNAL] tags
  return subject
    .replace(/\[[\w\s-]*EXTERNAL[\w\s-]*\]\s*/gi, "")
    .replace(/^(Re:\s*|Fwd:\s*|Fw:\s*)+/i, "")
    .trim();
}

export function uniqueParticipants(messages: Email[]): EmailAddress[] {
  const seen = new Set<string>();
  const result: EmailAddress[] = [];
  for (const msg of messages) {
    for (const addr of [msg.from, ...msg.to, ...msg.cc]) {
      if (addr.email && !seen.has(addr.email)) {
        seen.add(addr.email);
        result.push(addr);
      }
    }
  }
  return result;
}
