import fs from "fs";
import path from "path";

const AGENT_DIR = path.join(process.cwd(), "agent");

/**
 * Reads all markdown files from the agent/ folder and returns their contents
 * as a single string for the AI system prompt.
 */
export function loadAgentContext(): string {
  try {
    if (!fs.existsSync(AGENT_DIR)) return "";

    const files = fs.readdirSync(AGENT_DIR).filter((f) => f.endsWith(".md"));
    if (files.length === 0) return "";

    const sections = files.map((file) => {
      const content = fs.readFileSync(path.join(AGENT_DIR, file), "utf-8").trim();
      return `--- ${file} ---\n${content}`;
    });

    return "\n\n--- USER PREFERENCES (from agent/ folder) ---\n" + sections.join("\n\n") + "\n--- END PREFERENCES ---";
  } catch (error) {
    console.error("Failed to load agent context:", error);
    return "";
  }
}
