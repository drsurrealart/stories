
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeatureSettings } from "./FeatureSettings";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FeatureManager = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['feature-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_settings')
        .select('*')
        .order('feature_type', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Feature Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <FeatureSettings settings={settings || []} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
