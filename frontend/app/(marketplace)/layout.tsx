import Link from "next/link";

import { SITE_CONFIG } from "@/shared/config/site";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          {SITE_CONFIG.name}
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:underline">
            Главная
          </Link>
          <Link
            href="/admin/"
            className="text-gray-500 hover:text-black transition-colors"
          >
            Админка →
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">{children}</main>

      <footer className="border-t px-6 py-4 text-sm text-gray-500 text-center">
        © 2026 E-commerce Platform {SITE_CONFIG.name}
      </footer>
    </div>
  );
}
