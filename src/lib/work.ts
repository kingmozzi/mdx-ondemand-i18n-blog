import { allWorks, type Work } from 'contentlayer/generated';
import type { LocaleTypes } from '@/i18n/i18nConfig';
import { defaultLocale } from '@/i18n/i18nLocales';

export type WorkListItem = {
  work: Work;
  isFallback: boolean; // 현재 locale 버전이 아니라 다른 언어를 보여주는지
};

function pickVariant(variants: Work[], locale: LocaleTypes): WorkListItem {
  const exact = variants.find((w) => w.language === locale);
  if (exact) return { work: exact, isFallback: false };

  const def = variants.find((w) => w.language === defaultLocale);
  if (def) return { work: def, isFallback: true };

  // 아무거나 하나
  return { work: variants[0], isFallback: true };
}

function getSortKey(w: Work) {
  return w.startDate ?? w.date ?? '';
}

export async function getWorksForLocale(locale: LocaleTypes): Promise<WorkListItem[]> {
  const published = allWorks.filter((w) => w.published);

  // slug로 그룹핑 (언어별 파일을 하나로 합치기)
  const map = new Map<string, Work[]>();
  for (const w of published) {
    const arr = map.get(w.slug) ?? [];
    arr.push(w);
    map.set(w.slug, arr);
  }

  // locale 우선 1개 선택
  const merged = Array.from(map.values()).map((variants) => pickVariant(variants, locale));

  // 최신순 정렬
  merged.sort((a, b) => getSortKey(b.work).localeCompare(getSortKey(a.work)));

  return merged;
}

export async function getWorkForLocale(
  locale: LocaleTypes,
  slug: string
): Promise<Work | undefined> {
  return allWorks.find((w) => w.published && w.language === locale && w.slug === slug);
}
