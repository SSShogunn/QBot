import React from 'react'
import { Bot, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useToast } from "@/hooks/use-toast"

function ChatSection({ selectedChat, onDelete }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    if (!selectedChat) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 p-4 flex items-center justify-center">
                    <div className="max-w-2xl w-full space-y-6 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Welcome to QBot!</h1>
                            <p className="text-muted-foreground">
                                I&apos;m here to help you with your questions. Feel free to ask anything!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">{selectedChat.title}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(selectedChat.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default ChatSection