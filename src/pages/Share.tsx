import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { ShareWithFriends } from "@/components/sharing/ShareWithFriends";
import { Share2, Users, Gift, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Share = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleLogout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut();
    }
  };

  const promotionalContent = {
    shortDescription: "Create personalized moral stories for children with AI at LearnMorals.com! 📚✨",
    longDescription: `Discover LearnMorals.com - an innovative platform using AI to create personalized moral stories for children. Customize stories by age, theme, and learning goals. Join our community of parents and educators making learning values fun! 🌟`,
    hashtags: "#Education #KidsLearning #MoralStories #ParentingTips #EdTech",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the text anywhere.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5DEFF] to-background">
      <NavigationBar onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-[#D946EF] text-transparent bg-clip-text">
            Share the Joy of Moral Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us spread the magic of storytelling and moral education. Share LearnMorals.com with your friends and family.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 space-y-4 bg-gradient-to-br from-[#FDE1D3] to-white">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Build Community</h3>
            <p className="text-muted-foreground">
              Connect with other parents and educators who value moral education through storytelling.
            </p>
          </Card>

          <Card className="p-6 space-y-4 bg-gradient-to-br from-[#D3E4FD] to-white">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Special Rewards</h3>
            <p className="text-muted-foreground">
              Earn bonus credits when your friends join and create their first story.
            </p>
          </Card>

          <Card className="p-6 space-y-4 bg-gradient-to-br from-[#FFDEE2] to-white">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Stay Connected</h3>
            <p className="text-muted-foreground">
              Get updates on new features and be part of our growing storytelling community.
            </p>
          </Card>
        </div>

        {/* Share Tools Section */}
        <Card className="p-6 bg-gradient-to-r from-secondary to-white">
          <ShareWithFriends />
        </Card>

        {/* Promotional Content Section */}
        <Card className="p-6 space-y-6 bg-gradient-to-br from-[#E5DEFF] to-white">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Promotional Content</h2>
          </div>
          
          <div className="space-y-6">
            {/* Short Description */}
            <div className="space-y-2">
              <h3 className="font-medium">Short Description</h3>
              <div className="relative">
                <Card className="p-4 bg-story-background">
                  <p className="text-story-text">{promotionalContent.shortDescription}</p>
                </Card>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(promotionalContent.shortDescription)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <h3 className="font-medium">Long Description</h3>
              <div className="relative">
                <Card className="p-4 bg-story-background">
                  <p className="text-story-text">{promotionalContent.longDescription}</p>
                </Card>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(promotionalContent.longDescription)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <h3 className="font-medium">Hashtags</h3>
              <div className="relative">
                <Card className="p-4 bg-story-background">
                  <p className="text-story-text">{promotionalContent.hashtags}</p>
                </Card>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(promotionalContent.hashtags)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Share;