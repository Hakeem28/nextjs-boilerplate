"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CommunityPost {
  id: string
  author: string
  title: string
  content: string
  timestamp: string
  replies: number
  likes: number
  category: string
}

interface LiveSession {
  id: string
  title: string
  scholar: string
  time: string
  participants: number
  status: 'live' | 'upcoming' | 'ended'
}

// Sample community posts
const samplePosts: CommunityPost[] = [
  {
    id: '1',
    author: 'Ahmad_Student',
    title: 'Beautiful reflection on Surah Al-Fajr',
    content: 'I was reading Surah Al-Fajr this morning and was struck by the powerful imagery of dawn breaking through darkness. It reminded me of how Allah brings light into our darkest moments...',
    timestamp: '2 hours ago',
    replies: 12,
    likes: 24,
    category: 'Reflection'
  },
  {
    id: '2',
    author: 'Fatima_Memorizer',
    title: 'Tips for memorizing long surahs?',
    content: 'Assalamu alaikum everyone! I\'m working on memorizing Surah Al-Baqarah and finding it challenging. Does anyone have effective techniques for memorizing longer chapters?',
    timestamp: '5 hours ago',
    replies: 18,
    likes: 31,
    category: 'Memorization'
  },
  {
    id: '3',
    author: 'Omar_Tajweed',
    title: 'Tajweed rule clarification needed',
    content: 'Can someone help me understand the difference between Ikhfa and Idgham? I keep getting confused during my recitation practice.',
    timestamp: '1 day ago',
    replies: 8,
    likes: 15,
    category: 'Tajweed'
  }
]

// Sample live sessions
const liveSessions: LiveSession[] = [
  {
    id: '1',
    title: 'Tafsir of Surah Yusuf - Part 3',
    scholar: 'Sheikh Abdullah Rahman',
    time: 'Live now',
    participants: 234,
    status: 'live'
  },
  {
    id: '2',
    title: 'Q&A: Islamic Ethics in Modern Life',
    scholar: 'Dr. Aisha Hassan',
    time: 'Tomorrow 8:00 PM',
    participants: 156,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Memorization Techniques Workshop',
    scholar: 'Ustadh Muhammad Ali',
    time: 'Friday 7:00 PM',
    participants: 89,
    status: 'upcoming'
  }
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions')
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  const handleSubmitPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return
    
    // In a real app, this would submit to a backend
    console.log('New post:', { title: newPostTitle, content: newPostContent })
    
    // Reset form
    setNewPostTitle('')
    setNewPostContent('')
    setShowNewPostForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white'
      case 'upcoming': return 'bg-blue-500 text-white'
      case 'ended': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow Muslims, share insights, and learn together
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Community Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="live-sessions">Live Sessions</TabsTrigger>
              <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="mt-6 space-y-6">
              {/* New Post Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Community Discussions</h2>
                <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
                  {showNewPostForm ? 'Cancel' : 'New Post'}
                </Button>
              </div>

              {/* New Post Form */}
              {showNewPostForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Share Your Thoughts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                        placeholder="Post title..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="What would you like to share with the community?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSubmitPost}
                        disabled={!newPostTitle.trim() || !newPostContent.trim()}
                      >
                        Post
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Posts List */}
              <div className="space-y-4">
                {samplePosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {post.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{post.author}</div>
                            <div className="text-xs text-muted-foreground">{post.timestamp}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span>💬</span>
                            {post.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <span>👍</span>
                            {post.likes} likes
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="live-sessions" className="mt-6 space-y-6">
              <h2 className="text-xl font-semibold">Live Tafsir & Q&A Sessions</h2>
              
              <div className="space-y-4">
                {liveSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{session.title}</h3>
                            <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                              {session.status === 'live' ? '🔴 LIVE' : session.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            with {session.scholar}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>⏰ {session.time}</span>
                            <span>👥 {session.participants} participants</span>
                          </div>
                        </div>
                        <Button 
                          variant={session.status === 'live' ? 'default' : 'outline'}
                          className={session.status === 'live' ? 'bg-red-500 hover:bg-red-600' : ''}
                        >
                          {session.status === 'live' ? 'Join Live' : 'Set Reminder'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* MVP Notice */}
              <Alert>
                <AlertDescription>
                  Live sessions are simulated in this MVP version. Real-time streaming and interaction will be available in the full version.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="study-groups" className="mt-6 space-y-6">
              <h2 className="text-xl font-semibold">Study Groups</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Quran Memorization Circle</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Weekly group for memorizing and reviewing Quran together
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        👥 24 members
                      </div>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Tajweed Practice Group</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Improve your recitation with guided practice sessions
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        👥 18 members
                      </div>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Arabic Language Study</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn Arabic to better understand the Quran
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        👥 31 members
                      </div>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Tafsir Study Circle</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Deep dive into Quranic commentary and interpretation
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        👥 15 members
                      </div>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span>🤝</span>
                <span>Be respectful and kind to all members</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📚</span>
                <span>Share knowledge and learn from others</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🔍</span>
                <span>Verify information before sharing</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🚫</span>
                <span>No inappropriate or offensive content</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🤲</span>
                <span>Keep discussions focused on Islamic learning</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Ahmad_Student', 'Fatima_Memorizer', 'Omar_Tajweed', 'Aisha_Scholar'].map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {member.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{member}</div>
                      <div className="text-xs text-muted-foreground">Online now</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Members</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Today</span>
                <Badge variant="secondary">89</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Posts This Week</span>
                <Badge variant="secondary">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Groups</span>
                <Badge variant="secondary">12</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
