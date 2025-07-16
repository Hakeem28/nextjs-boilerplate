"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface WordByWordProps {
  surahNumber: number
  ayahNumber: number
}

interface WordAnalysis {
  arabic: string
  transliteration: string
  translation: string
  grammar: {
    type: string
    root?: string
    form?: string
    tense?: string
    person?: string
    number?: string
    gender?: string
  }
  morphology: string[]
}

// Sample word-by-word data for MVP
const sampleWordData: Record<string, WordAnalysis[]> = {
  "1-1": [
    {
      arabic: "بِسْمِ",
      transliteration: "Bismi",
      translation: "In the name",
      grammar: {
        type: "Preposition + Noun",
        root: "س م و",
        form: "Genitive"
      },
      morphology: ["Preposition بِ (bi)", "Noun اسْم (ism) in genitive case"]
    },
    {
      arabic: "اللَّهِ",
      transliteration: "Allah-i",
      translation: "of Allah",
      grammar: {
        type: "Proper Noun",
        form: "Genitive"
      },
      morphology: ["Divine name in genitive case", "Connected to previous word"]
    },
    {
      arabic: "الرَّحْمَٰنِ",
      transliteration: "Ar-Rahman-i",
      translation: "the Most Gracious",
      grammar: {
        type: "Adjective/Divine Attribute",
        root: "ر ح م",
        form: "Intensive form (فعلان)"
      },
      morphology: ["Intensive adjective", "Describes Allah's universal mercy"]
    },
    {
      arabic: "الرَّحِيمِ",
      transliteration: "Ar-Raheem-i",
      translation: "the Most Merciful",
      grammar: {
        type: "Adjective/Divine Attribute",
        root: "ر ح م",
        form: "Intensive form (فعيل)"
      },
      morphology: ["Intensive adjective", "Describes Allah's specific mercy"]
    }
  ],
  "1-2": [
    {
      arabic: "الْحَمْدُ",
      transliteration: "Al-hamdu",
      translation: "All praise",
      grammar: {
        type: "Noun",
        root: "ح م د",
        form: "Nominative"
      },
      morphology: ["Definite noun", "Subject of sentence", "Encompasses praise and gratitude"]
    },
    {
      arabic: "لِلَّهِ",
      transliteration: "Lillah-i",
      translation: "belongs to Allah",
      grammar: {
        type: "Preposition + Proper Noun",
        form: "Genitive"
      },
      morphology: ["Preposition لِ (li) meaning 'for/to'", "Allah in genitive case"]
    },
    {
      arabic: "رَبِّ",
      transliteration: "Rabbi",
      translation: "Lord",
      grammar: {
        type: "Noun",
        root: "ر ب ب",
        form: "Genitive, Construct state"
      },
      morphology: ["In construct with following word", "Means Lord, Master, Sustainer"]
    },
    {
      arabic: "الْعَالَمِينَ",
      transliteration: "Al-'alameen",
      translation: "of all the worlds",
      grammar: {
        type: "Noun",
        root: "ع ل م",
        form: "Genitive Plural"
      },
      morphology: ["Broken plural", "Refers to all creation", "All realms of existence"]
    }
  ]
}

export default function WordByWord({ surahNumber, ayahNumber }: WordByWordProps) {
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [showGrammar, setShowGrammar] = useState(true)
  const [showMorphology, setShowMorphology] = useState(false)

  const wordKey = `${surahNumber}-${ayahNumber}`
  const words = sampleWordData[wordKey] || []

  useEffect(() => {
    setSelectedWord(null)
  }, [surahNumber, ayahNumber])

  if (words.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Word-by-Word Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-4">🔍</div>
            <p className="mb-2">Word analysis not available for this ayah</p>
            <p className="text-sm">
              Complete grammatical analysis will be available in the full version
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Word-by-Word Analysis</span>
          <Badge variant="outline">
            {surahNumber}:{ayahNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle Options */}
        <div className="flex gap-2">
          <Button
            variant={showGrammar ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGrammar(!showGrammar)}
          >
            Grammar
          </Button>
          <Button
            variant={showMorphology ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMorphology(!showMorphology)}
          >
            Morphology
          </Button>
        </div>

        {/* Words Grid */}
        <div className="space-y-3">
          {words.map((word, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                selectedWord === index ? 'bg-accent border-primary' : 'border-border'
              }`}
              onClick={() => setSelectedWord(selectedWord === index ? null : index)}
            >
              {/* Word Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <div className="text-right">
                    <div 
                      className="text-2xl font-amiri mb-1" 
                      dir="rtl"
                      style={{ fontFamily: 'var(--font-amiri), "Times New Roman", serif' }}
                    >
                      {word.arabic}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {word.transliteration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{word.translation}</div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedWord === index && (
                <div className="space-y-4 pt-3 border-t">
                  {/* Grammar Section */}
                  {showGrammar && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span>📚</span>
                        Grammar
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="ml-2 font-medium">{word.grammar.type}</span>
                        </div>
                        {word.grammar.root && (
                          <div>
                            <span className="text-muted-foreground">Root:</span>
                            <span className="ml-2 font-medium font-amiri" dir="rtl">
                              {word.grammar.root}
                            </span>
                          </div>
                        )}
                        {word.grammar.form && (
                          <div>
                            <span className="text-muted-foreground">Form:</span>
                            <span className="ml-2 font-medium">{word.grammar.form}</span>
                          </div>
                        )}
                        {word.grammar.tense && (
                          <div>
                            <span className="text-muted-foreground">Tense:</span>
                            <span className="ml-2 font-medium">{word.grammar.tense}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Morphology Section */}
                  {showMorphology && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span>🔬</span>
                        Morphological Analysis
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {word.morphology.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <span className="mr-1">🔊</span>
                      Pronounce
                    </Button>
                    <Button variant="outline" size="sm">
                      <span className="mr-1">📖</span>
                      More Examples
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground text-center">
            Click on any word above for detailed grammatical analysis
          </div>
        </div>

        {/* MVP Notice */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            MVP Version: Basic word analysis available. Complete morphological database coming in full version.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
