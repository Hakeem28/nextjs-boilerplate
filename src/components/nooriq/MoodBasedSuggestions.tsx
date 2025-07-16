"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Mood {
  id: string
  name: string
  emoji: string
  description: string
}

interface VerseRecommendation {
  surah: number
  ayah: number
  surahName: string
  arabicText: string
  translation: string
  relevance: string
}

const moods: Mood[] = [
  {
    id: 'grateful',
    name: 'Grateful',
    emoji: '🙏',
    description: 'Feeling thankful and blessed'
  },
  {
    id: 'anxious',
    name: 'Anxious',
    emoji: '😰',
    description: 'Worried or stressed about something'
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    description: 'Feeling down or melancholy'
  },
  {
    id: 'hopeful',
    name: 'Hopeful',
    emoji: '🌟',
    description: 'Looking forward with optimism'
  },
  {
    id: 'confused',
    name: 'Confused',
    emoji: '🤔',
    description: 'Seeking clarity and guidance'
  },
  {
    id: 'peaceful',
    name: 'Peaceful',
    emoji: '☮️',
    description: 'Feeling calm and serene'
  },
  {
    id: 'motivated',
    name: 'Motivated',
    emoji: '💪',
    description: 'Ready to take action and improve'
  },
  {
    id: 'lonely',
    name: 'Lonely',
    emoji: '😔',
    description: 'Feeling isolated or disconnected'
  }
]

const verseRecommendations: Record<string, VerseRecommendation[]> = {
  grateful: [
    {
      surah: 14,
      ayah: 7,
      surahName: "Ibrahim",
      arabicText: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      translation: "If you are grateful, I will certainly give you more.",
      relevance: "Allah promises to increase His blessings for those who are grateful"
    },
    {
      surah: 2,
      ayah: 152,
      surahName: "Al-Baqarah",
      arabicText: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
      translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
      relevance: "The importance of remembrance and gratitude to Allah"
    }
  ],
  anxious: [
    {
      surah: 2,
      ayah: 286,
      surahName: "Al-Baqarah",
      arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation: "Allah does not burden a soul beyond that it can bear.",
      relevance: "Reassurance that Allah never gives us more than we can handle"
    },
    {
      surah: 65,
      ayah: 3,
      surahName: "At-Talaq",
      arabicText: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      translation: "And whoever relies upon Allah - then He is sufficient for him.",
      relevance: "Trust in Allah brings peace and sufficiency"
    }
  ],
  sad: [
    {
      surah: 94,
      ayah: 6,
      surahName: "Ash-Sharh",
      arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "Indeed, with hardship comes ease.",
      relevance: "A promise that difficulties are followed by relief"
    },
    {
      surah: 39,
      ayah: 53,
      surahName: "Az-Zumar",
      arabicText: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      translation: "Do not despair of the mercy of Allah.",
      relevance: "Never lose hope in Allah's infinite mercy"
    }
  ],
  hopeful: [
    {
      surah: 2,
      ayah: 216,
      surahName: "Al-Baqarah",
      arabicText: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
      translation: "But perhaps you hate a thing and it is good for you.",
      relevance: "Allah's wisdom in what appears to be difficulties"
    },
    {
      surah: 18,
      ayah: 68,
      surahName: "Al-Kahf",
      arabicText: "وَكَيْفَ تَصْبِرُ عَلَىٰ مَا لَمْ تُحِطْ بِهِ خُبْرًا",
      translation: "And how can you have patience for what you do not encompass in knowledge?",
      relevance: "Trust in Allah's greater knowledge and plan"
    }
  ],
  confused: [
    {
      surah: 2,
      ayah: 186,
      surahName: "Al-Baqarah",
      arabicText: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
      translation: "And when My servants ask you concerning Me - indeed I am near.",
      relevance: "Allah is always close and ready to guide us"
    },
    {
      surah: 20,
      ayah: 114,
      surahName: "Ta-Ha",
      arabicText: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      translation: "And say: My Lord, increase me in knowledge.",
      relevance: "The prayer for increased knowledge and understanding"
    }
  ],
  peaceful: [
    {
      surah: 13,
      ayah: 28,
      surahName: "Ar-Ra'd",
      arabicText: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      translation: "Verily, in the remembrance of Allah do hearts find rest.",
      relevance: "The source of true peace and tranquility"
    },
    {
      surah: 89,
      ayah: 27,
      surahName: "Al-Fajr",
      arabicText: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
      translation: "O peaceful soul!",
      relevance: "The state of a soul at peace with Allah"
    }
  ],
  motivated: [
    {
      surah: 13,
      ayah: 11,
      surahName: "Ar-Ra'd",
      arabicText: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
      translation: "Indeed, Allah will not change the condition of a people until they change what is in themselves.",
      relevance: "The importance of personal effort and change"
    },
    {
      surah: 94,
      ayah: 7,
      surahName: "Ash-Sharh",
      arabicText: "فَإِذَا فَرَغْتَ فَانصَبْ",
      translation: "So when you have finished, then stand up for worship.",
      relevance: "Continue striving and working towards your goals"
    }
  ],
  lonely: [
    {
      surah: 2,
      ayah: 186,
      surahName: "Al-Baqarah",
      arabicText: "فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
      translation: "Indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
      relevance: "Allah is always with you, ready to listen"
    },
    {
      surah: 50,
      ayah: 16,
      surahName: "Qaf",
      arabicText: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
      translation: "And We are closer to him than his jugular vein.",
      relevance: "Allah's closeness to every human being"
    }
  ]
}

export default function MoodBasedSuggestions() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<VerseRecommendation[]>([])

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
    setRecommendations(verseRecommendations[moodId] || [])
  }

  const resetSelection = () => {
    setSelectedMood(null)
    setRecommendations([])
  }

  if (selectedMood && recommendations.length > 0) {
    const mood = moods.find(m => m.id === selectedMood)
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <span>{mood?.emoji}</span>
              Verses for {mood?.name}
            </span>
            <Button variant="outline" size="sm" onClick={resetSelection}>
              Back
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {recommendations.map((verse, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  {/* Arabic Text */}
                  <div className="text-center">
                    <div 
                      className="text-lg font-amiri leading-relaxed mb-2" 
                      dir="rtl"
                      style={{ fontFamily: 'var(--font-amiri), "Times New Roman", serif' }}
                    >
                      {verse.arabicText}
                    </div>
                  </div>

                  {/* Translation */}
                  <div className="text-center">
                    <blockquote className="text-sm leading-relaxed text-muted-foreground italic">
                      "{verse.translation}"
                    </blockquote>
                  </div>

                  {/* Reference */}
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {verse.surah}:{verse.ayah} - {verse.surahName}
                    </Badge>
                  </div>

                  {/* Relevance */}
                  <div className="p-3 bg-accent/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Why this helps:</strong> {verse.relevance}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <span className="mr-1">📖</span>
                      Read More
                    </Button>
                    <Button variant="outline" size="sm">
                      <span className="mr-1">📤</span>
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Encouragement */}
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-center">
              <strong>Remember:</strong> These verses are here to comfort and guide you. 
              Take time to reflect on their meanings and let them bring peace to your heart.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">💭 How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select your current mood to receive personalized verse recommendations
        </p>

        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent"
              onClick={() => handleMoodSelect(mood.id)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <div className="text-center">
                <div className="font-medium text-sm">{mood.name}</div>
                <div className="text-xs text-muted-foreground">
                  {mood.description}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Additional Help */}
        <div className="pt-4 border-t">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Can't find your mood? Try these general options:
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMoodSelect('peaceful')}
              >
                General Comfort
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMoodSelect('hopeful')}
              >
                Daily Inspiration
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
          Your mood selections are not stored or shared. This feature works entirely on your device.
        </div>
      </CardContent>
    </Card>
  )
}
