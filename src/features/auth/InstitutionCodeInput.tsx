import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { institutionsApi, type InstitutionResult } from "@/lib/institutionsApi";

export function InstitutionCodeInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [results, setResults] = useState<InstitutionResult[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!value || value.length < 2) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const found = await institutionsApi.search(value);
        setResults(found);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  return (
    <div className="relative">
      <Input
        value={value}
        placeholder={placeholder ?? "Search by name or code…"}
        error={error}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-line bg-white shadow-card dark:border-line-dark dark:bg-[rgb(var(--surface))]">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-ink-50 dark:hover:bg-white/5"
              onMouseDown={() => {
                onChange(r.code);
                setOpen(false);
              }}
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-xs text-ink-300">
                {r.code} · {r.type} · {r.region}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
