import { LocaleTypes } from '@/i18n/i18nConfig';
import { createTranslation } from '@/i18n/i18nServer';
import { PostCard } from '@/components/post/PostCard';
import { getPostsForLocale } from '@/lib/post';
import { LATEST_POSTS_PER_PAGE } from '@/lib/constants';
import { PageLayout } from '@/components/layouts/PageLayout';
import { allPages } from 'contentlayer/generated';

import { AboutSection } from '@/components/home/AboutSection';

interface PageProps {
  params: Promise<{ locale: LocaleTypes }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const { t } = await createTranslation(locale, 'home');
  const pages = allPages;

  const filteredPosts = await getPostsForLocale(locale);

  return (
    <PageLayout>
      <div className="grid gap-8">
        {/* about */}
        {/* <h2 className="text-4xl font-bold">{t('about us')}</h2> */}
        <section className="grid w-full grid-cols-1 gap-8">
          <AboutSection locale={locale} />
        </section>
        {/* latesPosts */}
        <h2 className="text-4xl font-bold">{t('latestPosts')}</h2>
        <section className="grid w-full grid-cols-1 gap-8">
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredPosts.slice(0, LATEST_POSTS_PER_PAGE).map((post) => (
              <li key={post.slug}>
                <PostCard post={post} locale={locale} />
              </li>
            ))}
          </ul>
          <a
            href={`/${locale}/posts`}
            className="bg-card hover:bg-card/50 flex w-full justify-center rounded-md border-2 p-2 hover:underline"
          >
            {t('viewAllPosts')}
          </a>
        </section>
        {/* pages */}
        <h2 className="text-4xl font-bold">{t('pages')}</h2>
        <section className="border-border grid w-full grid-cols-1 gap-8 rounded-xl border-2 p-4">
          <ul className="grid grid-cols-1 gap-4">
            {pages.map((page) => (
              <li key={page.slug}>
                <a href={`/${locale}/${page.slug}`} className="hover:underline">
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
        {/* contact */}
        <h2 className="text-4xl font-bold">{t('contact')}</h2>
        <section className="grid w-full grid-cols-1 gap-4 rounded-xl border-2 p-4"></section>
      </div>
    </PageLayout>
  );
}
