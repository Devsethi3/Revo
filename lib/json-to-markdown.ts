import { baseExtensions } from "@/components/rich-text-editor/extensions";
import { renderToMarkdown } from "@tiptap/static-renderer/pm/markdown";

function normalizeWhiteSpace(markdown: string) {
  return markdown
    .replace(/\s+$/gm, "") // trim trailing spaces per line
    .replace(/\n{3,}/g, "\n\n") // collapse >2 blank lines
    .trim();
}

export async function JSONToMarkdown(json: string) {
  // Parse the JSON string

  let content;

  try {
    content = JSON.parse(json);
  } catch {
    return "";
  }

  const markdown = renderToMarkdown({
    extensions: baseExtensions,
    content: content,
  });

  return normalizeWhiteSpace(markdown);
}
