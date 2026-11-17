import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная страница",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-6">Главная</h1>
    </div>
  );
}
