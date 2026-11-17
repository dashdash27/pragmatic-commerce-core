"use client";

import { useState } from "react";

import type { FormStatus } from "@/shared/types/ui";
import { ApiError } from "@/shared/api/client";
import { Input } from "@/shared/ui/Input";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Select } from "@/shared/ui/Select";
import { FormAlert } from "@/shared/ui/FormAlert";

import { CategoryResponse, CategoryUpdateRequest } from "../types";
import { updateCategory } from "../api";
import {
  flattenCategoryTree,
  getCategoryAndDescendantIds,
} from "../utils/categoriesTree";

interface EditCategoryFormProps {
  category: CategoryResponse;
  categories: CategoryResponse[];
  onUpdated: (updatedCategory: CategoryResponse) => void;
  onCancel: () => void;
}

export function EditCategoryForm({
  category,
  categories,
  onUpdated,
  onCancel,
}: Readonly<EditCategoryFormProps>) {
  const [formData, setFormData] = useState<CategoryUpdateRequest>({
    name: category.name,
    parent_id: category.parent_id,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const updated = await updateCategory(category.id, formData);
      onUpdated(updated);
      setStatus({
        type: "success",
        text: "Изменения успешно сохранены",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setStatus({
          type: "error",
          text: `${err.message}`,
        });
      } else {
        setStatus({
          type: "error",
          text: "Не удалось связаться с сервером. Проверьте подключение.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const excludedIds = getCategoryAndDescendantIds(categories, category.id);
  const availableParents = flattenCategoryTree(categories).filter(
    (item) => !excludedIds.has(item.id),
  );

  return (
    <Card
      title={`Редактирование категории «${category.name}»`}
      className="sticky top-6"
    >
      <FormAlert status={status} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Название"
          minLength={2}
          maxLength={100}
          value={formData.name}
          onChange={(e) => {
            if (status) setStatus(null);
            setFormData({ ...formData, name: e.target.value });
          }}
          placeholder="Например: Электроника"
        />

        <Select
          label="Родительская категория"
          value={formData.parent_id ?? ""}
          onChange={(e) => {
            if (status) setStatus(null);
            setFormData({
              ...formData,
              parent_id: e.target.value ? Number(e.target.value) : null,
            });
          }}
        >
          <option value="">Без родителя (корневая)</option>
          {availableParents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {"— ".repeat(parent.depth)}
              {parent.name}
            </option>
          ))}
        </Select>

        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Сохранение..."
          className="w-full"
        >
          Сохранить изменение
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full"
        >
          Отменить
        </Button>
      </form>
    </Card>
  );
}
