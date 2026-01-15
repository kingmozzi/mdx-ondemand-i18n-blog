'use client';

import { FC, useEffect } from 'react';
import tocbot from 'tocbot';

interface Props {
  onClick?: (e: Event) => void;
}

export const TableOfContents: FC<Props> = ({ onClick }) => {
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.mdx-post', // 目次を抽出したい要素のクラス名
      headingSelector: 'h2, h3, h4',
      scrollSmooth: false,
      activeLinkClass: 'is-active-link',
      includeHtml: false,
      tocScrollOffset: 30,
      disableTocScrollSync: true,
      ...(onClick && { onClick }),
    });

    return () => tocbot.destroy();
  }, [onClick]);

  return <nav className="toc" />;
};
