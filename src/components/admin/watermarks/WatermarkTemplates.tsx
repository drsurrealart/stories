import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const WatermarkTemplates = ({ templates = [] }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTemplate, setNewTemplate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newTemplate.trim()) return;

    try {
      const { error } = await supabase
        .from('watermark_templates')
        .insert([{ content: newTemplate.trim() }]);

      if (error) throw error;

      setNewTemplate("");
      await queryClient.invalidateQueries({ queryKey: ['watermark-templates'] });
      
      toast({
        title: "Success",
        description: "Watermark template added successfully",
      });
    } catch (error) {
      console.error('Error adding template:', error);
      toast({
        title: "Error",
        description: "Failed to add watermark template",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingContent.trim()) return;

    try {
      const { error } = await supabase
        .from('watermark_templates')
        .update({ content: editingContent.trim() })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ['watermark-templates'] });
      
      toast({
        title: "Success",
        description: "Watermark template updated successfully",
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update watermark template",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      const { error } = await supabase
        .from('watermark_templates')
        .delete()
        .eq('id', templateToDelete);

      if (error) throw error;

      setShowDeleteDialog(false);
      setTemplateToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['watermark-templates'] });
      
      toast({
        title: "Success",
        description: "Watermark template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete watermark template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Enter new watermark template..."
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={!newTemplate.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            {editingId === template.id ? (
              <div className="flex-1 flex gap-4">
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleEdit(template.id)}
                  disabled={!editingContent.trim()}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1">{template.content}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(template.id);
                      setEditingContent(template.content);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => {
                      setTemplateToDelete(template.id);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Watermark Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this watermark template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};