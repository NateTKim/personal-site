import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ImageOff } from "lucide-react";

/**
 * A screenshot from public/orin/. If the file isn't there yet, a visible
 * TODO box is rendered instead, so a missing image is never silently hidden.
 * Checked at build time; the page stays static.
 */
export function Screenshot({
  file,
  alt,
  caption,
  width = 1600,
  height = 1000,
}: {
  file: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", "orin", file));

  return (
    <figure className="mt-8">
      {exists ? (
        <Image
          src={`/orin/${file}`}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full rounded-2xl shadow-card-lg ring-1 ring-sand-900/10"
        />
      ) : (
        <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[oklch(0.8_0.09_72)] bg-[oklch(0.97_0.03_80)] p-6 text-center">
          <ImageOff className="size-6 text-[oklch(0.5_0.11_68)]" aria-hidden />
          <p className="text-sm font-semibold text-[oklch(0.42_0.1_68)]">TODO: screenshot</p>
          <p className="max-w-sm text-sm text-[oklch(0.42_0.1_68)]">
            Add <code className="font-mono">public/orin/{file}</code>: {alt}
          </p>
        </div>
      )}
      <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
