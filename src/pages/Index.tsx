import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBox } from "@/components/SearchBox";
import { SearchResults } from "@/components/SearchResults";
import { QuickLinks } from "@/components/QuickLinks";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'web' | 'images'>('web');
  const [showResults, setShowResults] = useState(false);

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('amanda-language') as 'ru' | 'en';
    const savedDarkMode = localStorage.getItem('amanda-dark-mode') === 'true';
    const savedUser = localStorage.getItem('amanda-user');
    const savedIncognito = localStorage.getItem('amanda-incognito') === 'true';

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedDarkMode) setDarkMode(savedDarkMode);
    if (savedIncognito) setIncognitoMode(savedIncognito);
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserEmail(userData.email);
    }
  }, []);

  // Применение темной темы
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('amanda-dark-mode', darkMode.toString());
  }, [darkMode]);

  // Сохранение языка
  useEffect(() => {
    localStorage.setItem('amanda-language', language);
  }, [language]);

  // Сохранение режима инкогнито
  useEffect(() => {
    localStorage.setItem('amanda-incognito', incognitoMode.toString());
  }, [incognitoMode]);

  const handleLanguageChange = (lang: 'ru' | 'en') => {
    setLanguage(lang);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleAuthToggle = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUserEmail('');
      localStorage.removeItem('amanda-user');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('amanda-user', JSON.stringify({ email }));
    setShowAuthModal(false);
  };

  const handleIncognitoToggle = () => {
    setIncognitoMode(!incognitoMode);
  };

  const handleSearch = (query: string, type: 'web' | 'images') => {
    setSearchQuery(query);
    setSearchType(type);
    setShowResults(true);
  };

  const handleLogoClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  const texts = {
    ru: {
      title: 'Amanda Search',
      subtitle: 'Найди своё в интернете',
      author: 'Создано для поиска'
    },
    en: {
      title: 'Amanda Search',
      subtitle: 'Find yours on the internet',
      author: 'Created for search'
    }
  };

  return (
    <div className={`min-h-screen theme-transition ${incognitoMode ? 'incognito-mode' : 'bg-background'}`}>
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        darkMode={darkMode}
        onThemeToggle={handleThemeToggle}
        isLoggedIn={isLoggedIn}
        onAuthToggle={handleAuthToggle}
        incognitoMode={incognitoMode}
        onIncognitoToggle={handleIncognitoToggle}
      />

      <main className="pt-16">
        {!showResults ? (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
            {/* Логотип */}
            <div className="text-center mb-16 space-y-6">
              <div 
                className="logo-animation cursor-pointer hover-lift"
                onClick={handleLogoClick}
              >
                <div className={`w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center shadow-2xl hover-glow ${incognitoMode ? 'animate-pulse-glow' : ''}`}>
                  <span className="text-4xl font-bold text-white">@</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className={`text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent ${incognitoMode ? 'animate-gradient-shift' : ''}`}>
                  {texts[language].title}
                </h1>
                <p className={`text-xl max-w-md mx-auto ${incognitoMode ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {texts[language].subtitle}
                  {incognitoMode && (
                    <span className="block text-sm mt-2 text-white/60">
                      {language === 'ru' ? 'Режим инкогнито активен' : 'Incognito mode active'}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Поисковая строка */}
            <div className={`w-full max-w-4xl mb-16 ${incognitoMode ? 'incognito-search rounded-xl p-4' : ''}`}>
              <SearchBox
                language={language}
                onSearch={handleSearch}
                incognitoMode={incognitoMode}
              />
            </div>

            {/* Быстрые ссылки */}
            <div className={incognitoMode ? 'incognito-card rounded-xl p-6' : ''}>
              <QuickLinks language={language} />
            </div>

            {/* Подпись автора */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <p className={`text-sm flex items-center gap-2 ${incognitoMode ? 'text-white/70' : 'text-muted-foreground'}`}>
                <span>{texts[language].author}</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">
                  v2.0
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className={`container mx-auto px-4 py-8 ${incognitoMode ? 'incognito-mode min-h-screen' : ''}`}>
            {/* Компактная поисковая строка */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleLogoClick}
                  className={`text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform ${incognitoMode ? 'hover-glow' : ''}`}
                >
                  Amanda
                </button>
                <div className={`flex-1 max-w-2xl ${incognitoMode ? 'incognito-search rounded-xl p-2' : ''}`}>
                  <SearchBox
                    language={language}
                    onSearch={handleSearch}
                    incognitoMode={incognitoMode}
                  />
                </div>
              </div>
            </div>

            {/* Результаты поиска */}
            <div className={incognitoMode ? 'incognito-card rounded-xl p-6' : ''}>
              <SearchResults
                query={searchQuery}
                type={searchType}
                language={language}
              />
            </div>
          </div>
        )}
      </main>

      {/* Модал аутентификации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        language={language}
      />
    </div>
  );
};

export default Index;
