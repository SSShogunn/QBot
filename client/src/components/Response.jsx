import React from 'react';
import { ScrollArea } from "./ui/scroll-area";
import { ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ReactMarkdown from 'react-markdown';
import copy from 'copy-to-clipboard';
import { useToast } from "../hooks/use-toast"

const ResponseViewer = ({ selectedChat }) => {
    const { toast } = useToast()

    const handleCopy = () => {
        copy(selectedChat.answer);
        toast({
            description: "The answer has been copied to your clipboard",
        });
    }

    if (!selectedChat) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a chat to view the conversation</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="max-w-4xl mx-auto p-4 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">Question</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="whitespace-pre-wrap text-sm">
                                {selectedChat.question}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">Answer</CardTitle>
                            <Button
                                onClick={handleCopy}
                                variant="outline"
                                size="icon"
                                className="flex items-center justify-center w-8 h-8"
                            >
                                <ClipboardList className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="relative group">
                                                <pre className="overflow-x-auto rounded-lg bg-muted p-4 my-2" {...props} />
                                            </div>
                                        ),
                                        code: ({ node, inline, ...props }) => (
                                            inline ?
                                                <code className="px-1 py-0.5 rounded-md bg-muted font-mono text-sm" {...props} /> :
                                                <code className="block w-full" {...props} />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p className="my-2 text-sm leading-relaxed" {...props} />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="my-2 list-disc pl-6 space-y-1" {...props} />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol className="my-2 list-decimal pl-6 space-y-1" {...props} />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li className="my-1 text-sm" {...props} />
                                        ),
                                        h1: ({ node, ...props }) => (
                                            <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
                                        )
                                    }}
                                >
                                    {selectedChat.answer}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ResponseViewer;