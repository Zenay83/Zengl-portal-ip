import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Images, MonitorSpeaker, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchBoxProps {
  language: 'ru' | 'en';
  onSearch: (query: string, type: 'web' | 'images') => void;
  incognitoMode: boolean;
}

interface SearchHistoryItem {
  query: string;
  type: 'web' | 'images';
  timestamp: Date;
}

export const SearchBox = ({ language, onSearch, incognitoMode }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<'web' | 'images'>('web');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const texts = {
    ru: {
      placeholder: 'Найди своё..',
      search: 'Поиск',
      web: 'Веб',
      images: 'Картинки',
      history: 'История поиска',
      clearHistory: 'Очистить историю',
      noHistory: 'История поиска пуста'
    },
    en: {
      placeholder: 'Find yours..',
      search: 'Search',
      web: 'Web',
      images: 'Images',
      history: 'Search History',
      clearHistory: 'Clear History',
      noHistory: 'Search history is empty'
    }
  };

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;

    // Сохранить в историю только если не режим инкогнито
    if (!incognitoMode) {
      const newHistoryItem: SearchHistoryItem = {
        query: query.trim(),
        type: searchType,
        timestamp: new Date()
      };
      setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Максимум 10 элементов
    }

    onSearch(query.trim(), searchType);
    setShowHistory(false);
  }, [query, searchType, onSearch, incognitoMode]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    toast({
      title: language === 'ru' ? 'История очищена' : 'History cleared',
      description: language === 'ru' ? 'История поиска удалена' : 'Search history has been cleared',
      duration: 2000,
    });
  };

  const selectFromHistory = (item: SearchHistoryItem) => {
    setQuery(item.query);
    setSearchType(item.type);
    setShowHistory(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Главная поисковая строка */}
      <div className="relative group">
        <div className="search-container bg-card rounded-full border border-border p-2 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground ml-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder={texts[language].placeholder}
              className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="rounded-full px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {texts[language].search}
            </Button>
          </div>
        </div>

        {/* История поиска */}
        {showHistory && searchHistory.length > 0 && !incognitoMode && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{texts[language].history}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                {texts[language].clearHistory}
              </Button>
            </div>
            <div className="p-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => selectFromHistory(item)}
                  className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors flex items-center gap-3"
                >
                  {item.type === 'images' ? (
                    <Images className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MonitorSpeaker className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="flex-1 truncate">{item.query}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Табы для типа поиска */}
      <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'web' | 'images')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="web" className="data-[state=active]:bg-background">
            <MonitorSpeaker className="h-4 w-4 mr-2" />
            {texts[language].web}
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-background">
            <Images className="h-4 w-4 mr-2" />
            {texts[language].images}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};