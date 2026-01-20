import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocaleTypes } from '@/i18n/i18nConfig';
import { defaultLocale, locales } from '@/i18n/i18nLocales';
import { createTranslation } from '@/i18n/i18nServer';
import { getWorksForLocale } from '@/lib/work';
import WorkListLayout from '@/components/work/WorkListLayout';
import { WORKS_PER_PAGE } from '@/lib/constants';

interface PageProps {
  params: Promise<{
    page: string;
    locale: LocaleTypes;
  }>;
}

export async function generateStaticParams() {
  const defaultLocaleWorks = await getWorksForLocale(defaultLocale);
  const totalPages = Math.ceil(defaultLocaleWorks.length / WORKS_PER_PAGE);

  const paths = locales.flatMap((locale) =>
    Array.from({ length: totalPages }, (_, i) => ({
      params: { locale, page: (i + 1).toString() },
    }))
  );

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page, locale } = await params;
  const { t } = await createTranslation(locale, 'work'); // work.json 만들기 추천(없으면 post로 임시 가능)

  return {
    title: `${t('works')} - ${page}`,
    description: `${t('works')} ${locale} - ${page}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { page, locale } = await params;
  const { t } = await createTranslation(locale, 'work');

  const works = await getWorksForLocale(locale);

  const pageNumber = parseInt(page as string);
  const totalPages = Math.ceil(works.length / WORKS_PER_PAGE);

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound();
  }

  const initialDisplayWorks = works.slice(
    WORKS_PER_PAGE * (pageNumber - 1),
    WORKS_PER_PAGE * pageNumber
  );

  const pagination = {
    currentPage: pageNumber,
    totalPages,
  };

  return (
    <WorkListLayout
      locale={locale}
      works={works}
      initialDisplayWorks={initialDisplayWorks}
      pagination={pagination}
      i18n={{
        title: t('works'),
        notfound: t('notfound'),
        searchPlaceholder: t('searchPlaceholder'),
        prevPageText: t('prevPageText'),
        nextPageText: t('nextPageText'),
      }}
    />
  );
}
