import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, History, Plus, Settings, CreditCard } from "lucide-react";
import { StoryStats } from "@/components/dashboard/StoryStats";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { Loading } from "@/components/ui/loading";

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

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      // Get subscription tier limits
      const { data: tierLimits } = await supabase
        .from('subscription_tiers')
        .select('monthly_credits')
        .eq('level', profile?.subscription_level || 'free')
        .single();

      // Get current month's credit usage
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

  if (profileLoading || creditsLoading) {
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

        {/* Age Groups Section */}
        <div className="mt-12">
          <AgeGroupsSection />
        </div>
      </div>
    </div>
  );
};

export default Index;