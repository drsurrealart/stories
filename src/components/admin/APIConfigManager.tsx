import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ConfigItem } from "./api-config/ConfigItem";

interface APIConfig {
  id: string;
  key_name: string;
  description: string | null;
  is_active: boolean;
  kids_story_credits_cost: number | null;
  image_generation_provider?: string;
}

type APICategory = {
  label: string;
  keys: readonly string[];
};

const API_CATEGORIES: Record<string, APICategory> = {
  payments: {
    label: "Payments",
    keys: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"],
  },
  textGeneration: {
    label: "Text Generation",
    keys: ["OPENAI_API_KEY"],
  },
  imageGeneration: {
    label: "Image Generation",
    keys: ["RUNWARE_API_KEY"],
  },
  credits: {
    label: "Credits & Usage",
    keys: ["AUDIO_STORY_CREDITS", "IMAGE_STORY_CREDITS", "PDF_STORY_CREDITS"],
  },
} as const;

const API_KEYS = [
  {
    key: "OPENAI_API_KEY",
    description: "API key for OpenAI services",
  },
  {
    key: "STRIPE_SECRET_KEY",
    description: "Secret key for Stripe payment processing",
  },
  {
    key: "STRIPE_PUBLISHABLE_KEY",
    description: "Publishable key for Stripe payment processing",
  },
  {
    key: "RUNWARE_API_KEY",
    description: "API key for Runware.ai image generation service",
  },
] as const;

export const APIConfigManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(Object.keys(API_CATEGORIES)[0]);

  const { data: configs, isLoading } = useQuery({
    queryKey: ["api-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_configurations")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as APIConfig[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("api_configurations")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-configs"] });
      toast.success("API configuration updated successfully");
    },
    onError: (error) => {
      console.error("Error updating API config:", error);
      toast.error("Failed to update API configuration");
    },
  });

  const updateCreditsCost = useMutation({
    mutationFn: async ({ id, cost }: { id: string; cost: number }) => {
      const { error } = await supabase
        .from("api_configurations")
        .update({ kids_story_credits_cost: cost })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-configs"] });
      toast.success("Credits cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating credits cost:", error);
      toast.error("Failed to update credits cost");
    },
  });

  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, provider }: { id: string; provider: string }) => {
      const { error } = await supabase
        .from("api_configurations")
        .update({ image_generation_provider: provider })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-configs"] });
      toast.success("Image generation provider updated successfully");
    },
    onError: (error) => {
      console.error("Error updating provider:", error);
      toast.error("Failed to update image generation provider");
    },
  });

  // Initialize missing API keys
  const initializeMutation = useMutation({
    mutationFn: async (key_name: string) => {
      const { error } = await supabase.from("api_configurations").insert([
        {
          key_name,
          description: API_KEYS.find((k) => k.key === key_name)?.description,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-configs"] });
    },
  });

  // Initialize missing API keys on component mount
  useEffect(() => {
    if (configs) {
      const existingKeys = configs.map((config) => config.key_name);
      API_KEYS.forEach((apiKey) => {
        if (!existingKeys.includes(apiKey.key)) {
          initializeMutation.mutate(apiKey.key);
        }
      });
    }
  }, [configs]);

  const getConfigsForCategory = (categoryKeys: readonly string[]) => {
    return configs?.filter((config) => categoryKeys.includes(config.key_name)) || [];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Configurations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              {Object.entries(API_CATEGORIES).map(([key, { label }]) => (
                <TabsTrigger key={key} value={key} className="text-sm">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(API_CATEGORIES).map(([key, { keys, label }]) => (
              <TabsContent key={key} value={key} className="space-y-4 mt-4">
                <div className="space-y-4">
                  {getConfigsForCategory(keys).map((config) => (
                    <ConfigItem
                      key={config.id}
                      config={config}
                      onToggle={(id, checked) =>
                        toggleMutation.mutate({ id, is_active: checked })
                      }
                      onUpdateCreditsCost={(id, cost) =>
                        updateCreditsCost.mutate({ id, cost })
                      }
                      onUpdateProvider={(id, provider) =>
                        updateProviderMutation.mutate({ id, provider })
                      }
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
