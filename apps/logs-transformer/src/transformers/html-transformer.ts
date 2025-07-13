import { load } from "cheerio";

const excludeNonMainTags = [
  "header",
  "footer",
  "nav",
  "aside",
  ".header",
  ".top",
  ".navbar",
  "#header",
  ".footer",
  ".bottom",
  "#footer",
  ".sidebar",
  ".side",
  ".aside",
  "#sidebar",
  ".modal",
  ".popup",
  "#modal",
  ".overlay",
  ".ad",
  ".ads",
  ".advert",
  "#ad",
  ".lang-selector",
  ".language",
  "#language-selector",
  ".social",
  ".social-media",
  ".social-links",
  "#social",
  ".menu",
  ".navigation",
  "#nav",
  ".breadcrumbs",
  "#breadcrumbs",
  ".share",
  "#share",
  ".widget",
  "#widget",
  ".cookie",
  "#cookie",
];

const forceIncludeMainTags = [
  "#main",
  ".swoogo-cols",
  ".swoogo-text",
  ".swoogo-table-div",
  ".swoogo-space",
  ".swoogo-alert",
  ".swoogo-sponsors",
  ".swoogo-title",
  ".swoogo-tabs",
  ".swoogo-logo",
  ".swoogo-image",
  ".swoogo-button",
  ".swoogo-agenda",
];

export const html_transform = async (
  html: string,
  url: string,
  scrapeOptions: {
    onlyMainContent: boolean;
    includeTags: string[];
    excludeTags: string[];
  },
) => {
  const soup = load(html);

  soup("script, style, noscript, meta, head").remove();

  if (scrapeOptions.onlyMainContent) {
    excludeNonMainTags.forEach((tag) => {
      const elementsToRemove = soup(tag).filter(
        forceIncludeMainTags.map((x) => ":not(:has(" + x + "))").join(""),
      );

      elementsToRemove.remove();
    });
  }

  // always return biggest image
  soup("img[srcset]").each((_, el) => {
    const sizes = (el.attribs.srcset || "").split(",").map((x) => {
      const tok = x.trim().split(" ");
      return {
        url: tok[0],
        size: parseInt((tok[1] ?? "1x").slice(0, -1), 10),
        isX: (tok[1] ?? "").endsWith("x"),
      };
    });

    if (sizes.every((x) => x.isX) && el.attribs.src) {
      sizes.push({
        url: el.attribs.src,
        size: 1,
        isX: true,
      });
    }

    sizes.sort((a, b) => b.size - a.size);

    el.attribs.src = sizes[0]?.url || "";
  });

  // absolute links
  soup("img[src]").each((_, el) => {
    try {
      el.attribs.src = new URL(el.attribs.src || "", url).href;
    } catch (error) {
      console.error("Error in image link transformation: ", error);
    }
  });
  soup("a[href]").each((_, el) => {
    try {
      el.attribs.href = new URL(el.attribs.href || "", url).href;
    } catch (error) {
      console.error("Error in href link transformation: ", error);
    }
  });

  const cleanedHtml = soup.html();
  return cleanedHtml;
};
