'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FloatingHeader } from './FloatingHeader';

export function HeaderClient({ locale }: { locale: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <FloatingHeader
      locale={locale}
      mounted={mounted}
      isDark={isDark}
      onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
    />
  );
}
