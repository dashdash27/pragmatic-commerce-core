import Link from "next/link";
import type { Metadata } from "next";

import { SITE_CONFIG } from "@/shared/config/site";

export const metadata: Metadata = {
  title: {
    template: `%s | Админ-панель ${SITE_CONFIG.name}`,
    default: `Админ-панель ${SITE_CONFIG.name}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-6">
        <div className="font-bold text-lg mb-4">Админ-панель</div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="p-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Home
          </Link>

          <Link
            href="/admin/categories"
            className="p-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Категории
          </Link>

          <Link
            href="/"
            className="p-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            ← Вернуться на сайт
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
