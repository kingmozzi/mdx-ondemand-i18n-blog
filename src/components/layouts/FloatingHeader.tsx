'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, Menu, Moon, Sun, X } from 'lucide-react';
import { useTranslation } from '@/i18n/i18nClient';
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const [overlayMounted, setOverlayMounted] = useState(false);

  const { t } = useTranslation(locale, 'navigation');

  useEffect(() => setOverlayMounted(true), []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      if (mobileOpen) {
        setVisible(true);
        lastYRef.current = window.scrollY;
        tickingRef.current = false;
        return;
      }

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const lastY = lastYRef.current;

        const delta = y - lastY;
        const nearTop = y < 24;

        if (nearTop) setVisible(true);
        else if (delta > 8) setVisible(false);
        else if (delta < -8) setVisible(true);

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  const navItems: NavItem[] = useMemo(
    () => [
      { href: `/${locale}`, label: mounted ? t('home') : '', icon: <Home className="h-4 w-4" /> },
      { href: `/${locale}/posts`, label: mounted ? t('posts') : '' },
      { href: `/${locale}/works`, label: mounted ? t('works') : '' },
    ],
    [locale, mounted, t]
  );

  return (
    <div
      className={[
        'relative',
        'fixed right-0 left-0 z-50 flex justify-center px-3',
        'transition-transform duration-200 ease-out',
        visible ? 'translate-y-0' : '-translate-y-20',
        'top-0 pt-[env(safe-area-inset-top)]',
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

        {/* Center: Nav */}
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
          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <LangSwitch />

            <button
              type="button"
              className="hover:bg-foreground/5 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition"
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={onToggleTheme}
            >
              {!mounted ? null : isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="hover:bg-foreground/5 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition md:hidden"
            aria-label="Open menu"
            title="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mobile menu + overlay (Portal) */}
          {overlayMounted &&
            mobileOpen &&
            createPortal(
              <>
                <button
                  type="button"
                  aria-label="Close menu overlay"
                  className="fixed inset-0 z-[9000] bg-black/20 backdrop-blur-[2px] md:hidden"
                  onClick={() => setMobileOpen(false)}
                />

                <div
                  ref={mobileMenuRef}
                  className="bg-background/95 fixed top-16 right-3 z-[9999] w-64 rounded-2xl border p-2 shadow-xl backdrop-blur md:hidden"
                >
                  <div className="space-y-1 p-2">
                    <Link
                      href={`/${locale}`}
                      className="hover:bg-foreground/5 block rounded-lg px-3 py-2 text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      {mounted ? t('home') : ''}
                    </Link>

                    <Link
                      href={`/${locale}/posts`}
                      className="hover:bg-foreground/5 block rounded-lg px-3 py-2 text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      {mounted ? t('posts') : ''}
                    </Link>

                    <Link
                      href={`/${locale}/works`}
                      className="hover:bg-foreground/5 block rounded-lg px-3 py-2 text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      {mounted ? t('works') : ''}
                    </Link>

                    <div className="bg-foreground/10 my-2 h-px" />

                    <button
                      type="button"
                      className="hover:bg-foreground/5 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm"
                      onClick={() => {
                        onToggleTheme();
                        setMobileOpen(false);
                      }}
                    >
                      <span>{mounted ? t('theme') : ''}</span>
                      {!mounted ? null : isDark ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </button>

                    <div className="relative z-[9999] px-2 py-1">
                      <LangSwitch />
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}
        </div>
      </div>
    </div>
  );
}
