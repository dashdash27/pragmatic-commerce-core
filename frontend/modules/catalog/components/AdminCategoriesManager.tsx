"use client";

import { useState } from "react";

import { Card } from "@/shared/ui/Card";

import type { CategoryResponse } from "../types";
import { flattenCategoryTree } from "../utils/categoriesTree";
import { CreateCategoryForm } from "./CreateCategoryForm";
import { EditCategoryForm } from "./EditCategoryForm";

interface AdminCategoriesManagerProps {
  initialCategories: CategoryResponse[];
}

export function AdminCategoriesManager({
  initialCategories,
}: Readonly<AdminCategoriesManagerProps>) {
  const [categories, setCategories] =
    useState<CategoryResponse[]>(initialCategories);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  const handleCreated = (newCategory: CategoryResponse) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleUpdated = (updatedCategory: CategoryResponse) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === updatedCategory.id ? updatedCategory : item,
      ),
    );
    setEditingCategory(updatedCategory);
  };

  const treeList = flattenCategoryTree(categories);

  return (
    <div className="flex w-full gap-5">
      <Card title="Список категорий" className="flex-1">
        <ul className="divide-y divide-gray-100">
          {treeList.map((category) => {
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => setEditingCategory(category)}
                  style={{ paddingLeft: `${12 + category.depth * 24}px` }}
                  className={`flex w-full rounded items-center cursor-pointer hover:bg-blue-200 justify-between py-3 pr-3 text-left transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    {category.depth > 0 && (
                      <span className="text-sm text-gray-400 select-none">
                        ↳
                      </span>
                    )}
                    <div>
                      <p
                        className={`text-gray-900 ${
                          category.depth === 0
                            ? "font-semibold"
                            : "font-normal text-sm"
                        }`}
                      >
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">/{category.slug}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="flex-1">
        {editingCategory ? (
          <EditCategoryForm
            key={editingCategory.id}
            category={editingCategory}
            categories={categories}
            onUpdated={handleUpdated}
            onCancel={() => setEditingCategory(null)}
          />
        ) : (
          <CreateCategoryForm
            categories={categories}
            onCreated={handleCreated}
          />
        )}
      </div>
    </div>
  );
}
