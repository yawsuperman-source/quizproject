'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { isBookmarked, toggleBookmark } from '@/lib/actions';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type BookmarkToggleProps = {
  questionId: string;
};

export function BookmarkToggle({ questionId }: BookmarkToggleProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function checkBookmark() {
      setLoading(true);
      const { isBookmarked: currentlyBookmarked, error } = await isBookmarked(user.id, questionId);
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error });
      } else {
        setBookmarked(currentlyBookmarked ?? false);
      }
      setLoading(false);
    }
    checkBookmark();
  }, [user, questionId, toast]);

  const handleToggle = async () => {
    if (!user) return;
    const { isBookmarked: newBookmarkStatus, error } = await toggleBookmark(user.id, questionId);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error });
    } else {
      setBookmarked(newBookmarkStatus ?? false);
      toast({ title: newBookmarkStatus ? 'Bookmarked!' : 'Bookmark removed.' });
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} disabled={loading}>
      <Bookmark className={bookmarked ? 'fill-primary text-primary' : ''} />
    </Button>
  );
}
