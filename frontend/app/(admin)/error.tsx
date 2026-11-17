"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/Button";

export default function AdminError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const router = useRouter();

  function handleRetry() {
    router.refresh();
    reset();
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-600 mb-6">{error.message}</p>
      <Button variant="danger" onClick={handleRetry}>
        Попробовать снова
      </Button>
    </div>
  );
}
