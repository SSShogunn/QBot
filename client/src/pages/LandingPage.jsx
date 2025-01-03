import { Button } from "../components/ui/button"
import { useNavigate } from 'react-router-dom'
import { Bot, MessageSquare, Zap, Shield } from 'lucide-react'

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Bot className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">QBot</span>
                        </div>
                        <Button 
                            onClick={() => navigate('/auth')}
                            variant="outline"
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </nav>

            <section className="flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
                    <div className="text-center space-y-8">
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                            Your AI-Powered Question
                            <span className="text-primary block">Answering Assistant</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Get instant, accurate answers to your questions with our advanced AI chatbot. 
                            Experience smarter conversations and efficient problem-solving.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button 
                                size="lg" 
                                onClick={() => navigate('/auth')}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 space-y-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Smart Conversations</h3>
                            <p className="text-muted-foreground">
                                Engage in natural conversations with our AI that understands context and provides relevant responses.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 space-y-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Instant Answers</h3>
                            <p className="text-muted-foreground">
                                Get immediate responses to your questions with high accuracy and detailed explanations.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 space-y-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Secure & Private</h3>
                            <p className="text-muted-foreground">
                                Your conversations are protected with enterprise-grade security and privacy measures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage