import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, History, Plus, Settings } from "lucide-react";

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

  if (profileLoading || storiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
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

          {/* Subscription Status */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <div className="space-y-2">
              <p className="text-lg font-medium capitalize">
                {profile?.subscription_level || 'Free'} Plan
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/my-subscriptions')}
              >
                Manage Subscription
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
      </div>
    </div>
  );
};

export default Index;