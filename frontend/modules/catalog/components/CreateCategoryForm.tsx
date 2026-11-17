"use client";

import { useState } from "react";

import type { FormStatus } from "@/shared/types/ui";
import { ApiError } from "@/shared/api/client";
import { Input } from "@/shared/ui/Input";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Select } from "@/shared/ui/Select";
import { FormAlert } from "@/shared/ui/FormAlert";

import type { CategoryResponse, CategoryCreateRequest } from "../types";
import { createCategory } from "../api";
import { flattenCategoryTree } from "../utils/categoriesTree";

interface CreateCategoryFormProps {
  categories: CategoryResponse[];
  onCreated: (newCategory: CategoryResponse) => void;
}

const EMPTY_CREATE_FORM: CategoryCreateRequest = {
  name: "",
  parent_id: null,
};

export function CreateCategoryForm({
  categories,
  onCreated,
}: Readonly<CreateCategoryFormProps>) {
  const [formData, setFormData] =
    useState<CategoryCreateRequest>(EMPTY_CREATE_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const created = await createCategory(formData);
      onCreated(created);
      setFormData(EMPTY_CREATE_FORM);

      setStatus({
        type: "success",
        text: `Категория «${created.name}» успешно создана`,
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

  const treeOptions = flattenCategoryTree(categories);

  return (
    <Card title="Новая категория">
      <FormAlert status={status} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Название"
          required
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
          {treeOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {"— ".repeat(category.depth)}
              {category.name}
            </option>
          ))}
        </Select>

        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Создание..."
          className="w-full"
        >
          Создать категорию
        </Button>
      </form>
    </Card>
  );
}
