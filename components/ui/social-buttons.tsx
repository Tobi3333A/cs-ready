import { Button } from "@/components/ui/button";

const providers = [
  { key: "github", label: "GitHub", icon: "🐙" },
  { key: "google", label: "Google", icon: "🔵" },
];

export function SocialButtons({ verb = "Continue" }: { verb?: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((p) => (
        <Button key={p.key} type="button" variant="secondary" className="w-full">
          <span aria-hidden>{p.icon}</span>
          <span className="hidden sm:inline">{verb} with </span>
          {p.label}
        </Button>
      ))}
    </div>
  );
}
