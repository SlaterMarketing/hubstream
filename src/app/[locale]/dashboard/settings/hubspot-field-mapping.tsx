"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveHubSpotFieldMapping } from "@/app/actions/integrations";
import { PlusIcon, Trash2Icon, Loader2Icon } from "lucide-react";

const STANDARD_FIELDS = [
  { key: "firstName", label: "First name", defaultHubSpot: "firstname" },
  { key: "lastName", label: "Last name", defaultHubSpot: "lastname" },
  { key: "company", label: "Company", defaultHubSpot: "company" },
  { key: "jobTitle", label: "Job title", defaultHubSpot: "jobtitle" },
] as const;

type HubSpotProperty = { name: string; label: string };

type Props = {
  initialMapping: Record<string, string> | null;
};

export function HubSpotFieldMapping({ initialMapping }: Props) {
  const router = useRouter();
  const [properties, setProperties] = useState<HubSpotProperty[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>(
    () => initialMapping ?? {}
  );
  const [customRows, setCustomRows] = useState<{ key: string; value: string }[]>(
    () => {
      return Object.entries(initialMapping ?? {})
        .filter(
          ([k]) => !STANDARD_FIELDS.some((f) => f.key === k)
        )
        .map(([key, value]) => ({ key, value }));
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/hubspot/properties")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load properties");
        return res.json();
      })
      .then((data) => setProperties(data.properties ?? []))
      .catch(() => setPropertiesError("Could not load HubSpot properties"))
      .finally(() => setPropertiesLoading(false));
  }, []);

  function getStandardValue(fieldKey: string): string {
    return (
      mapping[fieldKey] ??
      STANDARD_FIELDS.find((f) => f.key === fieldKey)?.defaultHubSpot ??
      ""
    );
  }

  function setStandardValue(fieldKey: string, hubspotProp: string) {
    setMapping((prev) => {
      const next = { ...prev };
      const val = hubspotProp.trim();
      if (val) {
        next[fieldKey] = val;
      } else {
        delete next[fieldKey];
      }
      return next;
    });
  }

  function addCustomRow() {
    setCustomRows((prev) => [...prev, { key: "", value: "" }]);
  }

  function updateCustomRow(index: number, field: "key" | "value", val: string) {
    setCustomRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  }

  function removeCustomRow(index: number) {
    setCustomRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    const fullMapping: Record<string, string> = { ...mapping };
    for (const row of customRows) {
      if (row.key.trim() && row.value.trim()) {
        fullMapping[row.key.trim()] = row.value.trim();
      }
    }
    const result = await saveHubSpotFieldMapping(fullMapping);
    setSaving(false);
    if (result.success) {
      router.refresh();
    }
  }

  const selectClassName =
    "h-10 w-full max-w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Map your registration form fields to HubSpot contact properties.
      </p>

      {propertiesError && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {propertiesError}. You can still enter property names manually below.
        </p>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium">Standard fields</p>
        <div className="space-y-2">
          {STANDARD_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <span className="w-28 shrink-0 text-sm text-muted-foreground">
                {field.label}
              </span>
              <span className="text-muted-foreground">→</span>
              {propertiesLoading ? (
                <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
              ) : properties.length > 0 ? (
                <select
                  value={getStandardValue(field.key)}
                  onChange={(e) =>
                    setStandardValue(field.key, e.target.value)
                  }
                  className={selectClassName}
                >
                  <option value="">Select HubSpot property...</option>
                  {properties.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.label} ({p.name})
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder={field.defaultHubSpot}
                  value={getStandardValue(field.key)}
                  onChange={(e) =>
                    setStandardValue(field.key, e.target.value)
                  }
                  className="max-w-[200px] font-mono text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Custom field mappings</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomRow}
          >
            <PlusIcon className="size-4" />
            Add mapping
          </Button>
        </div>
        {customRows.length > 0 && (
          <div className="space-y-2">
            {customRows.map((row, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                <Input
                  placeholder="Form field key (e.g. industry)"
                  value={row.key}
                  onChange={(e) =>
                    updateCustomRow(index, "key", e.target.value)
                  }
                  className="max-w-[180px] font-mono text-sm"
                />
                <span className="text-muted-foreground">→</span>
                {propertiesLoading ? (
                  <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                ) : properties.length > 0 ? (
                  <select
                    value={row.value}
                    onChange={(e) =>
                      updateCustomRow(index, "value", e.target.value)
                    }
                    className={selectClassName}
                  >
                    <option value="">Select HubSpot property...</option>
                    {properties.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.label} ({p.name})
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    placeholder="HubSpot property (e.g. industry)"
                    value={row.value}
                    onChange={(e) =>
                      updateCustomRow(index, "value", e.target.value)
                    }
                    className="max-w-[180px] font-mono text-sm"
                  />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomRow(index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save mapping"}
      </Button>
    </div>
  );
}
