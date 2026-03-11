"use client";

import { useTranslations } from "next-intl";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RegistrationField } from "@/app/actions/events";
import { cn } from "@/lib/utils";

type Props = {
  fields: RegistrationField[];
  onChange: (fields: RegistrationField[]) => void;
};

const FIELD_TYPES = ["text", "select", "checkbox"] as const;

export function RegistrationFormBuilder({ fields, onChange }: Props) {
  const t = useTranslations("EventEditor");

  function addField() {
    const key = `field_${Date.now()}`;
    onChange([...fields, { key, label: "New field", type: "text", required: false }]);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function updateField(index: number, updates: Partial<RegistrationField>) {
    const next = [...fields];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  }

  return (
    <div className="rounded-xl bg-card p-6">
      <h3 className="mb-4 font-semibold">{t("registrationForm")}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("registrationFormDescription")}
      </p>

      <div className="mb-4 rounded-lg bg-muted/30 py-2 px-3 text-sm">
        <span className="font-medium">Email *</span>
        <span className="ml-2 text-muted-foreground">(always required)</span>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.key}
            className="flex items-start gap-2 rounded-lg p-3"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                placeholder="Label"
                className="h-8"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  updateField(index, {
                    type: e.target.value as "text" | "select" | "checkbox",
                  })
                }
                className="h-8 w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-foreground"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {field.type === "select" && (
                <Input
                  value={(field.options ?? []).join(", ")}
                  onChange={(e) =>
                    updateField(index, {
                      options: e.target.value
                        .split(",")
                        .map((o) => o.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Options (comma-separated)"
                  className="h-8 text-sm"
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(index, { required: e.target.checked })
                  }
                />
                Required
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => removeField(index)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={addField}
      >
        <PlusIcon className="mr-2 size-4" />
        {t("addField")}
      </Button>
    </div>
  );
}
