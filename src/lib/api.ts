// API integration for NoorIQ features

export interface AIStudyPlanRequest {
  goal: string;
  timeframe: string;
  currentLevel: string;
  preferences?: string;
}

export interface AIStudyPlanResponse {
  plan: string;
  dailyTasks: string[];
  milestones: string[];
  tips: string[];
}

export async function getAIStudyPlan(request: AIStudyPlanRequest): Promise<AIStudyPlanResponse> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your environment variables.');
  }

  const systemPrompt = `You are an Islamic scholar and educational expert specializing in Quran study plans. Create personalized, practical study plans that respect Islamic traditions and accommodate different learning styles and schedules.

Your response should be structured and actionable, focusing on:
- Realistic daily goals
- Progressive difficulty
- Spiritual reflection components
- Memorization techniques
- Review schedules

Always provide encouragement and remind users of the spiritual benefits of Quran study.`;

  const userPrompt = `Create a personalized Quran study plan with the following details:
- Goal: ${request.goal}
- Timeframe: ${request.timeframe}
- Current Level: ${request.currentLevel}
- Additional Preferences: ${request.preferences || 'None specified'}

Please provide:
1. An overall study plan description
2. Daily tasks breakdown
3. Weekly milestones
4. Helpful tips for success

Format your response as a structured plan that's easy to follow.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://nooriq.app',
        'X-Title': 'NoorIQ - Smart Quran Companion'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from AI service');
    }

    const aiResponse = data.choices[0].message.content;
    
    // Parse the AI response into structured format
    const lines = aiResponse.split('\n').filter((line: string) => line.trim());
    
    return {
      plan: aiResponse,
      dailyTasks: extractSection(lines, 'daily', 5),
      milestones: extractSection(lines, 'milestone', 4),
      tips: extractSection(lines, 'tip', 6)
    };

  } catch (error) {
    console.error('AI Study Plan API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate study plan. Please try again.');
  }
}

function extractSection(lines: string[], keyword: string, maxItems: number): string[] {
  const items: string[] = [];
  let inSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes(keyword) || lowerLine.includes('daily') || lowerLine.includes('tip')) {
      inSection = true;
      continue;
    }
    
    if (inSection && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./))) {
      items.push(line.replace(/^[-•\d.\s]+/, '').trim());
      if (items.length >= maxItems) break;
    }
    
    if (inSection && line.trim() === '') {
      continue;
    }
    
    if (inSection && !line.startsWith('-') && !line.startsWith('•') && !line.match(/^\d+\./) && line.trim() !== '') {
      if (items.length > 0) break;
    }
  }
  
  return items.slice(0, maxItems);
}

// Prayer times calculation utilities
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export async function getPrayerTimes(coords: LocationCoords): Promise<PrayerTimes> {
  try {
    // Using a simple calculation method for MVP
    // In production, you'd use a more sophisticated Islamic prayer time calculation
    const date = new Date();
    const { latitude, longitude } = coords;
    
    // Simplified prayer time calculation (this is a basic approximation)
    const times = calculatePrayerTimes(date, latitude, longitude);
    
    return times;
  } catch (error) {
    console.error('Prayer times calculation error:', error);
    throw new Error('Unable to calculate prayer times for your location');
  }
}

function calculatePrayerTimes(date: Date, lat: number, lng: number): PrayerTimes {
  // This is a simplified calculation for MVP
  // In production, use a proper Islamic prayer time calculation library
  
  const baseHour = 6; // Approximate Fajr time
  
  return {
    fajr: formatTime(baseHour, 0),
    sunrise: formatTime(baseHour + 1, 30),
    dhuhr: formatTime(12, 30),
    asr: formatTime(15, 45),
    maghrib: formatTime(18, 15),
    isha: formatTime(19, 45)
  };
}

function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

export function calculateQiblaDirection(coords: LocationCoords): number {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  const { latitude, longitude } = coords;
  
  const dLng = (kaabaLng - longitude) * Math.PI / 180;
  const lat1 = latitude * Math.PI / 180;
  const lat2 = kaabaLat * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  return bearing;
}
