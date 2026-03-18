import { google } from "googleapis";

function getDocsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.docs({ version: "v1", auth });
}

export interface DocContent {
  title: string;
  plainText: string;
}

function extractPlainText(doc: any): string {
  const content = doc.body?.content ?? [];
  const parts: string[] = [];

  for (const element of content) {
    if (element.paragraph) {
      for (const pe of element.paragraph.elements ?? []) {
        if (pe.textRun?.content) {
          parts.push(pe.textRun.content);
        }
      }
    } else if (element.table) {
      for (const row of element.table.tableRows ?? []) {
        for (const cell of row.tableCells ?? []) {
          for (const ce of cell.content ?? []) {
            if (ce.paragraph) {
              for (const pe of ce.paragraph.elements ?? []) {
                if (pe.textRun?.content) {
                  parts.push(pe.textRun.content);
                }
              }
            }
          }
        }
      }
    }
  }

  return parts.join("").trim();
}

export async function getDoc(
  accessToken: string,
  docId: string
): Promise<DocContent> {
  const docs = getDocsClient(accessToken);
  const res = await docs.documents.get({ documentId: docId });
  const doc = res.data;
  return {
    title: doc.title ?? "Untitled",
    plainText: extractPlainText(doc),
  };
}
