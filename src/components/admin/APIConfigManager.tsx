import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  // Initialize API keys if they don't exist
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

  // Initialize missing API keys
  const initializeMissingKeys = () => {
    const existingKeys = configs?.map((config) => config.key_name) || [];
    API_KEYS.forEach((apiKey) => {
      if (!existingKeys.includes(apiKey.key)) {
        initializeMutation.mutate(apiKey.key);
      }
    });
  };

  // Call initialization on component mount
  useState(() => {
    if (configs) {
      initializeMissingKeys();
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Configurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {configs?.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-grow">
                    <p className="font-medium">{config.key_name}</p>
                    {config.description && (
                      <p className="text-sm text-gray-500">
                        {config.description}
                      </p>
                    )}
                    {config.key_name === "AUDIO_STORY_CREDITS" && (
                      <div className="mt-2">
                        <Label htmlFor="kidsCreditsCost">Kids Story Credits Cost</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="kidsCreditsCost"
                            type="number"
                            min="0"
                            value={config.kids_story_credits_cost || 0}
                            onChange={(e) =>
                              updateCreditsCost.mutate({
                                id: config.id,
                                cost: parseInt(e.target.value),
                              })
                            }
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">credits</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.is_active}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({
                          id: config.id,
                          is_active: checked,
                        })
                      }
                    />
                    <span className="text-sm">
                      {config.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};