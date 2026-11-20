import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Typography for long-form MDX pages, in the site's dark look. No MDX page exists
// right now (the /orin case study was removed in phase 2); @next/mdx requires this file.
const components: MDXComponents = {
  h1: (props) => (
    <h1 className="text-5xl display-type text-balance text-foreground text-glow sm:text-6xl" {...props} />
  ),
  h2: (props) => (
    <h2
      className="mt-16 scroll-mt-24 text-3xl display-type text-balance text-foreground text-glow sm:text-4xl"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-10 text-xl font-medium tracking-tight text-foreground" {...props} />,
  p: (props) => <p className="mt-5 text-[17px] leading-8 text-muted-foreground" {...props} />,
  ul: (props) => (
    <ul
      className="mt-5 flex list-disc flex-col gap-2.5 pl-6 text-[17px] leading-8 text-muted-foreground marker:text-subtle-foreground"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 flex list-decimal flex-col gap-2.5 pl-6 text-[17px] leading-8 text-muted-foreground marker:text-subtle-foreground"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  code: (props) => (
    <code
      className="rounded-md border border-frame-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-frame-border pl-5 text-muted-foreground italic"
      {...props}
    />
  ),
  a: ({ href = "", ...props }) => {
    const cls =
      "font-medium text-foreground underline underline-offset-4 decoration-white/30 hover:decoration-white/80";
    if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} className={cls} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props} />;
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
