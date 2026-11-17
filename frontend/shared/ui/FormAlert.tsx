import type { FormStatus } from "@/shared/types/ui";

interface FormAlertProps {
  status: FormStatus;
  className?: string;
}

export function FormAlert({
  status,
  className = "",
}: Readonly<FormAlertProps>) {
  if (!status) {
    return null;
  }

  const isSuccess = status.type === "success";

  return (
    <div
      role="alert"
      className={`rounded-md border p-3 text-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      } ${className}`}
    >
      {status.text}
    </div>
  );
}
