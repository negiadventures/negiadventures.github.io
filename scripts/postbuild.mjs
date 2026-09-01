import { copyFileSync, existsSync, mkdirSync } from "node:fs";

/**
 * The old Jekyll site served /blog/ (trailing slash, 200) and /blog 301'd to it.
 * Next's static export only emits out/blog.html, which GitHub Pages serves at
 * /blog but not /blog/. Emit both so no existing link breaks.
 */
if (existsSync("out/blog.html")) {
  mkdirSync("out/blog", { recursive: true });
  copyFileSync("out/blog.html", "out/blog/index.html");
  console.log("postbuild: wrote out/blog/index.html");
}
