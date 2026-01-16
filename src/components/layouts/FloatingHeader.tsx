'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Moon, Sun /*Languages*/ } from 'lucide-react';
import LangSwitch from '@/components/langSwitch/LangSwitch';

type NavItem = { href: string; label: string; icon?: React.ReactNode };

export function FloatingHeader({
  locale,
  mounted,
  isDark,
  onToggleTheme,
}: {
  locale: string;
  mounted: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef<number>(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const lastY = lastYRef.current;

        // 너무 예민하게 깜빡이지 않도록 임계값
        const delta = y - lastY;
        const nearTop = y < 24;

        // 아래로 스크롤: 숨김 / 위로 스크롤: 표시
        if (nearTop) setVisible(true);
        else if (delta > 8) setVisible(false);
        else if (delta < -8) setVisible(true);

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: NavItem[] = useMemo(
    () => [
      { href: `/${locale}`, label: '홈', icon: <Home className="h-4 w-4" /> },
      { href: `/${locale}/posts`, label: '포스트' },
      { href: `/${locale}/works`, label: '작품' }, // 너 프로젝트 라우트에 맞게 수정
    ],
    [locale]
  );

  return (
    <div
      className={[
        'fixed top-3 right-0 left-0 z-50 flex justify-center px-3',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : '-translate-y-20',
      ].join(' ')}
    >
      <div
        className={[
          'flex w-full max-w-4xl items-center justify-between gap-2',
          'bg-background/70 supports-[backdrop-filter]:bg-background/55 rounded-2xl border backdrop-blur',
          'shadow-sm',
          'px-3 py-2',
        ].join(' ')}
      >
        {/* Left: Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="bg-background flex h-9 w-9 items-center justify-center rounded-xl border">
            {/* 너 로고로 교체 가능 */}
            <Image
              src="/avatar.png"
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full border"
              priority
            />
          </div>
        </Link>

        {/* Center: Nav (pill 느낌) */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                'hover:bg-foreground/5 transition',
              ].join(' ')}
            >
              {it.icon}
              <span>{it.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <LangSwitch />

          <button
            type="button"
            className="hover:bg-foreground/5 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition"
            aria-label="Toggle theme"
            title="Toggle theme"
            onClick={onToggleTheme}
          >
            {!mounted ? null : isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* 모바일 메뉴: 필요하면 여기 dropdown 추가 */}
        </div>
      </div>
    </div>
  );
}
