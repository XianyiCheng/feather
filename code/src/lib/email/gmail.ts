import { google } from "googleapis";
import type {
  Attachment, Email, EmailClient, EmailListParams, EmailListResult,
  EmailThread, ThreadListResult, SendEmailParams, DraftParams, GmailDraft,
  ForwardedAttachment,
} from "./types";
import { cleanSubject, uniqueParticipants } from "./types";

function getGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth });
}

function parseHeader(headers: any[], name: string): string {
  return headers?.find((h: any) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";
}

function parseEmailAddress(raw: string): { name: string; email: string } {
  const match = raw.match(/^(.+?)\s*<(.+?)>$/);
  if (match) return { name: match[1].trim().replace(/^"|"$/g, ""), email: match[2] };
  return { name: raw, email: raw };
}

function parseEmailAddresses(raw: string): { name: string; email: string }[] {
  if (!raw) return [];
  return raw.split(",").map((s) => parseEmailAddress(s.trim()));
}

function folderToQuery(folder?: string): string {
  switch (folder) {
    case "sent": return "in:sent";
    case "drafts": return "in:drafts";
    case "archive": return "-in:inbox -in:sent -in:drafts -in:trash -in:spam";
    case "done": return "label:done";
    case "inbox":
    default: return "in:inbox";
  }
}

async function getOrCreateLabel(gmail: ReturnType<typeof getGmailClient>, name: string): Promise<string> {
  const res = await gmail.users.labels.list({ userId: "me" });
  const existing = res.data.labels?.find((l: any) => l.name.toLowerCase() === name.toLowerCase());
  if (existing?.id) return existing.id;
  const created = await gmail.users.labels.create({
    userId: "me",
    requestBody: { name, labelListVisibility: "labelShow", messageListVisibility: "show" },
  });
  return created.data.id!;
}

function collectParts(payload: any): any[] {
  const result: any[] = [];
  if (!payload) return result;
  if (payload.parts) {
    for (const part of payload.parts) {
      result.push(...collectParts(part));
    }
  } else {
    result.push(payload);
  }
  return result;
}

function gmailMessageToEmail(message: any, includeBody: boolean): Email {
  const headers = message.payload?.headers || [];
  const labelIds = message.labelIds || [];
  const allParts = collectParts(message.payload);

  let body = "";
  const attachments: Attachment[] = [];
  const cidMap: Record<string, string> = {};

  if (includeBody && message.payload) {
    const htmlPart = allParts.find((p: any) => p.mimeType === "text/html");
    const textPart = allParts.find((p: any) => p.mimeType === "text/plain");
    const bodyData =
      htmlPart?.body?.data || textPart?.body?.data || message.payload.body?.data;
    if (bodyData) {
      body = Buffer.from(bodyData, "base64url").toString("utf-8");
    }
  }

  // Extract attachments and CID map for inline images
  for (const part of allParts) {
    const attachId = part.body?.attachmentId;
    const filename = part.filename;
    const mimeType = part.mimeType || "";

    if (attachId && filename) {
      attachments.push({
        id: attachId,
        messageId: message.id || "",
        filename,
        mimeType,
        size: part.body?.size || 0,
      });
    }

    // Build CID map for inline images
    if (attachId && mimeType.startsWith("image/")) {
      const cidHeader = (part.headers || []).find(
        (h: any) => h.name?.toLowerCase() === "content-id"
      );
      if (cidHeader) {
        const cid = cidHeader.value.replace(/^<|>$/g, "");
        cidMap[cid] = `/api/emails/${message.id}/attachments/${attachId}`;
      }
    }
  }

  // Replace cid: references with proxied URLs
  if (body && Object.keys(cidMap).length > 0) {
    for (const [cid, url] of Object.entries(cidMap)) {
      body = body.replace(new RegExp(`cid:${cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "g"), url);
    }
  }

  return {
    id: message.id || "",
    provider: "gmail",
    threadId: message.threadId || "",
    from: parseEmailAddress(parseHeader(headers, "From")),
    to: parseEmailAddresses(parseHeader(headers, "To")),
    cc: parseEmailAddresses(parseHeader(headers, "Cc")),
    subject: parseHeader(headers, "Subject"),
    snippet: message.snippet || "",
    body,
    date: parseHeader(headers, "Date"),
    isRead: !labelIds.includes("UNREAD"),
    isStarred: labelIds.includes("STARRED"),
    labels: labelIds,
    hasAttachments: attachments.length > 0,
    attachments,
  };
}

function messagesToThread(threadId: string, messages: Email[]): EmailThread {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const latest = sorted[sorted.length - 1];
  return {
    id: threadId,
    provider: "gmail",
    subject: cleanSubject(latest.subject || sorted[0].subject),
    snippet: latest.snippet,
    participants: uniqueParticipants(sorted),
    messageCount: sorted.length,
    messages: sorted,
    latestDate: latest.date,
    isRead: sorted.every((m) => m.isRead),
    isStarred: sorted.some((m) => m.isStarred),
    hasAttachments: sorted.some((m) => m.hasAttachments),
  };
}

export const gmailClient: EmailClient = {
  async listThreads(accessToken: string, params: EmailListParams): Promise<ThreadListResult> {
    const gmail = getGmailClient(accessToken);
    const q = params.query
      ? `${folderToQuery(params.folder)} ${params.query}`
      : folderToQuery(params.folder);

    const listRes = await gmail.users.threads.list({
      userId: "me",
      q,
      maxResults: params.maxResults || 30,
      pageToken: params.pageToken || undefined,
    });

    const threadIds = listRes.data.threads || [];

    const threads = await Promise.all(
      threadIds.map(async (t) => {
        const detail = await gmail.users.threads.get({
          userId: "me",
          id: t.id!,
          format: "metadata",
          metadataHeaders: ["From", "To", "Cc", "Subject", "Date"],
        });
        const messages = (detail.data.messages || []).map((m: any) =>
          gmailMessageToEmail(m, false)
        );
        return messagesToThread(t.id!, messages);
      })
    );

    return {
      threads,
      nextPageToken: listRes.data.nextPageToken || undefined,
    };
  },

  async getThread(accessToken: string, threadId: string): Promise<EmailThread> {
    const gmail = getGmailClient(accessToken);
    const detail = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
      format: "full",
    });
    const messages = (detail.data.messages || []).map((m: any) =>
      gmailMessageToEmail(m, true)
    );
    return messagesToThread(threadId, messages);
  },

  async listEmails(accessToken: string, params: EmailListParams): Promise<EmailListResult> {
    const gmail = getGmailClient(accessToken);
    const q = params.query
      ? `${folderToQuery(params.folder)} ${params.query}`
      : folderToQuery(params.folder);

    const listRes = await gmail.users.messages.list({
      userId: "me",
      q,
      maxResults: params.maxResults || 50,
      pageToken: params.pageToken || undefined,
    });

    const messageIds = listRes.data.messages || [];
    const emails = await Promise.all(
      messageIds.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "To", "Cc", "Subject", "Date"],
        });
        return gmailMessageToEmail(detail.data, false);
      })
    );

    return { emails, nextPageToken: listRes.data.nextPageToken || undefined };
  },

  async getEmail(accessToken: string, messageId: string): Promise<Email> {
    const gmail = getGmailClient(accessToken);
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });
    return gmailMessageToEmail(detail.data, true);
  },

  async archiveEmail(accessToken: string, messageId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: { removeLabelIds: ["INBOX"] },
    });
  },

  async archiveThread(accessToken: string, threadId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: { removeLabelIds: ["INBOX"] },
    });
  },

  async moveToDone(accessToken: string, threadId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    const labelId = await getOrCreateLabel(gmail, "Done");
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: { addLabelIds: [labelId], removeLabelIds: ["INBOX"] },
    });
  },

  async moveToInbox(accessToken: string, threadId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    const labelId = await getOrCreateLabel(gmail, "Done");
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: { addLabelIds: ["INBOX"], removeLabelIds: [labelId] },
    });
  },

  async markAsRead(accessToken: string, messageId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: { removeLabelIds: ["UNREAD"] },
    });
  },

  async markThreadAsRead(accessToken: string, threadId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: { removeLabelIds: ["UNREAD"] },
    });
  },

  async markThreadAsUnread(accessToken: string, threadId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: { addLabelIds: ["UNREAD"] },
    });
  },

  async sendEmail(accessToken: string, params: SendEmailParams): Promise<void> {
    const gmail = getGmailClient(accessToken);
    let attData: AttachmentData[] | undefined;
    if (params.attachments?.length) {
      attData = await fetchAttachmentData(accessToken, params.attachments);
    }
    const encodedMessage = buildRawMessage(params, attData);
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage, threadId: params.replyToMessageId || undefined },
    });
  },

  async searchEmails(accessToken: string, query: string, maxResults = 20): Promise<EmailListResult> {
    return gmailClient.listEmails(accessToken, { query, maxResults });
  },

  async createDraft(accessToken: string, params: DraftParams): Promise<GmailDraft> {
    const gmail = getGmailClient(accessToken);
    let attData: AttachmentData[] | undefined;
    if (params.attachments?.length) {
      attData = await fetchAttachmentData(accessToken, params.attachments);
    }
    const raw = buildRawMessage(params, attData);
    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: { raw, threadId: params.threadId || undefined },
      },
    });
    return parseDraftResponse(res.data);
  },

  async updateDraft(accessToken: string, draftId: string, params: DraftParams): Promise<GmailDraft> {
    const gmail = getGmailClient(accessToken);
    let attData: AttachmentData[] | undefined;
    if (params.attachments?.length) {
      attData = await fetchAttachmentData(accessToken, params.attachments);
    }
    const raw = buildRawMessage(params, attData);
    const res = await gmail.users.drafts.update({
      userId: "me",
      id: draftId,
      requestBody: {
        message: { raw, threadId: params.threadId || undefined },
      },
    });
    return parseDraftResponse(res.data);
  },

  async deleteDraft(accessToken: string, draftId: string): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.drafts.delete({ userId: "me", id: draftId });
  },

  async getAttachment(accessToken: string, messageId: string, attachmentId: string): Promise<{ data: string }> {
    const gmail = getGmailClient(accessToken);
    const res = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId,
      id: attachmentId,
    });
    return { data: res.data.data || "" };
  },

  async getDraftsForThread(accessToken: string, threadId: string): Promise<GmailDraft | null> {
    const gmail = getGmailClient(accessToken);
    // List drafts and check threadId from the summary (no extra API calls)
    const listRes = await gmail.users.drafts.list({ userId: "me" });
    const drafts = listRes.data.drafts || [];
    for (const d of drafts) {
      if (d.message?.threadId === threadId) {
        const detail = await gmail.users.drafts.get({ userId: "me", id: d.id!, format: "full" });
        return parseDraftResponse(detail.data);
      }
    }
    return null;
  },
};

interface AttachmentData {
  filename: string;
  mimeType: string;
  base64Data: string; // standard base64
}

function buildRawMessage(params: { to: { name: string; email: string }[]; cc?: { name: string; email: string }[]; bcc?: { name: string; email: string }[]; subject: string; body: string }, attachmentData?: AttachmentData[]): string {
  const toHeader = params.to.map((a) => a.name ? `${a.name} <${a.email}>` : a.email).join(", ");
  const ccHeader = params.cc?.filter(a => a.email).map((a) => a.name ? `${a.name} <${a.email}>` : a.email).join(", ") || "";
  const bccHeader = params.bcc?.filter(a => a.email).map((a) => a.name ? `${a.name} <${a.email}>` : a.email).join(", ") || "";

  let raw = `To: ${toHeader}\n`;
  if (ccHeader) raw += `Cc: ${ccHeader}\n`;
  if (bccHeader) raw += `Bcc: ${bccHeader}\n`;
  raw += `Subject: ${params.subject}\n`;
  raw += `MIME-Version: 1.0\n`;

  if (attachmentData && attachmentData.length > 0) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    raw += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;
    // HTML body part
    raw += `--${boundary}\n`;
    raw += `Content-Type: text/html; charset=utf-8\n\n`;
    raw += params.body + "\n\n";
    // Attachment parts
    for (const att of attachmentData) {
      raw += `--${boundary}\n`;
      raw += `Content-Type: ${att.mimeType}; name="${att.filename}"\n`;
      raw += `Content-Disposition: attachment; filename="${att.filename}"\n`;
      raw += `Content-Transfer-Encoding: base64\n\n`;
      raw += att.base64Data + "\n\n";
    }
    raw += `--${boundary}--\n`;
  } else {
    raw += `Content-Type: text/html; charset=utf-8\n\n`;
    raw += params.body;
  }

  return Buffer.from(raw).toString("base64url");
}

async function fetchAttachmentData(accessToken: string, attachments: ForwardedAttachment[]): Promise<AttachmentData[]> {
  const gmail = getGmailClient(accessToken);
  return Promise.all(
    attachments.map(async (att) => {
      const res = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: att.messageId,
        id: att.id,
      });
      // Gmail returns base64url data, convert to standard base64
      const base64Data = (res.data.data || "").replace(/-/g, "+").replace(/_/g, "/");
      return {
        filename: att.filename,
        mimeType: att.mimeType,
        base64Data,
      };
    })
  );
}

function parseDraftResponse(data: any): GmailDraft {
  const msg = data.message || {};
  const headers = msg.payload?.headers || [];
  return {
    id: data.id || "",
    threadId: msg.threadId || undefined,
    to: parseEmailAddresses(parseHeader(headers, "To")),
    cc: parseEmailAddresses(parseHeader(headers, "Cc")),
    bcc: parseEmailAddresses(parseHeader(headers, "Bcc")),
    subject: parseHeader(headers, "Subject"),
    body: (() => {
      const parts = msg.payload?.parts || [];
      const htmlPart = parts.find((p: any) => p.mimeType === "text/html");
      const textPart = parts.find((p: any) => p.mimeType === "text/plain");
      const bodyData = htmlPart?.body?.data || textPart?.body?.data || msg.payload?.body?.data;
      return bodyData ? Buffer.from(bodyData, "base64url").toString("utf-8") : "";
    })(),
  };
}
