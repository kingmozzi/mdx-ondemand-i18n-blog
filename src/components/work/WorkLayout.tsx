import Link from 'next/link';
import siteMetadata from '@/contents/siteMetadata';
import { LocaleTypes } from '@/i18n/i18nConfig';
import { createTranslation } from '@/i18n/i18nServer';
import type { Work } from 'contentlayer/generated';
import { TableOfContents } from '@/components/mdx/toc/TableOfContents';
import { MobileTableOfContentsButton } from '@/components/mdx/toc/MobileTableOfContentsButton';
import SubHeaderLayout from '@/components/navigation/SubHeaderLayout';
import { datetimeToLocaleString } from '@/lib/datetime';
import Image from 'next/image';

interface WorkLayoutProps {
  children: React.ReactNode;
  work: Work;
  locale: LocaleTypes;
  isFallback: boolean;
}

export default async function WorkLayout({ children, work, locale, isFallback }: WorkLayoutProps) {
  const { slug, title, description, date, startDate, endDate, stack, tags, thumbnail } = work;
  const { t } = await createTranslation(locale, 'work');

  const displayNames = new Intl.DisplayNames([locale], { type: 'language' });

  const githubRepoUrl = siteMetadata.siteRepo;
  const githubEditUrl = `${githubRepoUrl}/edit/main/src/contents/works/${work.language}/${slug}.mdx`;

  // 표시용 날짜
  const postedOn = datetimeToLocaleString(new Date(date), locale);

  // 기간 표시(있으면 기간, 없으면 date)
  const period = startDate && endDate ? `${startDate} - ${endDate}` : date;

  const statusKey = work.status === 'in_progress' ? 'status_in_progress' : 'status_done';

  return (
    <article className="mx-auto w-full space-y-8 md:space-y-10">
      <SubHeaderLayout mbOnly>
        <a className="text-sm font-bold" href={`/${locale}/works`}>
          {'< .../'}
          {slug}
        </a>
        <MobileTableOfContentsButton title={t('tableOfContents')} />
      </SubHeaderLayout>

      {/* Header */}
      <header className="max-w-content relative mx-auto space-y-4 px-4 md:space-y-6 md:px-10">
        {/* thumbnail (스샷처럼 큰 이미지) */}
        {thumbnail ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <h1 className="text-3xl font-black md:text-4xl">{title}</h1>
          {description ? (
            <p className="text-muted-foreground max-w-3xl text-sm md:text-base">{description}</p>
          ) : null}

          {/* chips */}
          <div className="flex flex-wrap items-center gap-2">
            {(stack ?? []).map((s) => (
              <span key={s} className="bg-card rounded-full border px-3 py-1 text-xs font-semibold">
                {s}
              </span>
            ))}
            {(tags ?? []).map((tag) => (
              <span
                key={tag}
                className="bg-card rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* meta row (스샷처럼 3칸) */}
          <div className="text-md grid grid-cols-1 gap-4 py-2 font-bold lg:grid-cols-3 lg:py-6">
            <div className="flex items-center justify-start gap-2 lg:flex-col lg:items-start">
              <p>{t('period')}</p>
              <time className="text-muted">{period}</time>
            </div>

            <div className="flex items-center justify-start gap-2 lg:flex-col lg:items-start">
              <p>{t('postedOn')}</p>
              <time dateTime={date} className="text-muted">
                {postedOn}
              </time>
            </div>

            <div className="flex items-center justify-start gap-2 lg:flex-col lg:items-start">
              <p>{t('status')}</p>
              <span className="text-muted">{t(statusKey)}</span>
            </div>
          </div>

          {/* fallback banner */}
          {isFallback && (
            <div className="text-destructive mb-2 rounded-md border bg-red-200 p-2 text-sm">
              ※ {t('notTranslated')} {displayNames.of(locale)} {t('version')}.
            </div>
          )}
        </div>
      </header>

      {/* Content + TOC */}
      <div className="max-w-content mx-auto grid grid-cols-7 gap-4 px-8 md:px-10">
        <div className="mdx-post prose prose-neutral dark:prose-invert col-span-7 max-w-full lg:col-span-5">
          {children}
        </div>

        <aside className="col-span-2 col-end-8 hidden h-full lg:flex">
          <div className="w-full">
            <div className="sticky top-10 space-y-2">
              <div className="bg-card rounded-lg border p-4">
                <h2 className="mb-2 border-b pb-2 text-lg font-bold">{t('tableOfContents')}</h2>
                <TableOfContents />
              </div>

              <a
                href="#"
                className="flex flex-row items-center rounded-lg border px-4 py-2 text-sm transition hover:underline"
              >
                <span className="i-lucide-arrow-up mr-1" />
                {t('backToTop')}
              </a>

              <a
                href={githubEditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center rounded-lg border px-4 py-2 text-sm transition hover:underline"
              >
                <span className="i-lucide-github mr-1" />
                {t('editPage')}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="max-w-content mx-auto flex flex-wrap py-4">
        <Link
          href={`/${locale}`}
          className="flex flex-row items-center rounded-lg px-4 py-2 text-sm transition hover:underline"
        >
          {'<'} {t('backToHome')}
        </Link>
      </div>
    </article>
  );
}
