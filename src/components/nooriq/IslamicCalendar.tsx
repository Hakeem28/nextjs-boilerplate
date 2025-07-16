"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface IslamicEvent {
  date: string
  hijriDate: string
  title: string
  description: string
  type: 'major' | 'minor' | 'observance'
}

// Sample Islamic calendar events for MVP
const islamicEvents: IslamicEvent[] = [
  {
    date: '2024-01-15',
    hijriDate: '4 Rajab 1445',
    title: 'Isra and Mi\'raj',
    description: 'The Night Journey of Prophet Muhammad (PBUH)',
    type: 'major'
  },
  {
    date: '2024-02-08',
    hijriDate: '29 Rajab 1445',
    title: 'Laylat al-Bara\'ah',
    description: 'The Night of Forgiveness',
    type: 'major'
  },
  {
    date: '2024-03-11',
    hijriDate: '1 Ramadan 1445',
    title: 'First Day of Ramadan',
    description: 'Beginning of the holy month of fasting',
    type: 'major'
  },
  {
    date: '2024-03-21',
    hijriDate: '11 Ramadan 1445',
    title: 'Laylat al-Qadr (estimated)',
    description: 'The Night of Power - one of the odd nights in last 10 days',
    type: 'major'
  },
  {
    date: '2024-04-10',
    hijriDate: '1 Shawwal 1445',
    title: 'Eid al-Fitr',
    description: 'Festival of Breaking the Fast',
    type: 'major'
  },
  {
    date: '2024-06-17',
    hijriDate: '10 Dhul Hijjah 1445',
    title: 'Eid al-Adha',
    description: 'Festival of Sacrifice',
    type: 'major'
  },
  {
    date: '2024-07-07',
    hijriDate: '1 Muharram 1446',
    title: 'Islamic New Year',
    description: 'Beginning of the new Hijri year',
    type: 'major'
  },
  {
    date: '2024-07-16',
    hijriDate: '10 Muharram 1446',
    title: 'Day of Ashura',
    description: 'Day of fasting and remembrance',
    type: 'major'
  }
]

export default function IslamicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [upcomingEvents, setUpcomingEvents] = useState<IslamicEvent[]>([])
  const [todayEvents, setTodayEvents] = useState<IslamicEvent[]>([])

  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Filter today's events
    const todayEvts = islamicEvents.filter(event => event.date === todayStr)
    setTodayEvents(todayEvts)

    // Filter upcoming events (next 30 days)
    const upcoming = islamicEvents.filter(event => {
      const eventDate = new Date(event.date)
      const diffTime = eventDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 && diffDays <= 30
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setUpcomingEvents(upcoming.slice(0, 5)) // Show next 5 events
  }, [])

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-primary text-primary-foreground'
      case 'minor':
        return 'bg-secondary text-secondary-foreground'
      case 'observance':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `${diffDays} days`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`
    return `${Math.floor(diffDays / 30)} months`
  }

  const getCurrentHijriDate = () => {
    // This is a simplified approximation for MVP
    // In production, use a proper Hijri calendar library
    const today = new Date()
    const hijriYear = 1445 + Math.floor((today.getFullYear() - 2024))
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ]
    
    // Simplified calculation - in production use proper Hijri conversion
    const hijriMonth = hijriMonths[today.getMonth()]
    const hijriDay = today.getDate()
    
    return `${hijriDay} ${hijriMonth} ${hijriYear}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Islamic Calendar</span>
          <Badge variant="outline" className="text-xs">
            {getCurrentHijriDate()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Events */}
        {todayEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <span>🎉</span>
              Today's Events
            </h4>
            {todayEvents.map((event, index) => (
              <div key={index} className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm">{event.title}</h5>
                  <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{event.description}</p>
                <p className="text-xs text-muted-foreground">{event.hijriDate}</p>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Events */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <span>📅</span>
            Upcoming Events
          </h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <Badge variant="secondary" className="text-xs">
                        {getDaysUntil(event.date)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{event.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{event.hijriDate}</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mb-2">📅</div>
                  <p className="text-sm">No upcoming events in the next 30 days</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <span className="mr-2">🔔</span>
            Set Event Reminders
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <span className="mr-2">📖</span>
            Learn About Islamic Months
          </Button>
        </div>

        {/* Current Hijri Date Display */}
        <div className="pt-4 border-t text-center">
          <div className="text-sm text-muted-foreground mb-1">Today's Hijri Date</div>
          <div className="font-medium">{getCurrentHijriDate()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* MVP Notice */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            MVP Version: Basic calendar with major events. Full Hijri calendar integration coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
