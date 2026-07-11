import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { setLanguage, type Language } from "@/store/authSlice";
import { useState } from "react";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
];

export function LanguageSelect() {
  const [selected, setSelected] = useState<Language>("en");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <AuthLayout title="Choose your language" subtitle="You can change this anytime in settings." step={1} totalSteps={4}>
      <div className="space-y-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors ${
              selected === lang.code
                ? "border-ink bg-ink-50 dark:border-white dark:bg-white/5"
                : "border-line dark:border-line-dark"
            }`}
          >
            <span>
              <span className="font-medium">{lang.native}</span>
              <span className="ml-2 text-ink-300">{lang.label}</span>
            </span>
            {selected === lang.code && <Check className="h-4 w-4 text-gold" />}
          </button>
        ))}
      </div>

      <Button
        className="mt-6 w-full"
        onClick={() => {
          dispatch(setLanguage(selected));
          navigate("/welcome");
        }}
      >
        Continue
      </Button>
    </AuthLayout>
  );
}
