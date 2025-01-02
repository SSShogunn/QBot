import { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

function Response({ selectedChat }) {
    if (!selectedChat) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-center">Select a chat to view the conversation</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full p-4">
            <ScrollArea className="flex-1">
                <div className="max-w-3xl mx-auto p-4 space-y-6">
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Question</div>
                        <div className="p-4 rounded-lg bg-accent border">
                            <p className="whitespace-pre-wrap text-foreground">{selectedChat.question}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Answer</div>
                        <div className="p-4 rounded-lg bg-muted border">
                            <ReactMarkdown
                                className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-foreground"
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        return inline ? (
                                            <code
                                                className={`bg-secondary px-1.5 py-0.5 rounded-sm text-sm ${className}`}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        ) : (
                                            <pre
                                                className="bg-secondary/50 p-4 rounded-lg overflow-x-auto"
                                                {...props}
                                            >
                                                <code className={`block text-sm text-foreground ${className}`}>
                                                    {children}
                                                </code>
                                            </pre>
                                        )
                                    },
                                }}
                            >
                                {selectedChat.answer}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default Response

