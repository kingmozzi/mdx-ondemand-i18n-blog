import { ComputedFields, defineDocumentType, makeSource } from 'contentlayer2/source-files';
import siteMetadata from './src/contents/siteMetadata';
import remarkGfm from 'remark-gfm';
import { remarkOEmbed, youTubeTransformer, oEmbedTransformer } from '@/lib/plugins/remarkOEmbed';
import { remarkLinkCard } from '@/lib/plugins/remarkLinkCard';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerNotationDiff, transformerNotationWordHighlight } from '@shikijs/transformers';
import { rehypeUnwrapParagraph } from '@/lib/plugins/rehypeUnwrapParagraph';

const root = process.cwd();
// const isProduction = process.env.NODE_ENV === 'production';

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => {
      const pathParts = doc._raw.flattenedPath.split('/');
      return pathParts[pathParts.length - 1];
    },
  },
  language: {
    type: 'string',
    resolve: (doc) => {
      const pathParts = doc._raw.flattenedPath.split('/');
      return pathParts[pathParts.length - 2];
    },
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    published: { type: 'boolean', required: true },
    icon: { type: 'string' },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'string', required: true },
    lastupdated: { type: 'string' },
    categories: { type: 'list', of: { type: 'string' }, default: [], required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
  },
  computedFields: {
    ...computedFields,

    structuredData: {
      type: 'json',
      resolve: (doc) => {
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: doc.title,
          datePublished: doc.date,
          dateModified: doc.lastupdated || doc.date,
          image: doc.icon ? doc.icon : '',
          url: `${siteMetadata.siteUrl}/${doc.language}/${doc.slug}`,
        };
      },
    },
  },
}));

export const Category = defineDocumentType(() => ({
  name: 'Category',
  filePathPattern: 'categories/**/*.yaml',
  bodyType: 'yaml',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    icon: { type: 'string', required: true },
    className: { type: 'string', required: true },
  },
  computedFields,
}));

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.mdx',
  contentType: 'mdx',
  fields: {
    published: { type: 'boolean', required: true },
    title: { type: 'string', required: true },
    date: { type: 'string', required: true },
    lastupdated: { type: 'string' },
    layout: {
      type: 'enum',
      options: ['default', 'full-width'],
      required: true,
    },
  },
  computedFields,
}));

export const Work = defineDocumentType(() => ({
  name: 'Work',
  filePathPattern: `works/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    published: { type: 'boolean', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },

    // 정렬용
    date: { type: 'string', required: true },
    lastupdated: { type: 'string' },

    // 기간 표시(옵션)
    startDate: { type: 'string' },
    endDate: { type: 'string' },

    // 카드 표시용
    thumbnail: { type: 'string' },
    url: { type: 'string' },

    // 칩
    stack: { type: 'list', of: { type: 'string' }, default: [] },
    tags: { type: 'list', of: { type: 'string' }, default: [] },

    status: {
      type: 'enum',
      options: ['done', 'in_progress'],
      default: 'done',
    },
  },
  computedFields: {
    ...computedFields,
  },
}));

export default makeSource({
  contentDirPath: 'src/contents/',
  documentTypes: [Post, Category, Page, Work],
  contentDirExclude: ['siteMetadata.ts', 'siteLocaleMetadata.ts', 'components/**/*'],
  mdx: {
    cwd: root,
    remarkPlugins: [
      remarkGfm,
      [remarkOEmbed, { transformers: [youTubeTransformer, oEmbedTransformer] }],
      remarkLinkCard,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: {
            type: 'element',
            tagName: 'span',
            properties: { className: ['content-header-icon'] },
          },
          test: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'one-dark-pro',
            light: 'catppuccin-latte',
          },
          keepBackground: false,
          defaultLang: 'plaintext',
          transformers: [
            transformerNotationDiff({ matchAlgorithm: 'v3' }),
            transformerNotationWordHighlight({ matchAlgorithm: 'v3' }),
          ],
        },
      ],
      rehypeUnwrapParagraph,
    ],
  },
});
