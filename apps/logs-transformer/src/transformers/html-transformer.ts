import koffi, { KoffiFunction } from "koffi";
import { join } from "path";
import { stat } from "fs/promises";
import { platform } from "os";
import { AnyNode, Cheerio, load } from "cheerio";

const rustExecutablePath = join(
  process.cwd(),
  "sharedLibs/html-transformer/target/release/",
  platform() === "darwin"
    ? "libhtml_transformer.dylib"
    : platform() === "win32"
      ? "html_transformer.dll"
      : "libhtml_transformer.so",
);

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

type TransformHtmlOptions = {
  html: string;
  include_tags: string[];
  exclude_tags: string[];
  only_main_content: boolean;
};

class RustHTMLTransformer {
  private static instance: RustHTMLTransformer;
  private _extractLinks: KoffiFunction;
  private _extractMetadata: KoffiFunction;
  private _transformHtml: KoffiFunction;
  private _freeString: KoffiFunction;
  private _getInnerJSON: KoffiFunction;

  private constructor() {
    const lib = koffi.load(rustExecutablePath);
    this._freeString = lib.func("free_string", "void", ["string"]);
    const cstn = "CString:" + crypto.randomUUID();
    const freedResultString = koffi.disposable(
      cstn,
      "string",
      this._freeString,
    );
    this._extractLinks = lib.func("extract_links", freedResultString, [
      "string",
    ]);
    this._extractMetadata = lib.func("extract_metadata", freedResultString, [
      "string",
    ]);
    this._transformHtml = lib.func("transform_html", freedResultString, [
      "string",
    ]);
    this._getInnerJSON = lib.func("get_inner_json", freedResultString, [
      "string",
    ]);
  }

  public static async getInstance(): Promise<RustHTMLTransformer> {
    if (!RustHTMLTransformer.instance) {
      try {
        await stat(rustExecutablePath);
      } catch (_) {
        throw Error("Rust html-transformer shared library not found");
      }
      RustHTMLTransformer.instance = new RustHTMLTransformer();
    }
    return RustHTMLTransformer.instance;
  }

  public async extractLinks(html: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this._extractLinks.async(html, (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(res));
        }
      });
    });
  }

  public async extractMetadata(html: string): Promise<any> {
    return new Promise<string[]>((resolve, reject) => {
      this._extractMetadata.async(html, (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(res));
        }
      });
    });
  }

  public async transformHtml(opts: TransformHtmlOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._transformHtml.async(
        JSON.stringify(opts),
        (err: Error, res: string) => {
          if (err) {
            reject(err);
          } else {
            if (res === "RUSTFC:ERROR") {
              reject(new Error("Something went wrong on the Rust side."));
            } else {
              resolve(res);
            }
          }
        },
      );
    });
  }

  public async getInnerJSON(html: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._getInnerJSON.async(html, (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          if (res === "RUSTFC:ERROR") {
            reject(new Error("Something went wrong on the Rust side."));
          } else {
            resolve(res);
          }
        }
      });
    });
  }
}

async function transformHtml(opts: TransformHtmlOptions): Promise<string> {
  const converter = await RustHTMLTransformer.getInstance();
  return await converter.transformHtml(opts);
}

export const html_transform = async (
  html: string,
  url: string,
  scrapeOptions: {
    onlyMainContent: boolean;
    includeTags: string[];
    excludeTags: string[];
  },
) => {
  try {
    return await transformHtml({
      html,
      include_tags: (scrapeOptions.includeTags ?? [])
        .map((x) => x.trim())
        .filter((x) => x.length !== 0),
      exclude_tags: (scrapeOptions.excludeTags ?? [])
        .map((x) => x.trim())
        .filter((x) => x.length !== 0),
      only_main_content: scrapeOptions.onlyMainContent,
    });
  } catch (error) {
    console.warn(
      "Failed to call html-transformer! Falling back to cheerio...",
      error as Error,
    );
  }

  let soup = load(html);

  // remove unwanted elements
  if (
    scrapeOptions.includeTags &&
    scrapeOptions.includeTags.filter((x) => x.trim().length !== 0).length > 0
  ) {
    // Create a new root element to hold the tags to keep
    const newRoot = load("<div></div>")("div");
    scrapeOptions.includeTags.forEach((tag) => {
      soup(tag).each((_, element) => {
        newRoot.append(soup(element).clone());
      });
    });

    soup = load(newRoot.html() ?? "");
  }

  soup("script, style, noscript, meta, head").remove();

  if (
    scrapeOptions.excludeTags &&
    scrapeOptions.excludeTags.filter((x) => x.trim().length !== 0).length > 0
  ) {
    scrapeOptions.excludeTags.forEach((tag) => {
      let elementsToRemove: Cheerio<AnyNode>;
      if (tag.startsWith("") && tag.endsWith("")) {
        let classMatch = false;

        const regexPattern = new RegExp(tag.slice(1, -1), "i");
        elementsToRemove = soup("*").filter((i, element) => {
          if (element.type === "tag") {
            const attributes = element.attribs;
            const tagNameMatches = regexPattern.test(element.name);
            const attributesMatch = Object.keys(attributes).some((attr) =>
              regexPattern.test(`${attr}="${attributes[attr]}"`),
            );
            if (tag.startsWith("*.")) {
              classMatch = Object.keys(attributes).some((attr) =>
                regexPattern.test(`class="${attributes[attr]}"`),
              );
            }
            return tagNameMatches || attributesMatch || classMatch;
          }
          return false;
        });
      } else {
        elementsToRemove = soup(tag);
      }
      elementsToRemove.remove();
    });
  }

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
    } catch (_) {}
  });
  soup("a[href]").each((_, el) => {
    try {
      el.attribs.href = new URL(el.attribs.href || "", url).href;
    } catch (_) {}
  });

  const cleanedHtml = soup.html();
  return cleanedHtml;
};
