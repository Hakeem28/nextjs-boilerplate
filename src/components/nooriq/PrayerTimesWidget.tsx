"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPrayerTimes, calculateQiblaDirection, LocationCoords, PrayerTimes } from '@/lib/api'

export default function PrayerTimesWidget() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
  const [location, setLocation] = useState<LocationCoords | null>(null)
  const [locationName, setLocationName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const coords: LocationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      setLocation(coords)
      setLocationPermission('granted')

      // Get location name (reverse geocoding simulation)
      setLocationName(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`)

      // Calculate prayer times and Qibla direction
      const times = await getPrayerTimes(coords)
      setPrayerTimes(times)

      const qibla = calculateQiblaDirection(coords)
      setQiblaDirection(qibla)

    } catch (err) {
      console.error('Location error:', err)
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.')
            setLocationPermission('denied')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.')
            break
          case err.TIMEOUT:
            setError('Location request timed out.')
            break
          default:
            setError('An unknown error occurred while retrieving location.')
            break
        }
      } else {
        setError('Failed to get location. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getNextPrayer = () => {
    if (!prayerTimes) return null

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Sunrise', time: prayerTimes.sunrise },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha }
    ]

    for (const prayer of prayers) {
      const [time, period] = prayer.time.split(' ')
      const [hour, minute] = time.split(':').map(Number)
      let prayerHour = hour
      if (period === 'PM' && hour !== 12) prayerHour += 12
      if (period === 'AM' && hour === 12) prayerHour = 0

      const prayerTimeInMinutes = prayerHour * 60 + minute

      if (prayerTimeInMinutes > currentTimeInMinutes) {
        const timeDiff = prayerTimeInMinutes - currentTimeInMinutes
        const hoursLeft = Math.floor(timeDiff / 60)
        const minutesLeft = timeDiff % 60

        return {
          name: prayer.name,
          time: prayer.time,
          timeLeft: hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`
        }
      }
    }

    // If no prayer found for today, return Fajr for tomorrow
    return {
      name: 'Fajr',
      time: prayerTimes.fajr,
      timeLeft: 'Tomorrow'
    }
  }

  const nextPrayer = getNextPrayer()

  return (
    <div className="space-y-6">
      {/* Current Time & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prayer Times</span>
            <div className="text-right">
              <div className="text-2xl font-mono">{currentTime}</div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!location ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="text-4xl">📍</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Enable location access to get accurate prayer times for your area
              </p>
              <Button onClick={requestLocation} disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    Getting Location...
                  </div>
                ) : (
                  'Enable Location'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="font-medium">{locationName}</span>
              </div>
              {qiblaDirection && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Qibla Direction:</span>
                  <Badge variant="secondary">
                    {Math.round(qiblaDirection)}° from North
                  </Badge>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Next Prayer */}
      {nextPrayer && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Next Prayer</div>
              <div className="text-2xl font-bold mb-1">{nextPrayer.name}</div>
              <div className="text-lg text-muted-foreground mb-2">{nextPrayer.time}</div>
              <Badge variant="secondary" className="text-sm">
                in {nextPrayer.timeLeft}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prayer Times Table */}
      {prayerTimes && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Prayer Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Fajr', time: prayerTimes.fajr, icon: '🌅' },
                { name: 'Sunrise', time: prayerTimes.sunrise, icon: '☀️' },
                { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: '🌞' },
                { name: 'Asr', time: prayerTimes.asr, icon: '🌤️' },
                { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌅' },
                { name: 'Isha', time: prayerTimes.isha, icon: '🌙' }
              ].map((prayer) => (
                <div
                  key={prayer.name}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    nextPrayer?.name === prayer.name ? 'bg-accent border-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{prayer.icon}</span>
                    <span className="font-medium">{prayer.name}</span>
                  </div>
                  <span className="font-mono">{prayer.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Qibla Compass */}
      {qiblaDirection && (
        <Card>
          <CardHeader>
            <CardTitle>Qibla Direction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                <div 
                  className="absolute top-0 left-1/2 w-1 h-16 bg-primary origin-bottom transform -translate-x-1/2"
                  style={{ transform: `translate(-50%, 0) rotate(${qiblaDirection}deg)` }}
                ></div>
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Face {Math.round(qiblaDirection)}° from North
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
