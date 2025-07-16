"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  surahReference?: string
  ayahReference?: string
  tags: string[]
}

export default function ReflectionJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isWriting, setIsWriting] = useState(false)
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    surahReference: '',
    ayahReference: '',
    tags: ''
  })
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load entries from localStorage on component mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('nooriq-journal-entries')
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries))
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error)
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem('nooriq-journal-entries', JSON.stringify(entries))
    } catch (error) {
      console.error('Failed to save journal entries:', error)
    }
  }, [entries])

  const handleSaveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      return
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: currentEntry.title.trim(),
      content: currentEntry.content.trim(),
      surahReference: currentEntry.surahReference.trim() || undefined,
      ayahReference: currentEntry.ayahReference.trim() || undefined,
      tags: currentEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    }

    setEntries(prev => [newEntry, ...prev])
    setCurrentEntry({
      title: '',
      content: '',
      surahReference: '',
      ayahReference: '',
      tags: ''
    })
    setIsWriting(false)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
    }
  }

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRecentTags = () => {
    const allTags = entries.flatMap(entry => entry.tags)
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag)
  }

  if (selectedEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📖 Reflection Journal</span>
            <Button variant="outline" size="sm" onClick={() => setSelectedEntry(null)}>
              Back to List
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{selectedEntry.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDate(selectedEntry.date)}</span>
              {selectedEntry.surahReference && (
                <Badge variant="outline">
                  Surah {selectedEntry.surahReference}
                  {selectedEntry.ayahReference && `:${selectedEntry.ayahReference}`}
                </Badge>
              )}
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {selectedEntry.content}
            </div>
          </div>

          {selectedEntry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedEntry.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              Edit Entry
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteEntry(selectedEntry.id)}
              className="text-destructive hover:text-destructive"
            >
              Delete Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isWriting) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>✍️ New Reflection</span>
            <Button variant="outline" size="sm" onClick={() => setIsWriting(false)}>
              Cancel
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's on your mind?"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surah">Surah Reference (Optional)</Label>
              <Input
                id="surah"
                placeholder="e.g., Al-Fatihah or 1"
                value={currentEntry.surahReference}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, surahReference: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ayah">Ayah Reference (Optional)</Label>
              <Input
                id="ayah"
                placeholder="e.g., 1-7"
                value={currentEntry.ayahReference}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, ayahReference: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Reflection</Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts, insights, or reflections here..."
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="e.g., gratitude, prayer, guidance (comma-separated)"
              value={currentEntry.tags}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, tags: e.target.value }))}
            />
            {getRecentTags().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Recent tags:</span>
                {getRecentTags().map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      const currentTags = currentEntry.tags.split(',').map(t => t.trim()).filter(t => t)
                      if (!currentTags.includes(tag)) {
                        setCurrentEntry(prev => ({
                          ...prev,
                          tags: currentTags.length > 0 ? `${currentEntry.tags}, ${tag}` : tag
                        }))
                      }
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSaveEntry}
              disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
            >
              Save Reflection
            </Button>
            <Button variant="outline" onClick={() => setIsWriting(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📖 Reflection Journal</span>
          <Button onClick={() => setIsWriting(true)}>
            New Entry
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Input
            placeholder="Search your reflections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-accent/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{entries.length}</div>
            <div className="text-xs text-muted-foreground">Total Entries</div>
          </div>
          <div className="text-center p-3 bg-accent/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {entries.filter(entry => {
                const entryDate = new Date(entry.date)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return entryDate > weekAgo
              }).length}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center p-3 bg-accent/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {new Set(entries.flatMap(entry => entry.tags)).size}
            </div>
            <div className="text-xs text-muted-foreground">Unique Tags</div>
          </div>
        </div>

        {/* Entries List */}
        {filteredEntries.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{entry.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {entry.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {(entry.surahReference || entry.ayahReference) && (
                      <Badge variant="outline" className="text-xs">
                        {entry.surahReference}
                        {entry.ayahReference && `:${entry.ayahReference}`}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">Start Your Reflection Journey</h3>
            <p className="text-muted-foreground mb-4">
              Capture your thoughts, insights, and spiritual reflections as you study the Quran.
            </p>
            <Button onClick={() => setIsWriting(true)}>
              Write Your First Entry
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-muted-foreground">
              No entries found matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* Privacy Notice */}
        <Alert>
          <AlertDescription className="text-xs">
            🔒 Your reflections are stored locally on your device and remain completely private.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
