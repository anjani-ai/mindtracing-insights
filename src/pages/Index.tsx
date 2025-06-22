
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Heart, TrendingUp, Sparkles, Calendar, BookOpen } from "lucide-react";
import { EmotionChart } from "@/components/EmotionChart";
import { JournalEntry } from "@/components/JournalEntry";
import { analyzeEntry, generateAffirmation, generatePrompt } from "@/utils/aiAnalysis";
import { saveEntry, getEntries, type Entry } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentEntry, setCurrentEntry] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedEntries = getEntries();
    setEntries(loadedEntries);
  }, []);

  const handleReflect = async () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something to reflect on 💭",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log("Starting analysis for entry:", currentEntry);
      
      // Analyze the entry
      const analysis = await analyzeEntry(currentEntry);
      console.log("Analysis result:", analysis);
      
      // Generate suggestions
      const affirmation = await generateAffirmation(analysis.emotions);
      const tomorrowPrompt = await generatePrompt(analysis.emotions);
      
      // Create the complete entry
      const entry: Entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: currentEntry,
        emotions: analysis.emotions,
        mood: analysis.mood,
        summary: analysis.summary,
        affirmation,
        tomorrowPrompt,
        patterns: analysis.patterns || []
      };

      // Save entry
      saveEntry(entry);
      setEntries(prev => [entry, ...prev]);
      setCurrentAnalysis(entry);
      setCurrentEntry("");

      toast({
        title: "Entry reflected! ✨",
        description: "Your thoughts have been analyzed with care.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis unavailable",
        description: "Using local insights instead 🌱",
      });
      
      // Fallback local analysis
      const entry: Entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: currentEntry,
        emotions: ["reflective"],
        mood: "neutral",
        summary: "Thank you for taking time to reflect today.",
        affirmation: "I am growing through mindful reflection.",
        tomorrowPrompt: "What brought me peace today?",
        patterns: []
      };
      
      saveEntry(entry);
      setEntries(prev => [entry, ...prev]);
      setCurrentAnalysis(entry);
      setCurrentEntry("");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MindTrace
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your AI-powered companion for mindful reflection and emotional growth 🌱
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Writing Area */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Pour your thoughts here... What's on your mind? How are you feeling? What happened today that stood out to you? 💭"
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="min-h-[200px] text-lg leading-relaxed border-0 bg-white/50 focus:bg-white/80 transition-all"
                />
                <Button
                  onClick={handleReflect}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Reflecting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Reflect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Current Analysis */}
            {currentAnalysis && (
              <Card className="mt-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Your Reflection Insights ✨
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Emotions */}
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Emotional Tone</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.emotions.map((emotion: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                          {emotion} 😊
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Summary</h4>
                    <p className="text-gray-600 leading-relaxed">{currentAnalysis.summary}</p>
                  </div>

                  {/* Affirmation */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Daily Affirmation 💚
                    </h4>
                    <p className="text-green-700 font-medium italic">"{currentAnalysis.affirmation}"</p>
                  </div>

                  {/* Tomorrow's Prompt */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Tomorrow's Reflection Prompt 🌅
                    </h4>
                    <p className="text-blue-700">{currentAnalysis.tomorrowPrompt}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emotion Chart */}
            {entries.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Emotion Journey 📈
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmotionChart entries={entries} />
                </CardContent>
              </Card>
            )}

            {/* Recent Entries */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Recent Reflections 📖
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Start your mindful journey by writing your first reflection ✨
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {entries.slice(0, 10).map((entry) => (
                        <JournalEntry key={entry.id} entry={entry} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
