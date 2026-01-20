import { LocaleTypes } from '@/i18n/i18nConfig';
import { createTranslation } from '@/i18n/i18nServer';
import { PostCard } from '@/components/post/PostCard';
import { getPostsForLocale } from '@/lib/post';
import { LATEST_POSTS_PER_PAGE } from '@/lib/constants';
import { PageLayout } from '@/components/layouts/PageLayout';
import { AboutSection } from '@/components/home/AboutSection';
import { ContactSection } from '@/components/home/ContactSection';
import { WorkCard } from '@/components/work/WorkCard';
import { getWorksForLocale } from '@/lib/work';

interface PageProps {
  params: Promise<{ locale: LocaleTypes }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const { t } = await createTranslation(locale, 'home');

  const filteredPosts = await getPostsForLocale(locale);

  // locale 우선 정렬: locale 언어가 맨 앞, 그 다음 최신순
  const worksForHome = (await getWorksForLocale(locale)).slice(0, 4);

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
            className="bg-card hover:bg-card/50 flex w-fit items-center gap-2 rounded-md border-2 p-2 hover:underline"
          >
            {t('viewAllPosts')} <span aria-hidden>›</span>
          </a>
        </section>

        {/* works */}
        <h2 className="text-4xl font-bold">{t('works')}</h2>
        <section className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          {worksForHome.map(({ work, isFallback }) => (
            <WorkCard
              key={`${work.slug}-${work.language}`}
              work={work}
              locale={locale}
              isFallback={isFallback}
            />
          ))}
        </section>

        <a
          href={`/${locale}/works`}
          className="bg-card hover:bg-card/50 flex w-fit items-center gap-2 rounded-md border-2 p-2 hover:underline"
        >
          {t('viewAllWorks')} <span aria-hidden>›</span>
        </a>

        {/* contact */}
        <h2 className="text-4xl font-bold">{t('contact')}</h2>
        <section className="grid w-full grid-cols-1 gap-4 rounded-xl border-2 p-4">
          <ContactSection />
        </section>
      </div>
    </PageLayout>
  );
}
