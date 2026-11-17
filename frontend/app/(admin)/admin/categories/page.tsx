import type { Metadata } from "next";
import { Suspense } from "react";

import { CategoriesDataWrapper } from "@/modules/catalog";

export const metadata: Metadata = {
  title: "Управление категориями",
};

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-6">Категории</h1>

      <div className="flex">
        <Suspense fallback="Загрузка">
          <CategoriesDataWrapper />
        </Suspense>
      </div>
    </div>
  );
}
