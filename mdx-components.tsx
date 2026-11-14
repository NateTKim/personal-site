import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Typography for long-form MDX pages (the /orin case study).
const components: MDXComponents = {
  h1: (props) => (
    <h1 className="font-display text-5xl font-medium tracking-tight text-balance sm:text-6xl" {...props} />
  ),
  h2: (props) => (
    <h2
      className="mt-16 scroll-mt-24 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-10 text-xl font-semibold tracking-tight" {...props} />,
  p: (props) => <p className="mt-5 text-[17px] leading-8 text-sand-800" {...props} />,
  ul: (props) => (
    <ul
      className="mt-5 flex list-disc flex-col gap-2.5 pl-6 text-[17px] leading-8 text-sand-800 marker:text-brand-400"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 flex list-decimal flex-col gap-2.5 pl-6 text-[17px] leading-8 text-sand-800 marker:text-brand-500"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  code: (props) => (
    <code
      className="rounded-md bg-sand-100 px-1.5 py-0.5 font-mono text-[0.9em] text-sand-900 ring-1 ring-sand-200"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-2 border-brand-300 pl-5 text-sand-700 italic" {...props} />
  ),
  a: ({ href = "", ...props }) => {
    const cls =
      "font-medium text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-600";
    if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} className={cls} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props} />;
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
