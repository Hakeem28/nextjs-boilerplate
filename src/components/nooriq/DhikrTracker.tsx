"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DhikrTracker() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const savedCount = localStorage.getItem('nooriq-dhikr-count')
    if (savedCount) {
      setCount(parseInt(savedCount, 10))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nooriq-dhikr-count', count.toString())
  }, [count])

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count > 0 ? count - 1 : 0)
  const reset = () => setCount(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dhikr Tracker</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="text-6xl font-mono">{count}</div>
        <div className="flex justify-center gap-4">
          <Button onClick={decrement} variant="outline" size="lg" disabled={count === 0}>-</Button>
          <Button onClick={increment} variant="default" size="lg">+</Button>
          <Button onClick={reset} variant="destructive" size="lg">Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
}
