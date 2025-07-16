"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StyledAyahGenerator() {
  const [text, setText] = useState('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')
  const [fontSize, setFontSize] = useState('text-3xl')
  const [bgColor, setBgColor] = useState('bg-white')
  const [textColor, setTextColor] = useState('text-black')

  const fontSizes = [
    { label: 'Small', value: 'text-xl' },
    { label: 'Medium', value: 'text-3xl' },
    { label: 'Large', value: 'text-5xl' },
    { label: 'Extra Large', value: 'text-7xl' }
  ]

  const bgColors = [
    { label: 'White', value: 'bg-white' },
    { label: 'Ivory', value: 'bg-[#FAFAFA]' },
    { label: 'Emerald Green', value: 'bg-[#2E7D32]' },
    { label: 'Midnight Blue', value: 'bg-[#0D1B2A]' },
    { label: 'Gold Sand', value: 'bg-[#D4AF37]' }
  ]

  const textColors = [
    { label: 'Black', value: 'text-black' },
    { label: 'Ivory White', value: 'text-[#FAFAFA]' },
    { label: 'Emerald Green', value: 'text-[#2E7D32]' },
    { label: 'Midnight Blue', value: 'text-[#0D1B2A]' },
    { label: 'Gold Sand', value: 'text-[#D4AF37]' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Styled Ayah Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <label className="block font-medium">Ayah Text</label>
          <Input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="font-amiri text-right" 
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Font Size</label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-1">Background Color</label>
            <Select value={bgColor} onValueChange={setBgColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bgColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-1">Text Color</label>
            <Select value={textColor} onValueChange={setTextColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div 
          className={`p-8 rounded-lg border text-center font-amiri ${fontSize} ${bgColor} ${textColor}`}
          dir="rtl"
          style={{ lineHeight: '1.5' }}
        >
          {text}
        </div>

        <Button 
          onClick={() => {
            // For MVP, just copy text to clipboard as image generation is complex
            navigator.clipboard.writeText(text)
            alert('Ayah text copied to clipboard! Image generation coming soon.')
          }}
        >
          Copy Ayah Text
        </Button>
      </CardContent>
    </Card>
  )
}
