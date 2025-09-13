import TurndownService, { Options } from "turndown";

export const markdownTransform = async (
  html: string | null | undefined,
): Promise<string> => {
  if (!html) return "";

  const turndownService = new TurndownService({ headingStyle: "atx" });

  // Inline link rule
  turndownService.addRule("inlineLink", {
    filter: function (node: HTMLElement, options: Options): boolean {
      return (
        options.linkStyle === "inlined" &&
        node.nodeName === "A" &&
        !!node.getAttribute("href")
      );
    },
    replacement: function (content, node) {
      const href = (node as HTMLElement).getAttribute("href")?.trim() ?? "";
      const titleAttr = (node as HTMLElement).title?.trim();
      const title = titleAttr ? ` "${titleAttr}"` : "";
      return `[${content.trim()}](${href}${title})\n`;
    },
  });

  try {
    let markdownContent = turndownService.turndown(html);
    markdownContent = processMultiLineLinks(markdownContent);
    markdownContent = removeSkipToContentLinks(markdownContent);
    return markdownContent;
  } catch (error) {
    console.error("Error converting HTML to Markdown", { error });
    return "";
  }
};

function processMultiLineLinks(markdownContent: string): string {
  let insideLink = false;
  let result = "";
  let linkOpenCount = 0;

  for (const char of markdownContent) {
    if (char === "[") linkOpenCount++;
    if (char === "]") linkOpenCount = Math.max(0, linkOpenCount - 1);
    insideLink = linkOpenCount > 0;

    result += insideLink && char === "\n" ? "\\\n" : char;
  }

  return result;
}

function removeSkipToContentLinks(markdownContent: string): string {
  return markdownContent.replace(/\[Skip to Content\]\(#[^)]*\)/gi, "");
}
