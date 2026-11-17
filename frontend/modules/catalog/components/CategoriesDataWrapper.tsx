import { getCategories } from "../api";
import { AdminCategoriesManager } from "./AdminCategoriesManager";

export async function CategoriesDataWrapper() {
  const initialCategories = await getCategories({
    cache: "no-store",
  });

  return <AdminCategoriesManager initialCategories={initialCategories} />;
}
