import ChatHistory from "../components/ChatHistory"
import ChatSection from "../components/ChatSection"
import Response from "../components/Response"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { useToast } from "../hooks/use-toast"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function HomePage() {
    const [selectedChat, setSelectedChat] = useState(null)
    const [chatHistory, setChatHistory] = useState([])
    const [question, setQuestion] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    const fetchChatHistory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/questions/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('expiresAt');
                    window.location.href = '/auth';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Response is not JSON");
            }

            const data = await response.json();
            setChatHistory(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to fetch chat history. Please try again.",
            });
            if (error.message.includes('No authentication token found')) {
                window.location.href = '/auth';
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (chatId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/questions/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                toast({
                    title: "Chat deleted",
                    description: "The chat has been deleted successfully",
                })
                setSelectedChat(null)
                await fetchChatHistory()
            } else {
                throw new Error('Failed to delete chat')
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error deleting chat",
                description: error.message || "Please try again later",
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!question.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/questions/ask`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            })

            if (response.ok) {
                const data = await response.json()
                setSelectedChat(data)
                setChatHistory(prev => [data, ...prev])
                setQuestion('')
            } else {
                throw new Error('Failed to send question')
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error sending question",
                description: error.message || "Please try again later",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen max-h-screen overflow-hidden">
            <ChatHistory 
                chatHistory={chatHistory}
                selectedChat={selectedChat}
                onChatSelect={setSelectedChat}
                isLoading={isLoading}
                onDelete={handleDelete}
                fetchChatHistory={fetchChatHistory}
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
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSubmitting ? 'Sending' : 'Send Question'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

