"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Flashcard {
  id: string
  front: string
  back: string
}

const sampleFlashcards: Flashcard[] = [
  { id: '1', front: 'What is Tajweed?', back: 'The set of rules governing pronunciation during Quran recitation.' },
  { id: '2', front: 'What is Surah Al-Fatihah?', back: 'The opening chapter of the Quran.' },
  { id: '3', front: 'What is the meaning of "Bismillah"?', back: 'In the name of Allah.' }
]

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const currentCard = sampleFlashcards[currentIndex]

  const nextCard = () => {
    setShowBack(false)
    setCurrentIndex((currentIndex + 1) % sampleFlashcards.length)
  }

  const prevCard = () => {
    setShowBack(false)
    setCurrentIndex((currentIndex - 1 + sampleFlashcards.length) % sampleFlashcards.length)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flashcards for Memorization</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div 
          className="p-8 border rounded-lg cursor-pointer select-none"
          onClick={() => setShowBack(!showBack)}
        >
          <p className="text-xl font-semibold">
            {showBack ? currentCard.back : currentCard.front}
          </p>
        </div>
        <div className="flex justify-between">
          <Button onClick={prevCard} variant="outline">Previous</Button>
          <Button onClick={nextCard} variant="outline">Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
