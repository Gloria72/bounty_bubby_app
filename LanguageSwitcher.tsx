import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="neon-border-green font-bold uppercase tracking-wider"
    >
      <Globe className="mr-2 h-4 w-4" />
      {language === 'zh' ? 'EN' : '中文'}
    </Button>
  );
}

