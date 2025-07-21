import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun, User, Shield, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  language: 'ru' | 'en';
  onLanguageChange: (lang: 'ru' | 'en') => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  isLoggedIn: boolean;
  onAuthToggle: () => void;
  incognitoMode: boolean;
  onIncognitoToggle: () => void;
}

export const Header = ({
  language,
  onLanguageChange,
  darkMode,
  onThemeToggle,
  isLoggedIn,
  onAuthToggle,
  incognitoMode,
  onIncognitoToggle
}: HeaderProps) => {
  const { toast } = useToast();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const texts = {
    ru: {
      login: 'Войти',
      logout: 'Выйти',
      incognito: 'Инкогнито',
      language: 'Язык'
    },
    en: {
      login: 'Sign In',
      logout: 'Sign Out',
      incognito: 'Incognito',
      language: 'Language'
    }
  };

  const handleIncognitoToggle = () => {
    onIncognitoToggle();
    toast({
      title: incognitoMode ? 
        (language === 'ru' ? 'Обычный режим включен' : 'Normal mode enabled') :
        (language === 'ru' ? 'Режим инкогнито включен' : 'Incognito mode enabled'),
      description: incognitoMode ? 
        (language === 'ru' ? 'Поиск теперь сохраняется в истории' : 'Search history is now saved') :
        (language === 'ru' ? 'Поиск не сохраняется в истории' : 'Search history is not saved'),
      duration: 3000,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Мобильное меню */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Левая часть - пустая для центрирования */}
        <div className="hidden md:block w-48"></div>

        {/* Центр - логотип (скрыт на мобильных) */}
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Amanda
          </h1>
        </div>

        {/* Правая часть - кнопки */}
        <div className={`${showMobileMenu ? 'flex' : 'hidden'} md:flex items-center gap-2 absolute md:relative top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-background md:bg-transparent p-4 md:p-0 border-b md:border-0 border-border md:w-48 justify-end`}>
          
          {/* Переключатель языка */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLanguageChange(language === 'ru' ? 'en' : 'ru')}
            title={texts[language].language}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Переключатель темы */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Режим инкогнито */}
          <Button
            variant={incognitoMode ? "default" : "ghost"}
            size="icon"
            onClick={handleIncognitoToggle}
            title={texts[language].incognito}
          >
            <Shield className="h-4 w-4" />
          </Button>

          {/* Аутентификация */}
          <Button
            variant={isLoggedIn ? "outline" : "default"}
            size="sm"
            onClick={onAuthToggle}
            className="ml-2"
          >
            <User className="h-4 w-4 mr-2" />
            {isLoggedIn ? texts[language].logout : texts[language].login}
          </Button>
        </div>
      </div>
    </header>
  );
};