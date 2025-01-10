interface CreditInfo {
  creditsUsed: number;
  monthlyCredits: number;
}

interface CreditInfoProps {
  userLimits?: CreditInfo;
}

export function CreditInfo({ userLimits }: CreditInfoProps) {
  if (!userLimits) return null;

  return (
    <div className="text-sm text-muted-foreground">
      AI Credits remaining: {userLimits.monthlyCredits - userLimits.creditsUsed} / {userLimits.monthlyCredits}
    </div>
  );
}