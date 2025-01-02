import { useAuth } from "@/context/AuthContext"
import ChatHistory from "@/components/ChatHistory"
import ChatSection from "@/components/ChatSection"
import { useState, useEffect } from "react"
import Response from "@/components/Response"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function HomePage() {
    const [selectedChat, setSelectedChat] = useState(null)
    const [question, setQuestion] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNewChat = () => {
        setSelectedChat(null)
    }

    const handleChatComplete = async (chatData) => {
        setSelectedChat(chatData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!question.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/questions/ask', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            })

            if (response.ok) {
                const data = await response.json()
                handleChatComplete(data)
                setQuestion('')
            } else {
                console.error('Failed to send question')
            }
        } catch (error) {
            console.error('Error sending question:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen max-h-screen overflow-hidden">
            <ChatHistory 
                onChatSelect={setSelectedChat}
                onNewChat={handleNewChat}
                latestChat={selectedChat}
            />
            <div className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen mt-16 md:mt-0">
                <div className="flex-1 overflow-y-auto">
                    {selectedChat ? (
                        <Response selectedChat={selectedChat} />
                    ) : (
                        <ChatSection />
                    )}
                </div>
                <div className="border-t p-4 bg-background sticky bottom-0">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Type your question here..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting || !question.trim()}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Question'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

