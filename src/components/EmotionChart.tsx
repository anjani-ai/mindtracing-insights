
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { Entry } from '@/utils/storage';

interface EmotionChartProps {
  entries: Entry[];
}

export const EmotionChart = ({ entries }: EmotionChartProps) => {
  // Process entries for chart data
  const chartData = entries
    .slice(0, 30) // Last 30 entries
    .reverse()
    .map((entry, index) => {
      // Simple mood scoring
      let moodScore = 5; // neutral
      
      if (entry.mood === 'positive') moodScore = 8;
      else if (entry.mood === 'very_positive') moodScore = 9;
      else if (entry.mood === 'negative') moodScore = 3;
      else if (entry.mood === 'very_negative') moodScore = 2;
      
      // Adjust based on emotions
      const positiveEmotions = ['happy', 'joy', 'excited', 'grateful', 'hopeful', 'confident', 'peaceful'];
      const negativeEmotions = ['sad', 'angry', 'anxious', 'stressed', 'frustrated', 'worried', 'depressed'];
      
      const hasPositive = entry.emotions.some(e => positiveEmotions.includes(e.toLowerCase()));
      const hasNegative = entry.emotions.some(e => negativeEmotions.includes(e.toLowerCase()));
      
      if (hasPositive && !hasNegative) moodScore += 1;
      if (hasNegative && !hasPositive) moodScore -= 1;
      
      return {
        date: format(new Date(entry.date), 'MMM dd'),
        mood: Math.max(1, Math.min(10, moodScore)),
        emotions: entry.emotions.join(', ')
      };
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-purple-600">
            Mood: {payload[0].value}/10
          </p>
          <p className="text-sm text-gray-600 max-w-[200px]">
            {payload[0].payload.emotions}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-gray-500">
        Write a few entries to see your emotional journey 🌱
      </div>
    );
  }

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            domain={[1, 10]}
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="url(#gradient)" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#8b5cf6' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
