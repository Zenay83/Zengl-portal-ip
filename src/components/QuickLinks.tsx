import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, BookOpen, Music, Github, Twitter, Instagram } from "lucide-react";

interface QuickLinksProps {
  language: 'ru' | 'en';
}

export const QuickLinks = ({ language }: QuickLinksProps) => {
  const texts = {
    ru: {
      quickAccess: 'Быстрый доступ',
      popular: 'Популярные сайты'
    },
    en: {
      quickAccess: 'Quick Access',
      popular: 'Popular Sites'
    }
  };

  const popularSites = [
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: Youtube,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/20'
    },
    {
      name: 'Wikipedia',
      url: 'https://wikipedia.org',
      icon: BookOpen,
      color: 'text-gray-700 dark:text-gray-300',
      bg: 'bg-gray-50 dark:bg-gray-950/20'
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com',
      icon: Music,
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-950/20'
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: Github,
      color: 'text-gray-800 dark:text-gray-200',
      bg: 'bg-gray-50 dark:bg-gray-950/20'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: Twitter,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: Instagram,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/20'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-muted-foreground mb-6">
          {texts[language].popular}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {popularSites.map((site) => {
          const IconComponent = site.icon;
          return (
            <Card key={site.name} className="group hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full h-auto flex flex-col items-center gap-3 p-4 hover:bg-transparent"
                  asChild
                >
                  <a href={site.url} target="_blank" rel="noopener noreferrer">
                    <div className={`w-12 h-12 rounded-full ${site.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-6 w-6 ${site.color}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {site.name}
                    </span>
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};