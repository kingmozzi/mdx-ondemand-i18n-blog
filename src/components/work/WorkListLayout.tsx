'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { PageLayout } from '@/components/layouts/PageLayout';
import '@/styles/post.css';
import { WorkCard } from './WorkCard';
import type { WorkListItem } from '@/lib/work';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  i18n?: {
    prevPageText?: string;
    nextPageText?: string;
  };
}

interface ListLayoutProps {
  locale: string;
  works: WorkListItem[];
  initialDisplayWorks?: WorkListItem[];
  pagination?: PaginationProps;
  i18n: {
    title?: string;
    notfound?: string;
    searchPlaceholder?: string;
    prevPageText?: string;
    nextPageText?: string;
  };
}

function Pagination({
  totalPages,
  currentPage,
  i18n = { prevPageText: 'Previous', nextPageText: 'Next' },
}: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname.replace(/^\//, '').replace(/\/page\/\d+$/, '');
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            {i18n.prevPageText}
          </button>
        )}
        {prevPage && (
          <a
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            {i18n.prevPageText}
          </a>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            {i18n.nextPageText}
          </button>
        )}
        {nextPage && (
          <a href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            {i18n.nextPageText}
          </a>
        )}
      </nav>
    </div>
  );
}

function getWorkGroupDate(item: WorkListItem) {
  const w = item.work;
  const raw = w.startDate ?? w.date;
  return raw ? new Date(raw) : new Date(0);
}

export default function WorkListLayout({
  locale,
  works,
  initialDisplayWorks = [],
  pagination,
  i18n: { title, notfound, searchPlaceholder, prevPageText, nextPageText },
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('');

  const filtered = works.filter(({ work }) => {
    const searchContent =
      (work.title ?? '') +
      (work.description ?? '') +
      (work.stack?.join(' ') ?? '') +
      (work.tags?.join(' ') ?? '');
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  const displayWorks =
    initialDisplayWorks.length > 0 && !searchValue ? initialDisplayWorks : filtered;

  const grouped = displayWorks.reduce(
    (acc, item) => {
      const d = getWorkGroupDate(item);
      const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      (acc[yearMonth] ||= []).push(item);
      return acc;
    },
    {} as Record<string, WorkListItem[]>
  );

  return (
    <PageLayout>
      <div className="space-y-4 pb-6">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
          {title}
        </h1>

        <div className="relative max-w-lg">
          <label>
            <span className="sr-only">{searchPlaceholder || 'Search works'}</span>
            <input
              aria-label="Search works"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder || 'Search works'}
              className="focus:border-primary-500 focus:ring-primary-500 bg-card block w-full rounded-md border px-4 py-2"
            />
          </label>
          <svg
            className="absolute top-3 right-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {displayWorks.length === 0 && (
        <p className="text-muted text-xl leading-9 font-bold tracking-tight sm:text-xl sm:leading-4 md:text-xl md:leading-8">
          {notfound}
        </p>
      )}

      <ol className="post-archive">
        {Object.keys(grouped).map((yearMonth) => (
          <li key={yearMonth} className="post-month-group">
            <h2 className="post-month-title mt-4 mb-2 border-b pb-2 text-lg leading-9 font-bold tracking-tight sm:text-xl sm:leading-10 md:text-2xl md:leading-14">
              <time dateTime={`${yearMonth}`} className="bg-accent rounded-sm px-2 py-1">
                {new Date(yearMonth).toLocaleString(locale, { year: 'numeric', month: 'long' })}
              </time>
            </h2>

            <ol className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {grouped[yearMonth].map(({ work, isFallback }) => (
                <li key={`${work.slug}-${work.language}`}>
                  <WorkCard work={work} locale={locale} isFallback={isFallback} />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          i18n={{ prevPageText: prevPageText || 'Previous', nextPageText: nextPageText || 'Next' }}
        />
      )}
    </PageLayout>
  );
}
