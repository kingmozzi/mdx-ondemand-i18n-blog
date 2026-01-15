import Image from 'next/image';
import Link from 'next/link';
import { MapPinHouse } from 'lucide-react';
import { profiles } from '@/lib/profile';

export function AboutSection({ locale }: { locale: string }) {
  const p = profiles[locale] ?? profiles.en;

  return (
    <section className="space-y-6 rounded-xl">
      <div className="flex w-full flex-wrap justify-between gap-2">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold lg:text-4xl">{p.name}</h1>

          <Link
            href={p.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background-surface text-text-secondary inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm font-semibold hover:underline"
          >
            <MapPinHouse className="size-4" />
            <span className="underline">{p.locationLabel}</span>
          </Link>
        </div>

        <div className="bg-background-secondary relative h-16 w-16 overflow-hidden rounded-xl border">
          <Image
            alt="Hero Image"
            src={p.avatarSrc}
            width={64}
            height={64}
            className="object-cover"
            style={{
              backgroundColor: p.avatarBg ?? 'transparent',
              color: 'transparent',
            }}
            priority={false}
          />
        </div>
      </div>

      <p
        className="text-text-secondary text-base text-pretty"
        style={{ wordBreak: 'break-word' }}
        // Riku-Mono 스타일처럼 <br> 줄바꿈을 쓰기 위해 HTML로 처리
        dangerouslySetInnerHTML={{ __html: p.bioHtml }}
      />

      <div className="flex">
        <div className="flex flex-wrap justify-center gap-2">
          {p.links.map((l) => (
            <Link
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white transition hover:scale-110 hover:bg-gray-100"
              aria-label={l.url}
              title={l.url}
            >
              <Image
                alt={l.label}
                src={l.iconSrc}
                width={l.iconSize ?? 20}
                height={l.iconSize ?? 20}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
