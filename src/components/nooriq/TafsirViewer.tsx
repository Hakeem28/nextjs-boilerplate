"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TafsirViewerProps {
  surahNumber: number
  ayahNumber: number
}

interface TafsirEntry {
  scholar: string
  text: string
  source: string
  type: 'classical' | 'modern'
}

// Sample tafsir data for MVP
const sampleTafsirData: Record<string, TafsirEntry[]> = {
  "1-1": [
    {
      scholar: "Ibn Kathir",
      text: "The Basmalah (In the name of Allah) is the beginning of every good deed. It is a declaration of seeking Allah's blessing and guidance in all our actions. The two names Ar-Rahman and Ar-Raheem both refer to Allah's mercy, with Ar-Rahman being His general mercy for all creation, and Ar-Raheem being His specific mercy for the believers.",
      source: "Tafsir Ibn Kathir",
      type: "classical"
    },
    {
      scholar: "Sayyid Qutb",
      text: "Beginning with the name of Allah establishes the proper relationship between the servant and the Creator. It reminds us that every action should be undertaken with consciousness of Allah and seeking His guidance. This opening sets the tone for the entire Quran as a book of guidance.",
      source: "Fi Zilal al-Quran",
      type: "modern"
    }
  ],
  "1-2": [
    {
      scholar: "Al-Tabari",
      text: "All praise belongs to Allah alone, as He is the Creator, Sustainer, and Lord of all that exists. The word 'Hamd' encompasses both praise and gratitude, acknowledging Allah's perfection and our dependence on Him. 'Rabb al-Alameen' means the Lord and Sustainer of all worlds and all creation.",
      source: "Jami' al-Bayan",
      type: "classical"
    },
    {
      scholar: "Muhammad Asad",
      text: "This verse establishes the fundamental Islamic concept of Tawhid - the absolute oneness and sovereignty of Allah. By declaring that all praise belongs to Allah, we acknowledge that every blessing, every moment of happiness, and every success ultimately comes from Him alone.",
      source: "The Message of the Quran",
      type: "modern"
    }
  ]
}

export default function TafsirViewer({ surahNumber, ayahNumber }: TafsirViewerProps) {
  const [selectedTab, setSelectedTab] = useState<'classical' | 'modern'>('classical')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tafsirKey = `${surahNumber}-${ayahNumber}`
  const tafsirEntries = sampleTafsirData[tafsirKey] || []
  const classicalTafsir = tafsirEntries.filter(entry => entry.type === 'classical')
  const modernTafsir = tafsirEntries.filter(entry => entry.type === 'modern')

  useEffect(() => {
    // Reset error when ayah changes
    setError(null)
  }, [surahNumber, ayahNumber])

  if (tafsirEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tafsir Commentary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-4">📚</div>
            <p className="mb-2">Tafsir not available for this ayah in MVP version</p>
            <p className="text-sm">
              Comprehensive tafsir from multiple scholars will be available in the full version
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
          <span>Tafsir Commentary</span>
          <Badge variant="outline">
            {surahNumber}:{ayahNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'classical' | 'modern')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="classical" className="flex items-center gap-2">
              <span>📜</span>
              Classical ({classicalTafsir.length})
            </TabsTrigger>
            <TabsTrigger value="modern" className="flex items-center gap-2">
              <span>🔍</span>
              Modern ({modernTafsir.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classical" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {classicalTafsir.length > 0 ? (
                  classicalTafsir.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary">{entry.scholar}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {entry.source}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {entry.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No classical tafsir available for this ayah</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="modern" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {modernTafsir.length > 0 ? (
                  modernTafsir.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary">{entry.scholar}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {entry.source}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {entry.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No modern tafsir available for this ayah</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Additional Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm">
            <span className="mr-2">🔖</span>
            Bookmark
          </Button>
          <Button variant="outline" size="sm">
            <span className="mr-2">📤</span>
            Share
          </Button>
          <Button variant="outline" size="sm">
            <span className="mr-2">📝</span>
            Add Note
          </Button>
        </div>

        {/* MVP Notice */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            MVP Version: Limited tafsir available. Full commentary from 20+ scholars coming in complete version.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
