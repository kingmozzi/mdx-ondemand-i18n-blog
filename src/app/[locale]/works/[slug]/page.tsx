import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocaleTypes } from '@/i18n/i18nConfig';
import { defaultLocale } from '@/i18n/i18nLocales';
import WorkLayout from '@/components/work/WorkLayout';
import MDXRenderer from '@/components/mdx/MDXRenderer';
import { getWorkForLocale } from '@/lib/work';
import '@/styles/post.css';

interface PageProps {
  params: Promise<{ slug: string; locale: LocaleTypes }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
  const { slug, locale } = await params;
  const work = await getWorkForLocale(locale, slug);
  const fallback = await getWorkForLocale(defaultLocale, slug);
  const base = work ?? fallback;
  if (!base) return;

  return { title: base.title, description: base.description };
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params;

  const work = await getWorkForLocale(locale, slug);
  const fallback = await getWorkForLocale(defaultLocale, slug);

  if (!fallback) return notFound();

  const isFallback = !work;
  const displayWork = work ?? fallback;

  return (
    <WorkLayout work={displayWork} locale={locale} isFallback={isFallback}>
      <MDXRenderer code={displayWork.body.code} />
    </WorkLayout>
  );
}
