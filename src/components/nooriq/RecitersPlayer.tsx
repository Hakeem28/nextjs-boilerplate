"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface RecitersPlayerProps {
  surahNumber: number
  ayahNumber: number
}

interface Reciter {
  id: string
  name: string
  arabicName: string
  style: string
}

const reciters: Reciter[] = [
  {
    id: "mishary",
    name: "Mishary Rashid Alafasy",
    arabicName: "مشاري بن راشد العفاسي",
    style: "Hafs"
  },
  {
    id: "sudais",
    name: "Abdul Rahman Al-Sudais",
    arabicName: "عبد الرحمن السديس",
    style: "Hafs"
  },
  {
    id: "shuraim",
    name: "Saud Al-Shuraim",
    arabicName: "سعود الشريم",
    style: "Hafs"
  },
  {
    id: "husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    style: "Hafs"
  }
]

export default function RecitersPlayer({ surahNumber, ayahNumber }: RecitersPlayerProps) {
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const audioRef = useRef<HTMLAudioElement>(null)

  // In a real app, these would be actual audio URLs from a Quran audio API
  const getAudioUrl = (reciterId: string, surah: number, ayah: number) => {
    // Using a free public Quran audio source for MVP
    // Example: https://verses.quran.com/Abdul_Basit_Murattal_128kbps/001001.mp3
    const surahStr = surah.toString().padStart(3, '0')
    const ayahStr = ayah.toString().padStart(3, '0')

    // Map reciter IDs to actual folder names used by the audio source
    const reciterMap: Record<string, string> = {
      mishary: 'Mishary_Alafasy',
      sudais: 'Abdul_Basit_Murattal',
      shuraim: 'Saad_Al-Ghamdi',
      husary: 'Mahmoud_Khalil_Al_Husary'
    }

    const folderName = reciterMap[reciterId] || 'Mishary_Alafasy'

    return `https://verses.quran.com/${folderName}_128kbps/${surahStr}${ayahStr}.mp3`
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  const handlePlay = async () => {
    if (!audioRef.current) return

    try {
      setLoading(true)
      setError(null)

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const audioUrl = getAudioUrl(selectedReciter, surahNumber, ayahNumber)
        audioRef.current.src = audioUrl
        // Removed setting audioRef.current.type as it does not exist on HTMLAudioElement
        audioRef.current.load()
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError("Failed to load audio. Please check your internet connection.")
      console.error("Audio playback error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const selectedReciterInfo = reciters.find(r => r.id === selectedReciter)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audio Recitation</span>
          <Badge variant="secondary">
            Surah {surahNumber}, Ayah {ayahNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reciter Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Reciter</label>
          <Select value={selectedReciter} onValueChange={setSelectedReciter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reciters.map((reciter) => (
                <SelectItem key={reciter.id} value={reciter.id}>
                  <div className="flex flex-col">
                    <span>{reciter.name}</span>
                    <span className="text-xs text-muted-foreground font-amiri">
                      {reciter.arabicName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedReciterInfo && (
            <div className="text-sm text-muted-foreground">
              Style: {selectedReciterInfo.style} • {selectedReciterInfo.arabicName}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
          </div>
        )}

        {/* Playback Controls */}
        <div className="space-y-4">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            
            <Button 
              onClick={handlePlay} 
              disabled={loading}
              size="lg"
              className="w-16 h-16 rounded-full"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : isPlaying ? (
                "⏸"
              ) : (
                "▶"
              )}
            </Button>
            
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 30)}</span>
            </div>
          </div>

          {/* Additional Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Volume Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume</label>
              <div className="flex items-center gap-2">
                <span className="text-sm">🔊</span>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {volume[0]}%
                </span>
              </div>
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Speed</label>
              <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Playback Options */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Repeat Ayah
            </Button>
            <Button variant="outline" size="sm">
              Auto-play Next
            </Button>
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime)
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration)
            }
          }}
          onEnded={() => {
            setIsPlaying(false)
            setCurrentTime(0)
          }}
          onError={() => {
            setError("Failed to load audio file")
            setIsPlaying(false)
          }}
        />

        {/* MVP Notice */}
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
          MVP Version: Audio playback is simulated. Full audio library will be available in the complete version.
        </div>
      </CardContent>
    </Card>
  )
}
