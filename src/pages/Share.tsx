import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { ShareWithFriends } from "@/components/sharing/ShareWithFriends";
import { Share2, Users, Gift, Mail } from "lucide-react";

const Share = () => {
  const handleLogout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Share the Joy of Moral Stories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us spread the magic of storytelling and moral education. Share LearnMorals.com with your friends and family.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 space-y-4">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Build Community</h3>
            <p className="text-muted-foreground">
              Connect with other parents and educators who value moral education through storytelling.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Special Rewards</h3>
            <p className="text-muted-foreground">
              Earn bonus credits when your friends join and create their first story.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
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
        <Card className="p-6">
          <ShareWithFriends />
        </Card>

        {/* Additional Info */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Why Share LearnMorals.com?</h2>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              LearnMorals.com is more than just a storytelling platform - it's a community of parents, 
              educators, and caregivers committed to teaching valuable life lessons through engaging stories.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Personalized moral stories for different age groups</li>
              <li>Interactive learning experiences</li>
              <li>Growing library of educational content</li>
              <li>Safe and nurturing environment for children</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Share;
