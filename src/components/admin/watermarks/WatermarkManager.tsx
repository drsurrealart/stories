import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WatermarkTemplates } from "./WatermarkTemplates";
import { WatermarkSettings } from "./WatermarkSettings";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const WatermarkManager = () => {
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['watermark-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watermark_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['watermark-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watermark_settings')
        .select('*')
        .order('content_type', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (templatesLoading || settingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Content Settings</TabsTrigger>
          <TabsTrigger value="templates">Watermark Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <WatermarkSettings settings={settings} />
        </TabsContent>
        <TabsContent value="templates">
          <WatermarkTemplates templates={templates} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};