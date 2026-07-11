import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    icon: ShieldCheck,
    title: "Every record, verified",
    body: "Report cards, diplomas, and certificates are secured on-chain — instantly verifiable by schools, employers, and government.",
  },
  {
    icon: Sparkles,
    title: "AI that guides, not grades",
    body: "Performance forecasts and career recommendations help students and parents act early, not just react to results.",
  },
  {
    icon: Users,
    title: "One platform, every role",
    body: "Students, parents, teachers, schools, police, and government all work from the same trusted source of truth.",
  },
];

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-paper px-6 dark:bg-paper-dark">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="max-w-xs"
          >
            <div className="seal mx-auto mb-6 !h-16 !w-16 !border-gold !text-gold">
              <slide.icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">{slide.title}</h2>
            <p className="mt-2 text-sm text-ink-300">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-10 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-1.5 bg-ink-50 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="flex w-full max-w-xs gap-3">
          {!isLast ? (
            <>
              <Button variant="ghost" className="flex-1" onClick={() => navigate("/onboarding/language")}>
                Skip
              </Button>
              <Button className="flex-1" onClick={() => setIndex((i) => i + 1)}>
                Next
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={() => navigate("/onboarding/language")}>
              Get started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
