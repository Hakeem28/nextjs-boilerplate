"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the meaning of "Tajweed"?',
    options: ['Rules of Quran recitation', 'A chapter in the Quran', 'A prayer', 'A type of Arabic grammar'],
    correctAnswer: 'Rules of Quran recitation'
  },
  {
    id: '2',
    question: 'Which Surah is known as "The Opening"?',
    options: ['Al-Fatihah', 'Al-Baqarah', 'Al-Ikhlas', 'An-Nas'],
    correctAnswer: 'Al-Fatihah'
  },
  {
    id: '3',
    question: 'What does "Bismillah" mean?',
    options: ['In the name of Allah', 'Praise be to Allah', 'God is great', 'Peace be upon you'],
    correctAnswer: 'In the name of Allah'
  }
]

export default function Quizzes() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const currentQuestion = sampleQuizQuestions[currentQuestionIndex]

  const handleSubmit = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    setSelectedOption(null)
    setShowResult(false)
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  const handleRestart = () => {
    setSelectedOption(null)
    setShowResult(false)
    setCurrentQuestionIndex(0)
    setScore(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestionIndex < sampleQuizQuestions.length ? (
          <>
            <div className="text-lg font-semibold">{currentQuestion.question}</div>
            <RadioGroup value={selectedOption || ''} onValueChange={setSelectedOption}>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={option} disabled={showResult} />
                    <label htmlFor={option} className="cursor-pointer select-none">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {!showResult ? (
              <Button onClick={handleSubmit} disabled={!selectedOption}>
                Submit
              </Button>
            ) : (
              <div className="space-y-3">
                {selectedOption === currentQuestion.correctAnswer ? (
                  <div className="text-green-600 font-semibold">Correct!</div>
                ) : (
                  <div className="text-red-600 font-semibold">
                    Incorrect. The correct answer is: {currentQuestion.correctAnswer}
                  </div>
                )}
                {currentQuestionIndex < sampleQuizQuestions.length - 1 ? (
                  <Button onClick={handleNext}>Next Question</Button>
                ) : (
                  <div className="space-y-2">
                    <div>Your score: {score} / {sampleQuizQuestions.length}</div>
                    <Button onClick={handleRestart}>Restart Quiz</Button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
