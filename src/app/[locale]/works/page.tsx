import { Metadata } from 'next';
import { LocaleTypes } from '@/i18n/i18nConfig';
import { createTranslation } from '@/i18n/i18nServer';
import WorkListLayout from '@/components/work/WorkListLayout';
import { getWorksForLocale } from '@/lib/work';
import { WORKS_PER_PAGE } from '@/lib/constants';

interface PageProps {
  params: Promise<{
    locale: LocaleTypes;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await createTranslation(locale, 'work');

  return {
    title: t('works'),
    description: `${t('works')} ${locale}`,
  };
}

export default async function WorksPage({ params }: PageProps) {
  const { locale } = await params;
  const { t } = await createTranslation(locale, 'work');

  const works = await getWorksForLocale(locale);

  const pageNumber = 1;
  const totalPages = Math.ceil(works.length / WORKS_PER_PAGE);

  const initialDisplayWorks = works.slice(0, WORKS_PER_PAGE);

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
