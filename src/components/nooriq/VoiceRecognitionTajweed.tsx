"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TajweedLesson {
  id: string
  title: string
  arabicText: string
  transliteration: string
  translation: string
  focusRule: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const tajweedLessons: TajweedLesson[] = [
  {
    id: '1',
    title: 'Basic Pronunciation - Al-Fatihah',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillahi ar-Rahmani ar-Raheem',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    focusRule: 'Clear pronunciation of each letter',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Madd (Elongation) Practice',
    arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Al-hamdu lillahi rabbi al-alameen',
    translation: 'All praise is due to Allah, Lord of the worlds',
    focusRule: 'Proper elongation of vowels',
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Qalqalah (Echo) Letters',
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul huwa Allahu ahad',
    translation: 'Say: He is Allah, the One',
    focusRule: 'Proper pronunciation of Qalqalah letters',
    difficulty: 'intermediate'
  }
]

export default function VoiceRecognitionTajweed() {
  const [selectedLesson, setSelectedLesson] = useState<TajweedLesson>(tajweedLessons[0])
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'ar-SA' // Arabic (Saudi Arabia)

    recognitionRef.current.onresult = (event: any) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      analyzePronunciation(result)
    }

    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setRecordingTime(0)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) return

    setError(null)
    setTranscript('')
    setFeedback(null)
    setScore(null)
    setRecordingTime(0)

    try {
      recognitionRef.current.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (recognitionRef.current && isRecording) {
          recognitionRef.current.stop()
        }
      }, 10000)

    } catch (err) {
      setError('Failed to start recording. Please try again.')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }

  const analyzePronunciation = (spokenText: string) => {
    // This is a simplified analysis for MVP
    // In production, you'd use more sophisticated phonetic analysis
    
    const targetText = selectedLesson.transliteration.toLowerCase()
    const spokenLower = spokenText.toLowerCase()
    
    // Simple similarity check
    const similarity = calculateSimilarity(targetText, spokenLower)
    const calculatedScore = Math.round(similarity * 100)
    
    setScore(calculatedScore)
    
    if (calculatedScore >= 80) {
      setFeedback('Excellent pronunciation! Your Tajweed is very good.')
    } else if (calculatedScore >= 60) {
      setFeedback('Good effort! Try to focus on clearer pronunciation of each letter.')
    } else if (calculatedScore >= 40) {
      setFeedback('Keep practicing! Listen to the reference audio and try to match the pronunciation.')
    } else {
      setFeedback('This is challenging - don\'t give up! Consider practicing with shorter phrases first.')
    }
  }

  const calculateSimilarity = (target: string, spoken: string): number => {
    // Simple Levenshtein distance-based similarity
    const maxLength = Math.max(target.length, spoken.length)
    if (maxLength === 0) return 1
    
    const distance = levenshteinDistance(target, spoken)
    return (maxLength - distance) / maxLength
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🎤 Tajweed Voice Training</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎤</span>
          Tajweed Voice Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lesson Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Practice Lesson</label>
          <Select 
            value={selectedLesson.id} 
            onValueChange={(value) => {
              const lesson = tajweedLessons.find(l => l.id === value)
              if (lesson) setSelectedLesson(lesson)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tajweedLessons.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  <div className="flex items-center gap-2">
                    <span>{lesson.title}</span>
                    <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Lesson Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{selectedLesson.title}</span>
              <Badge className={getDifficultyColor(selectedLesson.difficulty)}>
                {selectedLesson.difficulty}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Arabic Text */}
            <div className="text-center">
              <div 
                className="text-3xl font-amiri leading-loose mb-2" 
                dir="rtl"
                style={{ fontFamily: 'var(--font-amiri), "Times New Roman", serif' }}
              >
                {selectedLesson.arabicText}
              </div>
              <div className="text-lg text-muted-foreground mb-1">
                {selectedLesson.transliteration}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedLesson.translation}
              </div>
            </div>

            {/* Focus Rule */}
            <div className="p-3 bg-accent/50 rounded-lg">
              <div className="text-sm font-medium mb-1">Focus on:</div>
              <div className="text-sm text-muted-foreground">{selectedLesson.focusRule}</div>
            </div>
          </CardContent>
        </Card>

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="text-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isSupported}
              size="lg"
              className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isRecording ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                  <span className="text-sm">Stop</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  <span className="text-sm">Record</span>
                </div>
              )}
            </Button>
          </div>

          {isRecording && (
            <div className="text-center">
              <div className="text-2xl font-mono mb-2">{recordingTime}s</div>
              <div className="text-sm text-muted-foreground">
                Speak clearly into your microphone
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {transcript && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recognition Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">What we heard:</div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  {transcript}
                </div>
              </div>

              {score !== null && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pronunciation Score</span>
                    <Badge variant={score >= 70 ? 'default' : 'secondary'}>
                      {score}%
                    </Badge>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              )}

              {feedback && (
                <div className="p-3 bg-accent/50 rounded-lg">
                  <div className="text-sm">{feedback}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert>
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Select a practice lesson appropriate for your level</li>
              <li>Read the Arabic text and listen to the pronunciation guide</li>
              <li>Click the record button and recite the text clearly</li>
              <li>Review your score and feedback to improve</li>
              <li>Practice regularly to develop proper Tajweed</li>
            </ol>
          </CardContent>
        </Card>

        {/* MVP Notice */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            MVP Version: Basic voice recognition available. Advanced phonetic analysis coming in full version.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
