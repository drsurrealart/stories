import { NavigationBar } from "@/components/NavigationBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoryStats } from "@/components/dashboard/StoryStats";
import { Loading } from "@/components/ui/loading";
import { ShareWithFriends } from "@/components/sharing/ShareWithFriends";
import { StoryMorals } from "@/components/dashboard/StoryMorals";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { MembershipCard } from "@/components/dashboard/MembershipCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CreditsStatus } from "@/components/dashboard/CreditsStatus";
import { RecentStories } from "@/components/dashboard/RecentStories";
import { Card } from "@/components/ui/card";

const Index = () => {
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
        <WelcomeCard firstName={profile?.first_name} />
        <StoryStats />
        <MembershipCard 
          currentTierName={currentTier?.name} 
          showUpgradeButton={profile?.subscription_level !== highestTier?.level}
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <QuickActions />
          <CreditsStatus 
            usedCredits={credits?.used}
            totalCredits={credits?.total}
          />
          <RecentStories stories={recentStories} isLoading={storiesLoading} />
        </div>

        <StoryMorals />

        <Card className="p-6">
          <ShareWithFriends />
        </Card>
      </div>
    </div>
  );
};

export default Index;