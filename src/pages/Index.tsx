import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, History, Plus, Settings, CreditCard, Crown } from "lucide-react";
import { StoryStats } from "@/components/dashboard/StoryStats";
import { Loading } from "@/components/ui/loading";
import { ShareWithFriends } from "@/components/sharing/ShareWithFriends";
import { StoryMorals } from "@/components/dashboard/StoryMorals";

const Index = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  const { data: currentTier, isLoading: tierLoading } = useQuery({
    queryKey: ['current-tier', profile?.subscription_level],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('level', profile?.subscription_level)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.subscription_level,
  });

  const { data: highestTier } = useQuery({
    queryKey: ['highest-tier'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('level')
        .order('price', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data: tierLimits } = await supabase
        .from('subscription_tiers')
        .select('monthly_credits')
        .eq('level', profile?.subscription_level || 'free')
        .single();

      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: creditCount } = await supabase
        .from('user_story_counts')
        .select('credits_used')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .single();

      return {
        used: creditCount?.credits_used || 0,
        total: tierLimits?.monthly_credits || 0
      };
    },
    enabled: !!profile
  });

  const { data: recentStories, isLoading: storiesLoading } = useQuery({
    queryKey: ['recent-stories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (profileLoading || creditsLoading || tierLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Membership Status */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Current Membership</h2>
                <p className="text-muted-foreground capitalize">{currentTier?.name || 'Free'}</p>
              </div>
            </div>
            {profile?.subscription_level !== highestTier?.level && (
              <Button 
                onClick={() => navigate('/my-subscriptions')}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </Card>

        {/* Story Stats */}
        <StoryStats />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate('/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Story
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/your-stories')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View All Stories
              </Button>
            </div>
          </Card>

          {/* AI Credits Status */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              AI Credits
            </h2>
            <div className="space-y-3">
              <div className="text-2xl font-bold">
                {credits ? `${credits.total - credits.used} / ${credits.total}` : '0 / 0'}
              </div>
              <p className="text-sm text-muted-foreground">Credits remaining this month</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/my-subscriptions')}
              >
                Get More Credits
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Stories
            </h2>
            <div className="space-y-3">
              {recentStories && recentStories.length > 0 ? (
                recentStories.map((story) => (
                  <div 
                    key={story.id} 
                    className="p-3 bg-story-background rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => navigate('/your-stories')}
                  >
                    <p className="font-medium text-story-text truncate">
                      {story.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No stories created yet. Start creating!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Story Morals Section */}
        <StoryMorals />

        {/* Share with Friends & Family Section */}
        <Card className="p-6">
          <ShareWithFriends />
        </Card>
      </div>
    </div>
  );
};

export default Index;