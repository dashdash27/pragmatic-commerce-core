import type { CategoryResponse } from "../types";

export interface FlatCategoryItem extends CategoryResponse {
  depth: number;
}

export function flattenCategoryTree(
  categories: CategoryResponse[],
): FlatCategoryItem[] {
  const result: FlatCategoryItem[] = [];

  function traverse(parentId: number | null, depth: number) {
    const children = categories.filter((c) => c.parent_id === parentId);
    for (const child of children) {
      result.push({ ...child, depth });
      traverse(child.id, depth + 1);
    }
  }

  traverse(null, 0);

  const addedIds = new Set(result.map((c) => c.id));
  for (const cat of categories) {
    if (!addedIds.has(cat.id)) {
      result.push({ ...cat, depth: 0 });
    }
  }

  return result;
}

export function getCategoryAndDescendantIds(
  categories: CategoryResponse[],
  rootId: number,
): Set<number> {
  const excludedIds = new Set<number>([rootId]);

  function collectChildren(parentId: number) {
    const children = categories.filter((c) => c.parent_id === parentId);
    for (const child of children) {
      excludedIds.add(child.id);
      collectChildren(child.id);
    }
  }

  collectChildren(rootId);
  return excludedIds;
}
