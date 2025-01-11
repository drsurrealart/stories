import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Info, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-muted-foreground text-lg">
              We're here to help you make the most of LearnMorals.com
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Contact Support</h2>
              </div>
              <p className="text-muted-foreground">
                Have a specific question? Our support team is ready to help.
              </p>
              <Button asChild className="w-full">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">FAQs</h2>
              </div>
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <h3 className="font-medium">What is LearnMorals.com?</h3>
                  <p className="text-sm text-muted-foreground">
                    LearnMorals.com is a platform that creates personalized stories with meaningful moral lessons for readers of all ages.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium">How do credits work?</h3>
                  <p className="text-sm text-muted-foreground">
                    Credits are used to generate new stories. Each subscription tier comes with a monthly credit allowance.
                  </p>
                </div>
                <div className="pb-3">
                  <h3 className="font-medium">Can I upgrade my subscription?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! You can upgrade your subscription at any time from the My Subscriptions page.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Account & Security</h2>
              </div>
              <p className="text-muted-foreground">
                Manage your account settings and security preferences.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/account-settings">Account Settings</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Getting Started</h2>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  New to LearnMorals.com? Here's how to get started:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Create your first story</li>
                  <li>Explore different moral themes</li>
                  <li>Customize story settings</li>
                  <li>Save and share your stories</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}