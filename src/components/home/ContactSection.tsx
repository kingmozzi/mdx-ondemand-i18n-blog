'use client';

import { Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
  const email = 'kingmozzi_@naver.com';
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section className="space-y-6 rounded-xl">
      {/* Title */}
      {/* <div className="space-y-1">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="text-text-secondary text-sm">
          Feel free to reach out via email.
        </p>
      </div> */}

      {/* Email Card */}
      <div className="bg-background/60 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="bg-background flex h-10 w-10 items-center justify-center rounded-lg border">
            <Mail className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">Email</span>
            <a href={`mailto:${email}`} className="text-text-secondary text-sm hover:underline">
              {email}
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={copyEmail}
          className="hover:bg-foreground/5 inline-flex h-9 w-9 items-center justify-center rounded-lg border transition"
          aria-label="Copy email"
          title="Copy email"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
}
