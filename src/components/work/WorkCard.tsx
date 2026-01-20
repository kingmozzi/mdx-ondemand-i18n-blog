import Link from 'next/link';
import Image from 'next/image';
import type { Work } from 'contentlayer/generated';

type Props = {
  work: Work;
  locale: string;
  isFallback?: boolean;
};

function dateLabel(work: Work) {
  if (work.startDate && work.endDate) return `${work.startDate} - ${work.endDate}`;
  return work.date ?? '';
}

export function WorkCard({ work, locale, isFallback }: Props) {
  const href = `/${locale}/works/${work.slug}`;

  return (
    <Link
      href={href}
      className="bg-card border-border block overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
    >
      {/* thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {work.thumbnail ? (
          <Image
            src={work.thumbnail}
            alt={work.title}
            fill
            className="object-cover transition group-hover:scale-[1.01]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}
      </div>

      <div className="grid gap-2 p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg leading-snug font-bold">{work.title}</h3>

          {isFallback ? (
            <span className="text-destructive mt-0.5 shrink-0 text-[10px] font-bold">
              ※ {work.language}
            </span>
          ) : null}
        </div>

        {/* Stack chips */}
        {work.stack?.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {work.stack.slice(0, 6).map((s) => (
              <li
                key={s}
                className="bg-background/40 text-foreground border-border/70 rounded-full border px-2 py-[2px] text-[10px]"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Bottom bar */}
        <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span aria-hidden>🗓️</span>
            <span>{dateLabel(work)}</span>
          </div>

          <span className="text-primary font-semibold opacity-80">→</span>
        </div>
      </div>
    </Link>
  );
}
