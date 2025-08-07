import * as React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
];

interface LanguageSelectorProps {
  variant?: "dropdown" | "button";
}

export function LanguageSelector({ variant = "dropdown" }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (variant === "button") {
    return (
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger asChild>
          <Button variant="ghost" size="sm" className="w-auto gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          </Button>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.nativeName}</span>
                <span className="text-muted-foreground text-sm">({language.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('settings.language')}</label>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger>
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.nativeName}</span>
                <span className="text-muted-foreground text-sm">({language.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}