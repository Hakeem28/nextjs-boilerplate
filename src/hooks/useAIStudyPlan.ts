"use client"

import { useState } from 'react'
import { getAIStudyPlan, AIStudyPlanRequest, AIStudyPlanResponse } from '@/lib/api'

export function useAIStudyPlan() {
  const [data, setData] = useState<AIStudyPlanResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudyPlan = async (request: AIStudyPlanRequest) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await getAIStudyPlan(request)
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Study plan generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return {
    data,
    loading,
    error,
    fetchStudyPlan,
    reset
  }
}
