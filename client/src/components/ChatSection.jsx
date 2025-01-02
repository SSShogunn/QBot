import React from 'react'
import { Bot } from 'lucide-react'

function ChatSection() {
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
              I'm here to help you with your questions. Feel free to ask anything!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSection