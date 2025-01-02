import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/authContext"
import { PlusCircle, Menu, LogOut, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from 'lucide-react'

function ChatHistory({ onChatSelect, onNewChat, latestChat }) {
    const { logout } = useAuth()
    const { toast } = useToast()
    const [chatHistory, setChatHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const token = localStorage.getItem('token')
                
                if (!token) {
                    console.error('No access token found')
                    setIsLoading(false)
                    return
                }

                const response = await fetch('http://127.0.0.1:8000/questions/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    setChatHistory(Array.isArray(data) ? data : [])
                } else {
                    const errorData = await response.text()
                    console.error('Error response:', errorData)
                    setChatHistory([])
                }
            } catch (error) {
                console.error('Error fetching chat history:', error)
                setChatHistory([])
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchChatHistory()
    }, [])

    useEffect(() => {
        if (latestChat && !chatHistory.find(chat => chat.id === latestChat.id)) {
            setChatHistory(prev => [latestChat, ...prev])
        }
    }, [chatHistory, latestChat])

    const handleLogout = () => {
        try {
            logout()
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error logging out",
                description: "Please try again later",
            })
        }
    }

    const ChatHistoryContent = () => {
        const { user, logout } = useAuth();
        const { toast } = useToast();
        
        return (
            <div className="flex flex-col h-full">
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-xl hidden md:block">Chat History</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer hover:opacity-80">
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start gap-1">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <hr />
                <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
                    <div className="p-2 space-y-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : chatHistory.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>No messages yet</p>
                                <p className="text-sm">Ask any question to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {chatHistory.map((chat) => (
                                    <Button
                                        key={chat.id}
                                        variant="ghost"
                                        className="w-[80%] justify-between px-2 py-1 h-auto"
                                        onClick={() => onChatSelect(chat)}
                                    >
                                        <span className="truncate mr-2 text-left">
                                            {chat.title}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(chat.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        )
    }

    return (
        <>
            <div className="hidden md:block w-80 border-r-2 rounded-r-3xl border-gray-600 h-screen overflow-hidden">
                <ChatHistoryContent />
            </div>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="fixed top-0 left-0 right-0 p-4 bg-background border-b  flex items-center justify-between z-50">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarImage src="/bot-message-square.svg" alt="QBot" />
                                    <AvatarFallback>QB</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">QBot</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-background"
                                aria-label="Open chat history"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Chat History</SheetTitle>
                            <SheetDescription>
                                View your conversation history with QBot
                            </SheetDescription>
                        </SheetHeader>
                        <ChatHistoryContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

export default ChatHistory

