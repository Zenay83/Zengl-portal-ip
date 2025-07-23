import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MonitorSpeaker, Images, Loader2, ExternalLink, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  query: string;
  type: 'web' | 'images';
  language: 'ru' | 'en';
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  formattedUrl?: string;
  pagemap?: {
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
}

interface ImageResult {
  title: string;
  link: string;
  image: {
    contextLink: string;
    thumbnailLink: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
  };
  displayLink: string;
}

const CSE_ID = 'd6e5667695c10479f';
const API_KEY = 'AIzaSyBERT8BV6vdG3pBCJ3JJvWMj3bDr8xq3XM'; // Публичный ключ для демо

export const SearchResults = ({ query, type, language }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const texts = {
    ru: {
      searchingFor: 'Поиск для',
      error: 'Ошибка поиска',
      webResults: 'Результаты веб-поиска',
      imageResults: 'Результаты поиска изображений',
      searching: 'Поиск...',
      noResults: 'Результаты не найдены',
      visitSite: 'Перейти на сайт'
    },
    en: {
      searchingFor: 'Searching for',
      error: 'Search error',
      webResults: 'Web search results',
      imageResults: 'Image search results',
      searching: 'Searching...',
      noResults: 'No results found',
      visitSite: 'Visit site'
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setImageResults([]);

    try {
      const searchType = type === 'images' ? '&searchType=image' : '';
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(searchQuery)}${searchType}&lr=lang_${language}&hl=${language}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (type === 'images') {
        setImageResults(data.items || []);
      } else {
        setResults(data.items || []);
      }
    } catch (err) {
      console.error('Search error:', err);
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
      performSearch(query);
    }
  }, [query, type, language]);

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

  const hasResults = type === 'images' ? imageResults.length > 0 : results.length > 0;

  if (!hasResults && query) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">{texts[language].noResults}</p>
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

      {/* Результаты веб-поиска */}
      {type === 'web' && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">{result.displayLink}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary hover:underline">
                      <a href={result.link} target="_blank" rel="noopener noreferrer">
                        {result.title}
                      </a>
                    </h3>
                  </div>
                  {result.pagemap?.cse_thumbnail?.[0] && (
                    <img
                      src={result.pagemap.cse_thumbnail[0].src}
                      alt={result.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{result.snippet}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{result.formattedUrl}</span>
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {texts[language].visitSite}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Результаты поиска изображений */}
      {type === 'images' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageResults.map((result, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={result.image.thumbnailLink}
                  alt={result.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <a
                    href={result.image.contextLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-6 w-6" />
                  </a>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{result.title}</p>
                <p className="text-xs text-muted-foreground truncate">{result.displayLink}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};