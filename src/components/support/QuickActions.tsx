import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, BookOpen, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  const actions = [
    {
      icon: MessageSquare,
      title: "Contact Support",
      description: "Get help from our support team",
      link: "/contact",
      primary: true
    },
    {
      icon: Shield,
      title: "Account & Security",
      description: "Manage your account settings",
      link: "/account-settings",
      primary: false
    },
    {
      icon: BookOpen,
      title: "Story Creation Guide",
      description: "Learn how to create stories",
      link: "/create",
      primary: false
    },
    {
      icon: CreditCard,
      title: "Subscription Help",
      description: "Billing and subscription info",
      link: "/subscriptions",
      primary: false
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, index) => (
        <Card key={index} className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <action.icon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{action.title}</h2>
          </div>
          <p className="text-muted-foreground">{action.description}</p>
          <Button 
            asChild 
            variant={action.primary ? "default" : "outline"} 
            className="w-full"
          >
            <Link to={action.link}>Learn More</Link>
          </Button>
        </Card>
      ))}
    </div>
  );
};