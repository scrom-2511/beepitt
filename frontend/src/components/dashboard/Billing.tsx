import Fallback from '@/components/dashboard/Fallback';
import ButtonComp from '@/components/ButtonComp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBillingDetailsHandler } from '@/requestHandler/billing/getBillingDetails.reqhandler';
import { converUtcToLocaleDate } from '@/utils/UtcToLocale';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TierInfo {
  name: string;
  price: string;
  cycle: string;
  description: string;
}

const tierDetailsMap: Record<string, TierInfo> = {
  free: {
    name: 'Basic Plan',
    price: 'Free',
    cycle: 'Forever',
    description: 'Essential monitoring capabilities for personal projects and small prototypes.',
  },
  starter: {
    name: 'Starter Plan',
    price: '$14.99',
    cycle: '/ month',
    description: 'Advanced monitoring, multi-channel alerts, and analytics for growing teams.',
  },
  pro: {
    name: 'Pro Plan',
    price: '$39.99',
    cycle: '/ month',
    description: 'High-throughput enterprise power suite with full export, retry, and throttling controls.',
  },
};

const Billing = () => {
  const navigate = useNavigate();

  const {
    data: billingDetails,
    isLoading,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetailsHandler,
  });

  if (isError || isLoading || isPending || billingDetails === undefined) {
    return (
      <Fallback
        data={undefined}
        error={error}
        isError={isError}
        isLoading={isLoading}
        isPending={isPending}
        refetch={refetch}
        emptyTitle="Billing Details"
        addNew={false}
        loadingTitle="billing"
      />
    );
  }

  const tierKey = billingDetails?.subscription_tier?.toLowerCase() || 'free';
  const tierInfo = tierDetailsMap[tierKey] || tierDetailsMap.free;

  const timeZone = localStorage.getItem('timeZone') || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const expiryDate = billingDetails?.validTill
    ? converUtcToLocaleDate(billingDetails.validTill, timeZone)
    : 'N/A';

  const calculateDaysLeft = (validTillStr?: string) => {
    if (!validTillStr) return null;
    const expiry = new Date(validTillStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(billingDetails?.validTill);

  return (
    <section className="p-5 lg:p-10 pb-10 flex flex-col gap-6">
      {/* 1st Line: Active Tier Card */}
      <Card className="bg-card p-6 border border-border/50 flex flex-col justify-between shadow-sm">
        <CardHeader className="p-0">
          <CardTitle className="text-3xl font-bold text-foreground font-montserrat">
            {tierInfo.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {tierInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 mt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-extrabold text-primary font-montserrat">{tierInfo.price}</span>
            <span className="text-sm text-muted-foreground font-medium">{tierInfo.cycle}</span>
          </div>
        </CardContent>
      </Card>

      {/* 2nd Line (Next Line): Renewal Details Card */}
      <Card className="bg-card p-6 border border-border/50 flex flex-col justify-between shadow-sm">
        <CardHeader className="p-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Billing & Expiry Details
          </span>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Plan Expiry Date
                </p>
                <p className="text-base font-semibold text-foreground mt-0.5">{expiryDate}</p>
              </div>
            </div>
            {daysLeft !== null && (
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-background/50 rounded-xl border border-border/40">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Billing Frequency</p>
              <p className="text-sm font-semibold text-foreground mt-1">Monthly</p>
            </div>
            <div className="p-3.5 bg-background/50 rounded-xl border border-border/40">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account ID</p>
              <p className="text-sm font-semibold text-foreground mt-1">#{billingDetails?.userId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Billing;
