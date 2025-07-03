import ChatPrompt from "@/components/ChatPrompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ChatDemo() {
  // Mock function to simulate API call
  const handleChatSubmit = async (prompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate contextual responses based on prompt content
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('system') || lowerPrompt.includes('catalog')) {
      return `## System Catalog Insights

Based on your query about "${prompt}", here's what I can tell you:

**Current System Status**
• **Active Systems**: 12 enterprise systems currently tracked
• **Pending Reviews**: 3 systems awaiting steward assignment
• **Recent Updates**: 5 systems updated in the last 30 days

**Key Features**
- **Stewardship Management**: Track business, security, and technical stewards
- **Status Monitoring**: Real-time system health and lifecycle tracking
- **Data Validation**: Comprehensive email and field validation
- **API Integration**: RESTful API with full CRUD operations

**Recommendations**
1. Regular steward reviews to ensure accountability
2. Automated status monitoring for proactive management
3. Integration with existing IT service management tools`;
    }
    
    if (lowerPrompt.includes('steward') || lowerPrompt.includes('owner')) {
      return `## Stewardship Overview

Regarding "${prompt}":

**Stewardship Roles**
• **Business Steward**: Owns business requirements and priorities
• **Security Steward**: Manages security compliance and risk assessment
• **Technical Steward**: Handles technical architecture and maintenance

**Best Practices**
- Clear role definitions and responsibilities
- Regular steward meetings and reviews
- Documented escalation procedures
- Cross-training for backup coverage

**Current Metrics**
- 95% steward assignment completion rate
- Average response time: 2.3 hours
- Monthly steward review compliance: 88%`;
    }
    
    if (lowerPrompt.includes('api') || lowerPrompt.includes('endpoint')) {
      return `## API Documentation

For your question about "${prompt}":

**Available Endpoints**
\`\`\`
GET    /api/systems          # List all systems
POST   /api/systems          # Create new system
GET    /api/systems/{id}     # Get system details
PUT    /api/systems/{id}     # Update system
DELETE /api/systems/{id}     # Delete system
\`\`\`

**Response Format**
\`\`\`json
{
  "system_id": "SYS-123456-ABCDE",
  "system_name": "Enterprise Portal",
  "status": "active",
  "business_steward_email": "owner@company.com",
  "created_at": "2025-01-01T00:00:00Z"
}
\`\`\`

**Authentication**
- Currently using session-based authentication
- Rate limiting: 100 requests per minute
- CORS enabled for localhost development`;
    }
    
    // Default response
    return `## General Information

Thank you for your question: "${prompt}"

**Enterprise Systems Catalog**
This application helps organizations manage their enterprise systems with comprehensive metadata tracking.

**Key Capabilities**
• System lifecycle management
• Stewardship assignment and tracking
• Status monitoring and reporting
• Data validation and integrity
• RESTful API with comprehensive documentation

**Getting Started**
1. Browse existing systems in the dashboard
2. Create new system entries with full metadata
3. Assign stewards for each system
4. Monitor system status and health
5. Use the API for integrations

**Need Help?**
- Check the system dashboard for current status
- Review API documentation for integration details
- Contact your system administrator for access questions`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Chat Assistant</h1>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask questions about your enterprise systems, stewardship, or API documentation. 
            The assistant will provide detailed, contextual responses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Ask about system status, catalog features, or management capabilities.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Stewardship Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Learn about steward roles, responsibilities, and best practices.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Get help with API endpoints, authentication, and integration.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-primary/20">
          <CardContent className="p-6">
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                Interactive Demo
              </Badge>
              <p className="text-sm text-muted-foreground">
                Try asking questions like "What systems are in the catalog?", "How do steward roles work?", 
                or "Show me the API endpoints". The responses include formatted text, lists, and code blocks.
              </p>
            </div>
            
            <ChatPrompt 
              onSubmit={handleChatSubmit}
              placeholder="Ask about systems, stewardship, APIs, or anything else..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}