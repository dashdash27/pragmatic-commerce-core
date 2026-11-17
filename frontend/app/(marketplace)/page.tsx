import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная",
  description: "Добро пожаловать в наш интернет-магазин.",
};

export default function HomePage() {
  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold mb-3">Главная страница</h1>
    </section>
  );
}
