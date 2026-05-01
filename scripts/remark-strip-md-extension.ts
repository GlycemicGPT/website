/**
 * Strips .md / .mdx extensions from relative markdown link URLs.
 *
 * Source repo docs use standard markdown convention for internal links:
 *   [Acknowledgments](./acknowledgments.md)
 *   [Section](../foo/bar.md#anchor)
 *
 * That works on GitHub's markdown renderer (we don't break docs viewed in
 * the source repo). On the website those need to become extension-less so
 * they resolve to Fumadocs page URLs:
 *   /docs/platform/concepts/acknowledgments
 *   /docs/platform/foo/bar#anchor
 *
 * Skips:
 *   - absolute URLs (http://, https://, mailto:, tel:, //)
 *   - root-relative paths (/foo/bar.md)  — those are already-resolved hrefs
 *   - URLs that don't end in .md / .mdx
 */

import { visit } from "unist-util-visit";
import type { Root, Link } from "mdast";

export function remarkStripMdExtension() {
  return (tree: Root) => {
    visit(tree, "link", (node: Link) => {
      const url = node.url;
      if (!url) return;

      // Absolute / external URLs — leave alone
      if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return;
      if (url.startsWith("//")) return;
      if (url.startsWith("/")) return;

      // Match optional path + .md/.mdx + optional #anchor or ?query
      const match = url.match(/^(.*?)\.(md|mdx)(#[^?]*)?(\?.*)?$/i);
      if (!match) return;

      const [, base, , anchor = "", query = ""] = match;
      node.url = `${base}${anchor}${query}`;
    });
  };
}
