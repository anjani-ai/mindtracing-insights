
// AI Analysis using Hugging Face Inference API (free tier)
export interface AnalysisResult {
  emotions: string[];
  mood: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  summary: string;
  patterns?: string[];
}

const HF_API_URL = 'https://api-inference.huggingface.co/models';

// Simple emotion detection using text classification
async function detectEmotions(text: string): Promise<string[]> {
  try {
    console.log('Detecting emotions for text:', text.substring(0, 100));
    
    // Use a simpler approach - keyword matching for reliability
    const emotionKeywords = {
      happy: ['happy', 'joy', 'delighted', 'cheerful', 'pleased', 'content', 'glad'],
      sad: ['sad', 'depressed', 'down', 'melancholy', 'blue', 'unhappy'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated'],
      excited: ['excited', 'thrilled', 'pumped', 'enthusiastic', 'eager'],
      grateful: ['grateful', 'thankful', 'appreciative', 'blessed'],
      peaceful: ['peaceful', 'calm', 'serene', 'tranquil', 'relaxed'],
      hopeful: ['hopeful', 'optimistic', 'positive', 'confident', 'encouraged'],
      confused: ['confused', 'uncertain', 'puzzled', 'lost', 'mixed'],
      tired: ['tired', 'exhausted', 'weary', 'drained', 'fatigue']
    };
    
    const lowerText = text.toLowerCase();
    const detectedEmotions: string[] = [];
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    }
    
    // If no specific emotions detected, analyze tone
    if (detectedEmotions.length === 0) {
      if (lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('amazing')) {
        detectedEmotions.push('positive');
      } else if (lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('awful')) {
        detectedEmotions.push('negative');
      } else {
        detectedEmotions.push('reflective');
      }
    }
    
    console.log('Detected emotions:', detectedEmotions);
    return detectedEmotions.slice(0, 3); // Limit to 3 emotions
  } catch (error) {
    console.error('Emotion detection error:', error);
    return ['reflective'];
  }
}

// Determine overall mood from emotions
function analyzeMood(emotions: string[]): AnalysisResult['mood'] {
  const positiveEmotions = ['happy', 'excited', 'grateful', 'peaceful', 'hopeful', 'positive'];
  const negativeEmotions = ['sad', 'anxious', 'angry', 'frustrated', 'tired', 'negative'];
  
  const positiveCount = emotions.filter(e => positiveEmotions.includes(e)).length;
  const negativeCount = emotions.filter(e => negativeEmotions.includes(e)).length;
  
  if (positiveCount > negativeCount) {
    return positiveCount > 1 ? 'very_positive' : 'positive';
  } else if (negativeCount > positiveCount) {
    return negativeCount > 1 ? 'very_negative' : 'negative';
  }
  
  return 'neutral';
}

// Generate summary using local logic
function generateSummary(text: string, emotions: string[]): string {
  const summaries = {
    happy: "You're experiencing positive emotions and joy today. That's wonderful!",
    sad: "You're processing some difficult emotions. Remember that this is temporary.",
    anxious: "You're feeling some worry or stress. Take deep breaths and focus on what you can control.",
    angry: "You're experiencing some frustration. It's okay to feel this way - let's work through it.",
    excited: "Your enthusiasm is shining through! Channel this positive energy.",
    grateful: "Your appreciation and gratitude are beautiful. This mindset brings peace.",
    peaceful: "You're in a calm, centered space. This is a gift to cherish.",
    hopeful: "Your optimism is inspiring. Keep nurturing this positive outlook.",
    reflective: "You're taking time for thoughtful self-reflection. This is valuable inner work."
  };
  
  const primaryEmotion = emotions[0] || 'reflective';
  return summaries[primaryEmotion as keyof typeof summaries] || 
         "Thank you for taking time to reflect and share your thoughts today.";
}

export async function analyzeEntry(text: string): Promise<AnalysisResult> {
  console.log('Starting analysis for entry...');
  
  try {
    const emotions = await detectEmotions(text);
    const mood = analyzeMood(emotions);
    const summary = generateSummary(text, emotions);
    
    return {
      emotions,
      mood,
      summary,
      patterns: [] // Will be enhanced later with pattern detection
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    // Fallback analysis
    return {
      emotions: ['reflective'],
      mood: 'neutral',
      summary: 'Thank you for taking time to reflect today.',
      patterns: []
    };
  }
}

export async function generateAffirmation(emotions: string[]): Promise<string> {
  const affirmations = {
    happy: "I embrace and celebrate the joy in my life.",
    sad: "I honor my feelings and trust that healing is happening.",
    anxious: "I am safe in this moment and trust in my resilience.",
    angry: "I acknowledge my feelings and choose peaceful responses.",
    excited: "I channel my enthusiasm into positive action.",
    grateful: "I appreciate the abundance and beauty around me.",
    peaceful: "I am centered, calm, and at peace with myself.",
    hopeful: "I trust in my ability to create positive change.",
    frustrated: "I breathe through challenges with patience and grace.",
    tired: "I give myself permission to rest and recharge.",
    reflective: "I am growing through mindful self-awareness."
  };
  
  const primaryEmotion = emotions[0] || 'reflective';
  return affirmations[primaryEmotion as keyof typeof affirmations] || 
         "I am worthy of love, growth, and inner peace.";
}

export async function generatePrompt(emotions: string[]): Promise<string> {
  const prompts = {
    happy: "What specific moments today filled you with joy?",
    sad: "What would bring you comfort and peace right now?",
    anxious: "What small step can you take tomorrow to feel more grounded?",
    angry: "What boundaries do you need to set for your wellbeing?",
    excited: "How can you channel this energy into something meaningful?",
    grateful: "What are three small things you appreciate about tomorrow?",
    peaceful: "How can you maintain this sense of calm throughout the week?",
    hopeful: "What dreams feel within reach right now?",
    frustrated: "What would help you feel more in control tomorrow?",
    tired: "What would truly energize and restore you?",
    reflective: "What insight about yourself surprised you today?"
  };
  
  const primaryEmotion = emotions[0] || 'reflective';
  return prompts[primaryEmotion as keyof typeof prompts] || 
         "What would you like to explore in your heart and mind tomorrow?";
}
