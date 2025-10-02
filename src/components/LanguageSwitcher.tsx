import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.code === i18n.language) || languages[0]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {getCurrentLanguage().nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        {languages.map((language) => {
          const isSelected = i18n.language === language.code;
          return (
            <div
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="relative flex items-center justify-between w-full px-3 py-2 cursor-pointer rounded-md transition-all duration-200"
              style={{
                backgroundColor: isSelected
                  ? "hsl(var(--primary))"
                  : "transparent",
                color: isSelected
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--foreground))",
                border: isSelected
                  ? "1px solid hsl(var(--primary))"
                  : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = "hsl(210 40% 98%)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div className="flex flex-col">
                <span
                  className="font-medium text-sm"
                  style={{
                    fontFamily:
                      language.code === "ta" ? "Arial, sans-serif" : "inherit",
                  }}
                >
                  {language.nativeName}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: isSelected
                      ? "hsl(var(--primary-foreground) / 0.7)"
                      : "hsl(var(--muted-foreground))",
                    fontFamily:
                      language.code === "ta" ? "Arial, sans-serif" : "inherit",
                  }}
                >
                  {language.name}
                </span>
              </div>
              {isSelected && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--primary-foreground))" }}
                />
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
