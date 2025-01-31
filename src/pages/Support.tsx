import { NavigationBar } from "@/components/NavigationBar";
import { SupportHeader } from "@/components/support/SupportHeader";
import { QuickActions } from "@/components/support/QuickActions";
import { FAQSection } from "@/components/support/FAQSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <SupportHeader />
        <QuickActions />
        <FAQSection />
        
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Still Need Help?</h2>
          </div>
          <p className="text-muted-foreground">
            Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="default" className="flex-1">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/terms">View Terms & Privacy</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}