import type { Work } from 'contentlayer/generated';
import type { LocaleTypes } from '@/i18n/i18nConfig';
import Image from 'next/image';

interface WorkLayoutProps {
  children: React.ReactNode;
  work: Work;
  locale: LocaleTypes;
  isFallback: boolean;
}

export const WorkLayout = ({ children, work, locale, isFallback }: WorkLayoutProps) => {
  return (
    <div className="max-w-content mx-auto my-10 w-full px-4 md:px-10">
      {isFallback ? (
        <div className="border-destructive/40 bg-destructive/10 text-destructive mb-6 rounded-xl border p-4">
          이 콘텐츠는 아직 현재 언어({locale})로 제공되지 않습니다.{' '}
          <span className="font-semibold">({work.language})</span>
        </div>
      ) : null}

      {work.thumbnail ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-2">
          <Image
            src={work.thumbnail}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
          />
        </div>
      ) : null}

      <header className="mb-8 grid gap-3">
        <h1 className="text-4xl font-bold">{work.title}</h1>
        {work.description ? (
          <p className="text-muted-foreground text-lg">{work.description}</p>
        ) : null}
      </header>

      {children}
    </div>
  );
};
