import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreditsStatusProps {
  usedCredits?: number;
  totalCredits?: number;
}

export const CreditsStatus = ({ usedCredits = 0, totalCredits = 0 }: CreditsStatusProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        AI Credits
      </h2>
      <div className="space-y-3">
        <div className="text-2xl font-bold">
          {totalCredits - usedCredits} / {totalCredits}
        </div>
        <p className="text-sm text-muted-foreground">Credits remaining this month</p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/my-subscriptions')}
        >
          Get More Credits
        </Button>
      </div>
    </Card>
  );
};