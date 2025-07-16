"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAIStudyPlan } from '@/hooks/useAIStudyPlan'

export default function AIStudyPlan() {
  const [goal, setGoal] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [currentLevel, setCurrentLevel] = useState('')
  const [preferences, setPreferences] = useState('')
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false)

  const { data, loading, error, fetchStudyPlan, reset } = useAIStudyPlan()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!goal || !timeframe || !currentLevel) {
      return
    }

    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      setShowApiKeyPrompt(true)
      return
    }

    await fetchStudyPlan({
      goal,
      timeframe,
      currentLevel,
      preferences
    })
  }

  const handleReset = () => {
    setGoal('')
    setTimeframe('')
    setCurrentLevel('')
    setPreferences('')
    setShowApiKeyPrompt(false)
    reset()
  }

  const sampleGoals = [
    "Memorize Juz Amma (30th part of Quran)",
    "Learn proper Tajweed rules",
    "Complete reading the entire Quran",
    "Memorize Surah Al-Baqarah",
    "Understand Arabic grammar basics",
    "Study Tafsir of selected Surahs"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🤖</span>
          AI-Powered Study Plan Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!data ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Selection */}
            <div className="space-y-2">
              <Label htmlFor="goal">Study Goal</Label>
              <div className="space-y-2">
                <Input
                  id="goal"
                  placeholder="e.g., Memorize Juz Amma in 30 days"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
                <div className="flex flex-wrap gap-2">
                  {sampleGoals.map((sampleGoal, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setGoal(sampleGoal)}
                      className="text-xs"
                    >
                      {sampleGoal}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeframe */}
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 Week</SelectItem>
                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Level */}
            <div className="space-y-2">
              <Label htmlFor="level">Current Level</Label>
              <Select value={currentLevel} onValueChange={setCurrentLevel} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - New to Quran study</SelectItem>
                  <SelectItem value="elementary">Elementary - Can read Arabic</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some memorization experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Experienced in Quran study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Preferences */}
            <div className="space-y-2">
              <Label htmlFor="preferences">Additional Preferences (Optional)</Label>
              <Textarea
                id="preferences"
                placeholder="e.g., I prefer morning study sessions, focus on understanding meanings, include Tajweed practice..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={3}
              />
            </div>

            {/* API Key Prompt */}
            {showApiKeyPrompt && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-3">
                    <p>To use AI-powered study plans, you need to configure an OpenRouter API key.</p>
                    <div className="text-sm space-y-2">
                      <p><strong>Steps to get your API key:</strong></p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai</a></li>
                        <li>Create an account and get your API key</li>
                        <li>Add it to your environment variables as <code className="bg-muted px-1 rounded">NEXT_PUBLIC_OPENROUTER_API_KEY</code></li>
                      </ol>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowApiKeyPrompt(false)}
                    >
                      I'll set this up later
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {error && (
              <Alert>
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || !goal || !timeframe || !currentLevel}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    Generating Plan...
                  </div>
                ) : (
                  'Generate Study Plan'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        ) : (
          /* Study Plan Results */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Personalized Study Plan</h3>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Create New Plan
              </Button>
            </div>

            {/* Plan Overview */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{timeframe}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{data.dailyTasks.length}</div>
                <div className="text-sm text-muted-foreground">Daily Tasks</div>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{data.milestones.length}</div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </div>
            </div>

            {/* Full Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Complete Study Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {data.plan}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Daily Tasks */}
            {data.dailyTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.dailyTasks.map((task, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Badge variant="outline" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{task}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Milestones */}
            {data.milestones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <span className="text-lg">🎯</span>
                        <span className="text-sm">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            {data.tips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Success Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                        <span className="text-lg">💡</span>
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button>
                Start This Plan
              </Button>
              <Button variant="outline">
                Save Plan
              </Button>
              <Button variant="outline">
                Share Plan
              </Button>
            </div>
          </div>
        )}

        {/* MVP Notice */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            AI Study Plans powered by OpenRouter API. Configure your API key to unlock this feature.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
