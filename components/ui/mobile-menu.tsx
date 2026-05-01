"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg text-app-muted hover:text-app-text hover:bg-app-surface transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-app-bg/95 backdrop-blur-md border-b border-app-border px-6 py-5 space-y-4 shadow-lg">
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="block text-app-muted hover:text-app-text transition-colors py-2 border-b border-app-border text-sm"
          >
            Features
          </a>
          <a
            href="#doctors"
            onClick={() => setOpen(false)}
            className="block text-app-muted hover:text-app-text transition-colors py-2 border-b border-app-border text-sm"
          >
            Doctors
          </a>
          <a
            href="#how-it-works"
            onClick={() => setOpen(false)}
            className="block text-app-muted hover:text-app-text transition-colors py-2 border-b border-app-border text-sm"
          >
            How it works
          </a>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-sm text-center border border-app-border-2 text-app-muted hover:text-app-text font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="text-sm text-center bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
