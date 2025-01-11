import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Plus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};