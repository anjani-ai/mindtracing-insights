
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Entry } from '@/utils/storage';

interface JournalEntryProps {
  entry: Entry;
}

export const JournalEntry = ({ entry }: JournalEntryProps) => {
  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      excited: '🤩',
      grateful: '🙏',
      frustrated: '😤',
      peaceful: '😌',
      hopeful: '🌈',
      worried: '😟',
      confident: '💪',
      stressed: '😫',
      joy: '😄',
      reflective: '🤔',
      neutral: '😐'
    };
    return emojiMap[emotion.toLowerCase()] || '💭';
  };

  return (
    <Card className="bg-white/50 border-0 hover:bg-white/80 transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">
            {format(new Date(entry.date), 'MMM dd, yyyy')}
          </span>
          <div className="flex gap-1">
            {entry.emotions.slice(0, 3).map((emotion, index) => (
              <span key={index} title={emotion}>
                {getEmotionEmoji(emotion)}
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">
          {entry.content.substring(0, 100)}
          {entry.content.length > 100 && '...'}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {entry.emotions.slice(0, 2).map((emotion, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-purple-50 text-purple-600 border-purple-200"
            >
              {emotion}
            </Badge>
          ))}
          {entry.emotions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{entry.emotions.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
