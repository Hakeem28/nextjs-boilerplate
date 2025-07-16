"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface QuranDisplayProps {
  surahNumber: number
  onAyahSelect: (ayahNumber: number) => void
  showWordByWord: boolean
}

interface Ayah {
  number: number
  text: string
  translation: string
}

interface Surah {
  number: number
  name: string
  arabicName: string
  englishName: string
  numberOfAyahs: number
  ayahs: Ayah[]
}

// Sample Quran data for MVP - In production, this would come from a comprehensive database
const sampleQuranData: Record<number, Surah> = {
  1: {
    number: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    englishName: "The Opening",
    numberOfAyahs: 7,
    ayahs: [
      {
        number: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        number: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "All praise is due to Allah, Lord of the worlds."
      },
      {
        number: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "The Entirely Merciful, the Especially Merciful,"
      },
      {
        number: 4,
        text: "مَالِكِ يَوْمِ الدِّينِ",
        translation: "Sovereign of the Day of Recompense."
      },
      {
        number: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "It is You we worship and You we ask for help."
      },
      {
        number: 6,
        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translation: "Guide us to the straight path -"
      },
      {
        number: 7,
        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
      }
    ]
  },
  2: {
    number: 2,
    name: "Al-Baqarah",
    arabicName: "البقرة",
    englishName: "The Cow",
    numberOfAyahs: 286,
    ayahs: [
      {
        number: 1,
        text: "الم",
        translation: "Alif, Lam, Meem."
      },
      {
        number: 2,
        text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
        translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah -"
      },
      {
        number: 3,
        text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
        translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them,"
      }
    ]
  }
}

export default function QuranDisplay({ surahNumber, onAyahSelect, showWordByWord }: QuranDisplayProps) {
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const surah = sampleQuranData[surahNumber]

  useEffect(() => {
    if (!surah) {
      setError(`Surah ${surahNumber} not available in MVP version`)
    } else {
      setError(null)
    }
  }, [surahNumber, surah])

  const handleAyahClick = (ayahNumber: number) => {
    setSelectedAyah(ayahNumber)
    onAyahSelect(ayahNumber)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading Quran text...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !surah) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            {error || `Surah ${surahNumber} not found`}
          </div>
          <p className="text-muted-foreground text-sm">
            This is the MVP version with limited surahs available.
            Full Quran will be available in the complete version.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{surah.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xl font-amiri">{surah.arabicName}</span>
              <Badge variant="secondary">{surah.englishName}</Badge>
              <Badge variant="outline">{surah.numberOfAyahs} Ayahs</Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {surah.ayahs.map((ayah) => (
          <div
            key={ayah.number}
            className={`p-4 rounded-lg border transition-all cursor-pointer hover:bg-accent/50 ${
              selectedAyah === ayah.number ? 'bg-accent border-primary' : 'border-border'
            }`}
            onClick={() => handleAyahClick(ayah.number)}
          >
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1 shrink-0">
                {ayah.number}
              </Badge>
              <div className="flex-1 space-y-3">
                {/* Arabic Text */}
                <div 
                  className="text-right text-2xl leading-loose font-amiri"
                  dir="rtl"
                  style={{
                    fontFamily: 'var(--font-amiri), "Times New Roman", serif',
                    lineHeight: '2.5'
                  }}
                >
                  {showWordByWord ? (
                    <div className="space-y-2">
                      {ayah.text.split(' ').map((word, index) => (
                        <span
                          key={index}
                          className="inline-block mx-1 px-2 py-1 rounded hover:bg-primary/10 cursor-pointer transition-colors"
                          title="Click for word analysis"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    ayah.text
                  )}
                </div>
                
                {/* Translation */}
                <div className="text-muted-foreground leading-relaxed">
                  {ayah.translation}
                </div>
                
                {/* Tajweed Info */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary" className="text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    Qalqalah
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Madd
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Ghunnah
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" disabled={surahNumber <= 1}>
            Previous Surah
          </Button>
          <div className="text-sm text-muted-foreground">
            Surah {surah.number} of 114
          </div>
          <Button variant="outline" disabled={surahNumber >= 114}>
            Next Surah
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
