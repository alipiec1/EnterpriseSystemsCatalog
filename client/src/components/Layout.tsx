import { Button } from "@/components/ui/button";
import { Plus, FileText, User, MessageCircle } from "lucide-react";
import { Link } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
  onCreateSystem: () => void;
}

export default function Layout({ children, onCreateSystem }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900">
                  Enterprise Systems Catalog
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/chat">
                <Button variant="outline" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>AI Chat</span>
                </Button>
              </Link>
              <Button 
                onClick={onCreateSystem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add System</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
