import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MembershipCardProps {
  currentTierName?: string;
  showUpgradeButton: boolean;
}

export const MembershipCard = ({ currentTierName, showUpgradeButton }: MembershipCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 bg-white">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Current Membership</h2>
            <p className="text-muted-foreground capitalize">{currentTierName || 'Free'}</p>
          </div>
        </div>
        {showUpgradeButton && (
          <Button 
            onClick={() => navigate('/my-subscriptions')}
            className="w-full bg-primary hover:bg-primary-hover text-white"
          >
            Upgrade Now
          </Button>
        )}
      </div>
    </Card>
  );
};