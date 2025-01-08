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
}

export const APIConfigManager = () => {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("api_configurations").insert([
        {
          key_name: newKeyName,
          description: newDescription || null,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-configs"] });
      setNewKeyName("");
      setNewDescription("");
      toast.success("API configuration added successfully");
    },
    onError: (error) => {
      console.error("Error creating API config:", error);
      toast.error("Failed to add API configuration");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    createMutation.mutate();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Configurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., OPENAI_API_KEY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description of the API key's purpose"
            />
          </div>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full"
          >
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add API Configuration
          </Button>
        </form>

        <div className="space-y-4">
          <h3 className="font-medium">Existing Configurations</h3>
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
                  <div>
                    <p className="font-medium">{config.key_name}</p>
                    {config.description && (
                      <p className="text-sm text-gray-500">
                        {config.description}
                      </p>
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