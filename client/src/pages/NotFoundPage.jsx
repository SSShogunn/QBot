import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { Bot, Home } from 'lucide-react'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2 mb-8">
                <Bot className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">QBot</span>
            </div>
            
            <div className="text-center space-y-4 max-w-md">
                <h1 className="text-4xl font-bold">404</h1>
                <h2 className="text-2xl font-semibold text-muted-foreground">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                
                <Button 
                    onClick={() => navigate('/')}
                    className="mt-8"
                    size="lg"
                >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage 