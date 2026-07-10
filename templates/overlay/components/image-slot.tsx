import Image from "next/image";

/**
 * ImageSlot — a generation-ready image placeholder that reserves exact space.
 *
 * Space is reserved by `aspect-ratio` on the container, so a placeholder and the real
 * image occupy IDENTICAL space → swapping in a generated image causes ZERO layout shift.
 *
 * Now (no src): renders a labeled, sized placeholder box + records intent via alt.
 * Later (src set): renders next/image (fill, object-cover) at the same dimensions.
 *
 * Track each slot in .site/media.json so a later pass can generate the real images.
 */
type Ratio = `${number}/${number}`;

export function ImageSlot({
  id,
  alt,
  ratio = "16/9",
  src,
  priority = false,
  sizes = "100vw",
  className = "",
}: {
  id: string;
  alt: string;
  ratio?: Ratio;
  src?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const [w, h] = ratio.split("/").map(Number);
  return (
    <div
      data-image-slot={id}
      style={{ aspectRatio: `${w} / ${h}` }}
      className={`relative w-full overflow-hidden rounded-lg bg-muted ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center p-4 text-center
                     [background:repeating-linear-gradient(45deg,transparent,transparent_10px,color-mix(in_oklch,var(--muted-foreground)_8%,transparent)_10px,color-mix(in_oklch,var(--muted-foreground)_8%,transparent)_20px)]"
        >
          <span className="font-mono text-xs text-muted-foreground">
            {id} · {ratio} · image to be generated
          </span>
          <span className="sr-only">Image placeholder for: {alt}</span>
        </div>
      )}
    </div>
  );
}
