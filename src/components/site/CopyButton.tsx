import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "نسخ" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("تم النسخ");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("تعذّر النسخ، يُرجى المحاولة مرة أخرى");
    }
  };
  return (
    <Button type="button" variant="soft" size="sm" onClick={onCopy} aria-label={label}>
      {copied ? <Check /> : <Copy />}
      {copied ? "تم" : label}
    </Button>
  );
}
