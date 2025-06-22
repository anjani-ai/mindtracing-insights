
export interface Entry {
  id: string;
  date: string;
  content: string;
  emotions: string[];
  mood: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  summary: string;
  affirmation: string;
  tomorrowPrompt: string;
  patterns: string[];
}

const STORAGE_KEY = 'mindtrace_entries';

export function saveEntry(entry: Entry): void {
  try {
    const existing = getEntries();
    const updated = [entry, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log('Entry saved successfully');
  } catch (error) {
    console.error('Failed to save entry:', error);
  }
}

export function getEntries(): Entry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
}

export function deleteEntry(id: string): void {
  try {
    const existing = getEntries();
    const filtered = existing.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log('Entry deleted successfully');
  } catch (error) {
    console.error('Failed to delete entry:', error);
  }
}

export function getEmotionPatterns(entries: Entry[]): { emotion: string; count: number }[] {
  const emotionCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    entry.emotions.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  });
  
  return Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMoodTrend(entries: Entry[]): 'improving' | 'stable' | 'declining' {
  if (entries.length < 3) return 'stable';
  
  const recent = entries.slice(0, 5);
  const older = entries.slice(5, 10);
  
  const moodScore = (mood: Entry['mood']) => {
    switch (mood) {
      case 'very_positive': return 5;
      case 'positive': return 4;
      case 'neutral': return 3;
      case 'negative': return 2;
      case 'very_negative': return 1;
      default: return 3;
    }
  };
  
  const recentAvg = recent.reduce((sum, entry) => sum + moodScore(entry.mood), 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + moodScore(entry.mood), 0) / older.length : recentAvg;
  
  if (recentAvg > olderAvg + 0.3) return 'improving';
  if (recentAvg < olderAvg - 0.3) return 'declining';
  return 'stable';
}
