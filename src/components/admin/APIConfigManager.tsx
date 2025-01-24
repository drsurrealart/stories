import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ConfigItem } from "./api-config/ConfigItem";

interface APIConfig {
  id: string;
  key_name: string;
  description: string | null;
  is_active: boolean;
  kids_story_credits_cost: number | null;
}

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
] as const;

export const APIConfigManager = () => {
  const queryClient = useQueryClient();

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
  React.useEffect(() => {
    if (configs) {
      const existingKeys = configs.map((config) => config.key_name);
      API_KEYS.forEach((apiKey) => {
        if (!existingKeys.includes(apiKey.key)) {
          initializeMutation.mutate(apiKey.key);
        }
      });
    }
  }, [configs]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Configurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {configs?.map((config) => (
              <ConfigItem
                key={config.id}
                config={config}
                onToggle={(id, checked) =>
                  toggleMutation.mutate({ id, is_active: checked })
                }
                onUpdateCreditsCost={(id, cost) =>
                  updateCreditsCost.mutate({ id, cost })
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};