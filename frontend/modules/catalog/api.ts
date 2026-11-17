import { apiFetch } from "@/shared/api/client";
import type { ApiFetchOptions } from "@/shared/types/api";

import type {
  CategoryResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "./types";

export async function getCategories(
  options?: ApiFetchOptions,
): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>("/catalog/categories", options);
}

export async function createCategory(
  payload: CategoryCreateRequest,
): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>("/catalog/categories", {
    method: "POST",
    // withAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  id: number,
  payload: CategoryUpdateRequest,
): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/catalog/categories/${id}`, {
    method: "PATCH",
    // withAuth: true,
    body: JSON.stringify(payload),
  });
}
