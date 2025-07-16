"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Verse {
  surah: number
  ayah: number
  surahName: string
  arabicText: string
  translation: string
  theme: string
}

// Sample verses for "Verse of the Day" feature
const inspirationalVerses: Verse[] = [
  {
    surah: 2,
    ayah: 286,
    surahName: "Al-Baqarah",
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear.",
    theme: "Hope & Comfort"
  },
  {
    surah: 94,
    ayah: 6,
    surahName: "Ash-Sharh",
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    theme: "Perseverance"
  },
  {
    surah: 13,
    ayah: 28,
    surahName: "Ar-Ra'd",
    arabicText: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Verily, in the remembrance of Allah do hearts find rest.",
    theme: "Peace & Tranquility"
  },
  {
    surah: 3,
    ayah: 159,
    surahName: "Ali 'Imran",
    arabicText: "فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ",
    translation: "So pardon them and ask forgiveness for them and consult them in the matter.",
    theme: "Forgiveness & Leadership"
  },
  {
    surah: 49,
    ayah: 13,
    surahName: "Al-Hujurat",
    arabicText: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
    translation: "Indeed, the most noble of you in the sight of Allah is the most righteous of you.",
    theme: "Equality & Righteousness"
  },
  {
    surah: 25,
    ayah: 63,
    surahName: "Al-Furqan",
    arabicText: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا",
    translation: "And the servants of the Most Merciful are those who walk upon the earth easily.",
    theme: "Humility"
  },
  {
    surah: 17,
    ayah: 80,
    surahName: "Al-Isra",
    arabicText: "وَقُل رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ",
    translation: "And say: My Lord! Cause me to come in with a firm incoming and to go out with a firm outgoing.",
    theme: "Guidance & Direction"
  }
]

export default function VerseWidget() {
  const [currentVerse, setCurrentVerse] = useState<Verse>(inspirationalVerses[0])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get verse of the day based on current date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const verseIndex = dayOfYear % inspirationalVerses.length
    setCurrentVerse(inspirationalVerses[verseIndex])
  }, [])

  const getNextVerse = () => {
    const currentIndex = inspirationalVerses.findIndex(v => 
      v.surah === currentVerse.surah && v.ayah === currentVerse.ayah
    )
    const nextIndex = (currentIndex + 1) % inspirationalVerses.length
    setCurrentVerse(inspirationalVerses[nextIndex])
  }

  const shareVerse = async () => {
    const shareText = `${currentVerse.arabicText}\n\n"${currentVerse.translation}"\n\n- Quran ${currentVerse.surah}:${currentVerse.ayah} (${currentVerse.surahName})`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse from the Quran',
          text: shareText
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareText)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <span>✨</span>
            Verse of the Day
          </span>
          <Badge variant="secondary" className="text-xs">
            {currentVerse.theme}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Arabic Text */}
        <div className="text-center">
          <div 
            className="text-xl font-amiri leading-relaxed mb-3" 
            dir="rtl"
            style={{ 
              fontFamily: 'var(--font-amiri), "Times New Roman", serif',
              lineHeight: '2'
            }}
          >
            {currentVerse.arabicText}
          </div>
        </div>

        {/* Translation */}
        <div className="text-center">
          <blockquote className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-primary/30 pl-4">
            "{currentVerse.translation}"
          </blockquote>
        </div>

        {/* Reference */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Quran {currentVerse.surah}:{currentVerse.ayah} - {currentVerse.surahName}
          </Badge>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3 pt-4 border-t">
            <div className="text-sm">
              <h4 className="font-medium mb-2">Reflection Points:</h4>
              <ul className="space-y-1 text-muted-foreground">
                {currentVerse.theme === "Hope & Comfort" && (
                  <>
                    <li>• Allah knows our capabilities and limits</li>
                    <li>• We are never given more than we can handle</li>
                    <li>• Trust in Allah's wisdom and mercy</li>
                  </>
                )}
                {currentVerse.theme === "Perseverance" && (
                  <>
                    <li>• Difficulties are temporary</li>
                    <li>• Relief follows hardship</li>
                    <li>• Maintain patience and hope</li>
                  </>
                )}
                {currentVerse.theme === "Peace & Tranquility" && (
                  <>
                    <li>• Remembrance of Allah brings inner peace</li>
                    <li>• Hearts find rest in dhikr</li>
                    <li>• Spiritual connection heals anxiety</li>
                  </>
                )}
                {currentVerse.theme === "Forgiveness & Leadership" && (
                  <>
                    <li>• Forgiveness is a sign of strength</li>
                    <li>• Consultation builds trust</li>
                    <li>• Leadership requires humility</li>
                  </>
                )}
                {currentVerse.theme === "Equality & Righteousness" && (
                  <>
                    <li>• True nobility comes from righteousness</li>
                    <li>• All humans are equal in Allah's sight</li>
                    <li>• Taqwa (God-consciousness) is the measure</li>
                  </>
                )}
                {currentVerse.theme === "Humility" && (
                  <>
                    <li>• Walk with humility and gentleness</li>
                    <li>• Avoid arrogance and pride</li>
                    <li>• True strength is in modesty</li>
                  </>
                )}
                {currentVerse.theme === "Guidance & Direction" && (
                  <>
                    <li>• Seek Allah's guidance in all matters</li>
                    <li>• Ask for righteous beginnings and endings</li>
                    <li>• Trust in Allah's plan</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1"
          >
            {isExpanded ? 'Show Less' : 'Reflect'}
          </Button>
          <Button variant="outline" size="sm" onClick={shareVerse}>
            <span className="mr-1">📤</span>
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={getNextVerse}>
            <span className="mr-1">🔄</span>
            Next
          </Button>
        </div>

        {/* Daily Reminder */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            A new verse is selected each day to inspire your spiritual journey
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
