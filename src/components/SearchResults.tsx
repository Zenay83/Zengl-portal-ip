import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Globe, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl: string;
  thumbnail?: string;
}

interface ImageResult {
  title: string;
  url: string;
  thumbnailUrl: string;
  size: string;
  source: string;
}

interface SearchResultsProps {
  query: string;
  type: 'web' | 'images';
  language: 'ru' | 'en';
}

export const SearchResults = ({ query, type, language }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult[] | ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const texts = {
    ru: {
      searchingFor: 'Поиск для',
      noResults: 'Результаты не найдены',
      tryAgain: 'Попробуйте другой запрос',
      error: 'Ошибка поиска',
      webResults: 'Результаты веб-поиска',
      imageResults: 'Результаты поиска изображений',
      openImage: 'Открыть изображение',
      viewSite: 'Посетить сайт',
      resultsCount: 'результатов'
    },
    en: {
      searchingFor: 'Searching for',
      noResults: 'No results found',
      tryAgain: 'Try a different search query',
      error: 'Search error',
      webResults: 'Web search results',
      imageResults: 'Image search results',
      openImage: 'Open image',
      viewSite: 'Visit site',
      resultsCount: 'results'
    }
  };

  // Имитация поиска через Google API (здесь нужно будет подключить настоящий API)
  const performSearch = async (searchQuery: string, searchType: 'web' | 'images') => {
    setLoading(true);
    setError(null);

    try {
      // Заглушка для демонстрации - в реальном приложении здесь будет Google Custom Search API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (searchType === 'web') {
        const mockWebResults: SearchResult[] = [
          {
            title: `${searchQuery} - Wikipedia`,
            url: `https://wikipedia.org/wiki/${searchQuery}`,
            snippet: `Подробная информация о ${searchQuery}. Wikipedia - свободная энциклопедия, которую может редактировать каждый.`,
            displayUrl: `wikipedia.org/wiki/${searchQuery}`,
          },
          {
            title: `${searchQuery} - YouTube`,
            url: `https://youtube.com/results?search_query=${searchQuery}`,
            snippet: `Видео и плейлисты по запросу ${searchQuery}. Смотрите лучшие видео на YouTube.`,
            displayUrl: `youtube.com/results?search_query=${searchQuery}`,
          },
          {
            title: `${searchQuery} - GitHub`,
            url: `https://github.com/search?q=${searchQuery}`,
            snippet: `Репозитории и код, связанные с ${searchQuery}. GitHub - крупнейшая платформа для разработчиков.`,
            displayUrl: `github.com/search?q=${searchQuery}`,
          }
        ];
        setResults(mockWebResults);
      } else {
        const mockImageResults: ImageResult[] = [
          {
            title: `${searchQuery} image 1`,
            url: `https://picsum.photos/800/600?random=1`,
            thumbnailUrl: `https://picsum.photos/200/150?random=1`,
            size: '800 × 600',
            source: 'picsum.photos'
          },
          {
            title: `${searchQuery} image 2`,
            url: `https://picsum.photos/800/600?random=2`,
            thumbnailUrl: `https://picsum.photos/200/150?random=2`,
            size: '800 × 600',
            source: 'picsum.photos'
          },
          {
            title: `${searchQuery} image 3`,
            url: `https://picsum.photos/800/600?random=3`,
            thumbnailUrl: `https://picsum.photos/200/150?random=3`,
            size: '800 × 600',
            source: 'picsum.photos'
          }
        ];
        setResults(mockImageResults);
      }

      toast({
        title: language === 'ru' ? 'Поиск завершен' : 'Search completed',
        description: `${language === 'ru' ? 'Найдено' : 'Found'} ${results.length} ${texts[language].resultsCount}`,
        duration: 2000,
      });

    } catch (err) {
      setError(texts[language].error);
      toast({
        title: texts[language].error,
        description: language === 'ru' ? 'Не удалось выполнить поиск' : 'Failed to perform search',
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query, type);
    }
  }, [query, type]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {texts[language].searchingFor} "{query}"...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <p className="text-muted-foreground">{texts[language].tryAgain}</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-muted-foreground">{texts[language].noResults}</p>
        <p className="text-sm text-muted-foreground">{texts[language].tryAgain}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-4">
        {type === 'web' ? (
          <Globe className="h-5 w-5 text-primary" />
        ) : (
          <ImageIcon className="h-5 w-5 text-primary" />
        )}
        <h2 className="text-lg font-semibold">
          {type === 'web' ? texts[language].webResults : texts[language].imageResults}
        </h2>
        <Badge variant="secondary">
          {results.length} {texts[language].resultsCount}
        </Badge>
      </div>

      {type === 'web' ? (
        <div className="space-y-4">
          {(results as SearchResult[]).map((result, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <h3 className="text-lg font-medium text-primary hover:underline group-hover:text-accent transition-colors">
                          {result.title}
                        </h3>
                      </a>
                      <p className="text-sm text-muted-foreground">{result.displayUrl}</p>
                      <p className="text-foreground leading-relaxed">{result.snippet}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {texts[language].viewSite}
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(results as ImageResult[]).map((result, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative aspect-square">
                <img
                  src={result.thumbnailUrl}
                  alt={result.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  asChild
                >
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{result.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{result.size}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-20">{result.source}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};