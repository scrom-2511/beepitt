import { Card, CardContent } from '@/components/ui/card';
import { getAnalyticsDataHandler } from '@/requestHandler/analytics/getAnalyticsDataHandler';
import { useQuery } from '@tanstack/react-query';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useMemo } from 'react';

import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import { EventsOverTimeGraph } from './EventsOverTimeGraph';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);

interface DailyEvent {
  date: string;
  incidentCount: number;
  issueCount: number;
}

const AnalyticsSection = () => {
  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: getAnalyticsDataHandler,
  });

  const trendEvents: DailyEvent[] = useMemo(() => {
    const eventMap = new Map<string, { incidentCount: number; issueCount: number }>();
    if (analyticsData?.trends?.last7Days) {
      analyticsData.trends.last7Days.forEach((item: any) => {
        const dStr = new Date(item.date).toISOString().split('T')[0];
        eventMap.set(dStr, {
          incidentCount: item.incidentCount || 0,
          issueCount: item.issueCount || 0,
        });
      });
    }

    const days: DailyEvent[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const existing = eventMap.get(dStr);
      days.push({
        date: dStr,
        incidentCount: existing ? existing.incidentCount : 0,
        issueCount: existing ? existing.issueCount : 0,
      });
    }

    return days;
  }, [analyticsData?.trends?.last7Days]);

  if (isLoading || isError || analyticsData === undefined) {
    return (
      <Fallback
        data={undefined}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        emptyTitle="Analytics Data"
        addNew={false}
        loadingTitle="analytics"
      />
    );
  }

  const { tier, used, limit, incidents, issues, topProject } = analyticsData;

  const hasRecentEvents = trendEvents.some(event => event.incidentCount > 0 || event.issueCount > 0);

  console.log(analyticsData);

  return (
    <div className="h-[calc(100vh-135px)] w-full overflow-y-auto scrollbar-hide">
      <section className="font-montserrat p-5 flex flex-col gap-5 min-h-max">
        {/* ROW 1: General Stats */}
        <Card className="bg-card p-6 h-full flex flex-col justify-between">
          <CardHeaderComp title="Events Used" desc="Events used this month" />
          <CardContent className="p-0 mt-6">
            <div className="w-full bg-background h-3 rounded-full overflow-hidden border border-border/50">
              <div
                className="bg-primary h-full transition-all duration-1000"
                style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground mt-2 text-right">{used.toLocaleString()} Used</p>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {((used / limit) * 100).toFixed(2)}% of limit
              </p>
            </div>
          </CardContent>
        </Card>
        {/* ROW 3: Graphical Data */}
        {tier === 'pro' && hasRecentEvents && <EventsOverTimeGraph events={trendEvents} />}
        <div className="flex flex-col md:flex-row gap-5 w-full">
          {tier !== 'free' && (
            <>
              <Card className="bg-card p-6 h-full flex flex-col justify-between flex-1 w-full">
                <CardHeaderComp title="Incidents" desc="Incidents this month" />
                <CardContent className="p-0 mt-6">
                  <h3 className="text-4xl font-bold text-primary">{incidents.toLocaleString()}</h3>
                </CardContent>
              </Card>

              <Card className="bg-card p-6 h-full flex flex-col justify-between flex-1 w-full">
                <CardHeaderComp title="Issues" desc="Issues this month" />
                <CardContent className="p-0 mt-6">
                  <h3 className="text-4xl font-bold text-primary">{issues.toLocaleString()}</h3>
                </CardContent>
              </Card>
            </>
          )}

          {tier === 'pro' && analyticsData.avgResolutionTimeMinutes !== undefined && (
            <Card className="bg-card p-6 h-full flex flex-col justify-between flex-1 w-full">
              <CardHeaderComp title="Resolution Time" desc="Average resolution" />
              <CardContent className="p-0 mt-6">
                <h3 className="text-4xl font-bold text-primary">{analyticsData.avgResolutionTimeMinutes}m</h3>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ROW 2: Distributions and Projects */}
        {tier !== 'free' && (
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <Card className="bg-card p-6 h-full flex flex-col overflow-hidden flex-1 w-full">
              <CardHeaderComp title="Top Affected Projects" desc="Projects with the highest event rates" />
              <CardContent className="p-0 mt-6 space-y-4">
                <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Most Incidents
                  </p>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-md font-medium text-foreground truncate">
                      {topProject.topIncidentProject || 'N/A'}
                    </span>
                    <span className="text-2xl font-bold text-(--color-chart-1) shrink-0">
                      {topProject.topIncidentCount}
                    </span>
                  </div>
                </div>
                <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Most Issues
                  </p>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-md font-medium text-foreground truncate">
                      {topProject.topIssuesProject || 'N/A'}
                    </span>
                    <span className="text-2xl font-bold text-primary shrink-0">{topProject.topIssuesCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {tier === 'pro' && analyticsData.mostFrequentEvent && (
              <Card className="bg-card p-6 h-full flex flex-col overflow-hidden flex-1 w-full">
                <CardHeaderComp title="Highest Recurrence" desc="Most frequent unique event" />
                <CardContent className="p-0 mt-6 flex-1 flex flex-col justify-center min-w-0">
                  <p className="text-sm font-semibold text-muted-foreground bg-secondary/30 inline-flex px-2 py-0.5 rounded uppercase tracking-wider mb-2 w-fit max-w-full border border-border/40 truncate">
                    {analyticsData.mostFrequentEvent.type} - {analyticsData.mostFrequentEvent.projectName}
                  </p>
                  <p className="text-xl font-bold text-foreground line-clamp-3 break-words">
                    {analyticsData.mostFrequentEvent.name}
                  </p>
                  <div className="mt-6 border-t border-border/50 pt-4 flex justify-between items-center gap-2">
                    <span className="text-muted-foreground truncate">Lifetime Occurrences</span>
                    <span className="text-2xl font-bold text-destructive shrink-0">
                      {analyticsData.mostFrequentEvent.occurrences}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AnalyticsSection;
