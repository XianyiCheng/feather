/**
 * Server-side cache of the browser's current UI state.
 * The browser pushes updates here; the CLI reads from here.
 */

export interface UiState {
  openThread: {
    id: string;
    subject: string;
    messageCount: number;
    latestDate: string;
    participants: { name: string; email: string }[];
    messages: {
      id: string;
      from: { name: string; email: string };
      to: { name: string; email: string }[];
      cc: { name: string; email: string }[];
      subject: string;
      snippet: string;
      body: string;
      date: string;
    }[];
  } | null;
  activeFolder: string;
  selectedIndex: number;
  draft: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
  };
  theme: string;
}

const globalForState = globalThis as unknown as { __uiState: UiState };

if (!globalForState.__uiState) {
  globalForState.__uiState = {
    openThread: null,
    activeFolder: "inbox",
    selectedIndex: 0,
    draft: { to: "", cc: "", bcc: "", subject: "", body: "" },
    theme: "dark",
  };
}

export const uiState: UiState = globalForState.__uiState;

export function updateUiState(partial: Partial<UiState>) {
  Object.assign(uiState, partial);
}
