import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SocialExcerpt, Category, Language } from '@/types/excerpt';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExcerptCard } from './ExcerptCard';

const categories: Category[] = ['Spirituality', 'Philosophy', 'Religion', 'Mythology', 'Other'];
const languages: Language[] = ['English', 'Sanskrit', 'Hindi', 'Other'];

export const ExploreTab = () => {
  const [excerpts, setExcerpts] = useState<SocialExcerpt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExcerpts();
  }, [selectedCategory, selectedLanguage]);

  const fetchExcerpts = async () => {
    try {
      let query = supabase
        .from('excerpts')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      if (selectedLanguage) {
        query = query.eq('language', selectedLanguage);
      }

      const { data, error } = await query;
      if (error) throw error;
      setExcerpts(data || []);
    } catch (error) {
      console.error('Error fetching excerpts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Languages</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Card className="bg-[#0A1929] animate-pulse">
            <CardContent className="h-40" />
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {excerpts.map((excerpt) => (
            <ExcerptCard
              key={excerpt.id}
              excerpt={{
                text: excerpt.text,
                bookTitle: excerpt.book_title,
                bookAuthor: excerpt.book_author || '',
                translator: excerpt.translator || '',
                amazonLink: '',
                commentary: false
              }}
              onNewExcerpt={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};