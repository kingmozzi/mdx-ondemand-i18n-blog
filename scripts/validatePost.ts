import fs from 'fs';
import matter from 'gray-matter';
import { execSync } from 'child_process';

type FrontMatter = {
  published: boolean;
  icon?: string;
  title: string;
  description?: string;
  date: string;
  lastupdated?: string;
  categories: string[];
  tags?: string[];
};

const ALLOWED_KEYS: (keyof FrontMatter)[] = [
  'published',
  'icon',
  'title',
  'description',
  'date',
  'lastupdated',
  'categories',
  'tags',
];

const REQUIRED_KEYS: (keyof FrontMatter)[] = [
  'published',
  'title',
  'description',
  'date',
  'categories',
];

// `YYYY-MM-DDTHH:mm:ss+09:00`
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;

function validateRequiredKeys(frontmatter: FrontMatter): string[] {
  return REQUIRED_KEYS.filter((key) => !frontmatter[key]).map(
    (key) => `❌ Missing required key: ${key}`
  );
}

function validateUnknownKeys(frontmatter: FrontMatter): string[] {
  return Object.keys(frontmatter)
    .filter((key) => !ALLOWED_KEYS.includes(key as keyof FrontMatter))
    .map((key) => `⚠️ Unknown key detected: ${key}`);
}

function validateDate(frontmatter: FrontMatter): string[] {
  const errors: string[] = [];
  if (!ISO_DATE_REGEX.test(frontmatter.date)) {
    errors.push('❌ date must be in ISO format: YYYY-MM-DDTHH:mm:ss+09:00');
  }
  if (frontmatter.lastupdated && !ISO_DATE_REGEX.test(frontmatter.lastupdated)) {
    errors.push('❌ lastupdated must be in ISO format: YYYY-MM-DDTHH:mm:ss+09:00');
  }
  return errors;
}

function validatePublished(frontmatter: FrontMatter): string[] {
  return typeof frontmatter.published !== 'boolean' ? ['❌ published must be a boolean'] : [];
}

function validatePath(filePath: string): string[] {
  const fileName = filePath.split('/').pop();
  const slug = fileName?.replace('.mdx', '');
  return slug?.includes(' ') ? ['❌ filePath is not match url pattern'] : [];
}

function validateContent(content: string): string[] {
  return !content.trim() ? ['❌ Empty content'] : [];
}

function validatePost(postPath: string): string[] {
  //const post = fs.readFileSync(postPath, 'utf-8');
  const post = safeRead(postPath);
  if (!post) return [];
  const { data: frontmatter } = matter(post);
  return [
    ...validateRequiredKeys(frontmatter as FrontMatter),
    ...validateUnknownKeys(frontmatter as FrontMatter),
    ...validateDate(frontmatter as FrontMatter),
    ...validatePublished(frontmatter as FrontMatter),
    ...validatePath(postPath),
    ...validateContent(post),
  ];
}

function getStagedMdxFiles(): string[] {
  try {
    const output = execSync('git diff --name-only --cached', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter((file) => file.startsWith('src/contents/posts/') && file.endsWith('.mdx'));
  } catch (error) {
    console.error('❌ Failed to get staged files:', error);
    return [];
  }
}

function safeRead(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[validatePost] skip (missing): ${filePath}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function main() {
  const stagedMdxFiles = getStagedMdxFiles();
  let hasErrors = false;

  const errors: string[] = [];

  stagedMdxFiles.forEach((filePath) => {
    console.log(`🔍 Validating ${filePath}...`);
    const postErrors = validatePost(filePath);
    if (postErrors.length > 0) {
      hasErrors = true;
      errors.push(`❌ ${filePath} has errors:`);
      errors.push(...postErrors);
    }
  });

  if (hasErrors) {
    console.error(errors.join('\n'));
    process.exit(1);
  } else {
    console.log('✅ All posts are validation passed.');
  }
}

main();
