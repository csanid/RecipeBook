import { BookOpen } from "lucide-react";

export function Header() {
    return (
        <header className="border-b bg-background sticky top-0 z-10 w-full">
            <div className="container mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight" data-testid="app-title">My Recipe Book</h1>
            </div>
        </header>
    );
}
