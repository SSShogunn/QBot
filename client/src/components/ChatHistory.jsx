import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/authContext"
import { Menu, LogOut, User, Loader2, Trash2, Ellipsis } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
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
} from "@/components/ui/dropdown-menu";

function ChatHistory({ chatHistory, selectedChat, onChatSelect, isLoading, fetchChatHistory }) {
    const { logout } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        fetchChatHistory()
    }, [])

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

    const handleDelete = async (chatId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/questions/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                toast({
                    title: "Chat deleted",
                    description: "The chat has been deleted successfully",
                });
                await fetchChatHistory(); 
                onChatSelect(null);
            } else {
                throw new Error('Failed to delete chat');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete the chat. Please try again.",
            });
        }
    };

    const ChatHistoryContent = () => {
        const { user } = useAuth();

        return (
            <div className="flex flex-col h-full ">
                <div className="p-4 flex items-center justify-start">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2">
                                <Avatar className="cursor-pointer hover:opacity-80 border-2 border-gray-600">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">Dashboard</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
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
                            <div className="space-y-2">
                                {chatHistory.map((chat) => (
                                    <Button
                                        key={chat.id}
                                        variant="ghost"
                                        className={`w-[83%] justify-between px-2 py-1 h-auto p-3 shadow-sm border rounded-lg ${selectedChat?.id === chat.id ? 'bg-gray-200' : ''}`}
                                        onClick={() => onChatSelect(chat)}
                                    >
                                        <span className="truncate mr-2 text-left">
                                            {chat.title}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Ellipsis className="h-4 w-4 text-gray-500" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="gap-2 align-start w-full"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(chat.id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" /> 
                                                            <span>Delete</span>
                                                        </Button>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(chat.created_at).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "numeric",
                                                                minute: "numeric",
                                                            })}
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
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
            <div className="hidden md:block w-80 border-r-2 border-t-2 border-b-2 rounded-r-3xl border-gray-600 h-screen overflow-hidden">
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

