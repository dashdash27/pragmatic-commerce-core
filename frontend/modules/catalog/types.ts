export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface CategoryCreateRequest {
  name: string;
  parent_id: number | null;
}

export interface CategoryUpdateRequest {
  name: string;
  parent_id: number | null;
}
