import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Category, Language } from '@/types/excerpt';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const categories: Category[] = ['Spirituality', 'Philosophy', 'Religion', 'Mythology', 'Other'];
const languages: Language[] = ['English', 'Sanskrit', 'Hindi', 'Other'];

export const AddExcerptForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookTitle: '',
    category: '',
    language: '',
    text: '',
    bookAuthor: '',
    translator: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to add excerpts');

      const fileName = `${formData.bookTitle.toLowerCase().replace(/\s+/g, '-')}.json`;

      const { error } = await supabase.from('excerpts').insert({
        book_title: formData.bookTitle,
        category: formData.category,
        language: formData.language,
        text: formData.text,
        book_author: formData.bookAuthor,
        translator: formData.translator,
        file_name: fileName
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Excerpt added successfully!",
      });

      setFormData({
        bookTitle: '',
        category: '',
        language: '',
        text: '',
        bookAuthor: '',
        translator: ''
      });
    } catch (error) {
      console.error('Error adding excerpt:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add excerpt. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Book Title *"
        value={formData.bookTitle}
        onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
        required
      />

      <Select
        value={formData.category}
        onValueChange={(value) => setFormData({ ...formData, category: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category *" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={formData.language}
        onValueChange={(value) => setFormData({ ...formData, language: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Language *" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Excerpt Text *"
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        required
      />

      <Input
        placeholder="Author Name (optional)"
        value={formData.bookAuthor}
        onChange={(e) => setFormData({ ...formData, bookAuthor: e.target.value })}
      />

      <Input
        placeholder="Translator (optional)"
        value={formData.translator}
        onChange={(e) => setFormData({ ...formData, translator: e.target.value })}
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Excerpt'}
      </Button>
    </form>
  );
};