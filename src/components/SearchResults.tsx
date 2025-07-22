import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { MonitorSpeaker, Images, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  query: string;
  type: 'web' | 'images';
  language: 'ru' | 'en';
}

// Объявляем глобальные типы для Google CSE
declare global {
  interface Window {
    google: {
      search: {
        cse: {
          element: {
            render: (options: any) => void;
            getElement: (tag: string) => any;
          }
        }
      }
    };
    __gcse: {
      parsetags: string;
      callback: () => void;
    };
  }
}

export const SearchResults = ({ query, type, language }: SearchResultsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const texts = {
    ru: {
      searchingFor: 'Поиск для',
      error: 'Ошибка поиска',
      webResults: 'Результаты веб-поиска',
      imageResults: 'Результаты поиска изображений',
      loadingSearch: 'Загрузка поисковой системы...',
      searching: 'Поиск...'
    },
    en: {
      searchingFor: 'Searching for',
      error: 'Search error',
      webResults: 'Web search results',
      imageResults: 'Image search results',
      loadingSearch: 'Loading search engine...',
      searching: 'Searching...'
    }
  };

  // Инициализация Google Custom Search Engine
  const initializeGoogleCSE = () => {
    if (window.google && window.google.search && window.google.search.cse) {
      setInitialized(true);
      return;
    }

    // Если Google CSE еще не загружен, ждем его загрузки
    window.__gcse = {
      parsetags: 'explicit',
      callback: () => {
        setInitialized(true);
      }
    };
  };

  // Выполнение поиска через Google CSE
  const performSearch = (searchQuery: string) => {
    if (!initialized || !window.google || !window.google.search || !window.google.search.cse) {
      setError(texts[language].error);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Очищаем предыдущие результаты
      const resultsContainer = document.getElementById('google-search-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = '';
      }

      // Создаем новый элемент поиска
      window.google.search.cse.element.render({
        div: "google-search-results",
        tag: 'search'
      });

      // Выполняем поиск
      setTimeout(() => {
        const searchElement = window.google.search.cse.element.getElement('search');
        if (searchElement) {
          searchElement.execute(searchQuery);
        }
        setLoading(false);
      }, 100);

    } catch (err) {
      setError(texts[language].error);
      setLoading(false);
      toast({
        title: texts[language].error,
        description: language === 'ru' ? 'Не удалось выполнить поиск' : 'Failed to perform search',
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Инициализация при монтировании компонента
  useEffect(() => {
    initializeGoogleCSE();
  }, []);

  // Выполнение поиска при изменении запроса
  useEffect(() => {
    if (query && initialized) {
      performSearch(query);
    }
  }, [query, initialized]);

  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {texts[language].loadingSearch}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {texts[language].searching} "{query}"...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <p className="text-muted-foreground">
          {language === 'ru' ? 'Попробуйте перезагрузить страницу' : 'Try refreshing the page'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-4">
        {type === 'web' ? (
          <MonitorSpeaker className="h-5 w-5 text-primary" />
        ) : (
          <Images className="h-5 w-5 text-primary" />
        )}
        <h2 className="text-lg font-semibold">
          {type === 'web' ? texts[language].webResults : texts[language].imageResults}
        </h2>
        <Badge variant="secondary">
          "{query}"
        </Badge>
      </div>

      {/* Google Custom Search Results Container */}
      <div 
        id="google-search-results" 
        className="w-full min-h-[400px] bg-background rounded-lg"
      >
        {/* Google CSE будет отрендерен здесь */}
      </div>
    </div>
  );
};