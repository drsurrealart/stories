import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Info, HelpCircle, BookOpen, CreditCard, Wand2, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="getting-started">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Getting Started
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">What is LearnMorals.com?</h4>
                    <p className="text-muted-foreground">
                      LearnMorals.com is a platform that creates personalized stories with meaningful moral lessons. Our AI-powered system generates unique stories tailored to different age groups, reading levels, and moral themes.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">How do I create my first story?</h4>
                    <p className="text-muted-foreground">
                      To create your first story:
                      <ol className="list-decimal ml-5 mt-2 space-y-2">
                        <li>Click on "Create Story" in the navigation bar</li>
                        <li>Choose your preferred age group and moral theme</li>
                        <li>Customize additional settings like length and tone</li>
                        <li>Click "Generate Story" to create your personalized story</li>
                      </ol>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="subscriptions">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Subscriptions & Credits
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">How do credits work?</h4>
                    <p className="text-muted-foreground">
                      Credits are used to generate new stories. Each subscription tier comes with a monthly credit allowance. One credit equals one story generation. Unused credits don't roll over to the next month.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Can I upgrade my subscription?</h4>
                    <p className="text-muted-foreground">
                      Yes! You can upgrade your subscription at any time from the My Subscriptions page. When you upgrade, you'll immediately receive the new tier's benefits, including additional monthly credits.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">What happens to my stories if I downgrade?</h4>
                    <p className="text-muted-foreground">
                      All stories you've already generated remain accessible even if you downgrade your subscription. However, you'll be limited to the new tier's monthly credit allowance for creating new stories.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="story-creation">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Story Creation
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">What age groups are supported?</h4>
                    <p className="text-muted-foreground">
                      We support multiple age groups: Early Readers (3-6), Young Readers (7-9), Pre-teens (10-12), and Teens (13+). Each age group receives appropriately tailored content and complexity.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Can I customize story settings?</h4>
                    <p className="text-muted-foreground">
                      Yes! You can customize various aspects of your story:
                      <ul className="list-disc ml-5 mt-2 space-y-2">
                        <li>Story length (short, medium, long)</li>
                        <li>Reading level</li>
                        <li>Language style and tone</li>
                        <li>Genre preferences</li>
                        <li>Specific moral themes</li>
                      </ul>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="account-management">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Management
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">How do I update my account information?</h4>
                    <p className="text-muted-foreground">
                      You can update your account information in the Account Settings page. This includes your name, email preferences, and notification settings.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Can I delete my account?</h4>
                    <p className="text-muted-foreground">
                      Yes, you can delete your account from the Account Settings page. Please note that this action is permanent and will remove all your generated stories and account data.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">How secure is my data?</h4>
                    <p className="text-muted-foreground">
                      We take data security seriously. All your data is encrypted, and we never share your personal information with third parties. You can review our complete privacy policy for more details.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

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
    </div>
  );
}