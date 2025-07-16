"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchResult {
  surah: number
  ayah: number
  arabicText: string
  translation: string
  rootWords: string[]
  theme: string
}

const sampleSearchData: SearchResult[] = [
  {
    surah: 2,
    ayah: 255,
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
    rootWords: ["الله", "حي", "قوم"],
    theme: "Monotheism"
  },
  {
    surah: 3,
    ayah: 18,
    arabicText: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ",
    translation: "Allah witnesses that there is no deity except Him.",
    rootWords: ["الله", "شهد"],
    theme: "Monotheism"
  },
  {
    surah: 24,
    ayah: 35,
    arabicText: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    translation: "Allah is the Light of the heavens and the earth.",
    rootWords: ["الله", "نور", "سماء", "أرض"],
    theme: "Light"
  }
]

export default function AdvancedSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchType, setSearchType] = useState<'root' | 'theme' | 'keyword'>('keyword')

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const lowerQuery = query.toLowerCase()

    const filtered = sampleSearchData.filter(item => {
      if (searchType === 'root') {
        return item.rootWords.some(root => root.includes(lowerQuery))
      } else if (searchType === 'theme') {
        return item.theme.toLowerCase().includes(lowerQuery)
      } else {
        // keyword search in translation and arabicText
        return item.translation.toLowerCase().includes(lowerQuery) || item.arabicText.includes(query)
      }
    })

    setResults(filtered)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Quran Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
          />
          <select
            className="border border-border rounded px-2"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'root' | 'theme' | 'keyword')}
          >
            <option value="keyword">Keyword</option>
            <option value="root">Root Word</option>
            <option value="theme">Theme</option>
          </select>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <ScrollArea className="h-64">
          {results.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No results found.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="text-right font-amiri text-lg mb-2" dir="rtl" style={{ fontFamily: 'var(--font-amiri), "Times New Roman", serif' }}>
                    {result.arabicText}
                  </div>
                  <div className="text-sm text-muted-foreground italic mb-1">
                    "{result.translation}"
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Surah {result.surah}, Ayah {result.ayah} — Theme: {result.theme}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
