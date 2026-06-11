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
import { Doughnut } from 'react-chartjs-2';

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
  const USE_MOCK_DATA = false;

  const mockData: any = {
    tier: 'pro',
    used: 7500,
    limit: 10000,
    incidents: 412,
    issues: 289,
    topProject: {
      topIncidentProject: 'payment-service',
      topIncidentCount: 184,
      topIssuesProject: 'user-auth',
      topIssuesCount: 112,
    },
    trends: {
      last30Days: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          incidentCount: Math.floor(Math.random() * 80) + 30,
          issueCount: Math.floor(Math.random() * 40) + 10,
        };
      }),
    },
    mostFrequentEvent: {
      name: 'ConnectionTimeoutException',
      type: 'issue',
      occurrences: 512,
      projectName: 'payment-service',
    },
    avgResolutionTimeMinutes: 48,
  };

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

  const dataToUse = USE_MOCK_DATA ? mockData : analyticsData;

  const trendEvents: DailyEvent[] = useMemo(() => {
    if (!dataToUse?.trends?.last30Days) return [];
    return dataToUse.trends.last30Days.map((item: any) => ({
      date: item.date,
      incidentCount: item.incidentCount || 0,
      issueCount: item.issueCount || 0,
    }));
  }, [dataToUse?.trends?.last30Days]);

  if (!USE_MOCK_DATA && (isLoading || isError || analyticsData === undefined)) {
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

  const { tier, used, limit, incidents, issues, topProject } = dataToUse;

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
                {((used / limit) * 100).toFixed(1)}% of limit
              </p>
            </div>
          </CardContent>
        </Card>
        {/* ROW 3: Graphical Data */}
        {tier === 'pro' && trendEvents.length > 0 && <EventsOverTimeGraph events={trendEvents} />}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5">
          {tier !== 'free' && (
            <>
              <Card className="bg-card p-6 h-full flex flex-col justify-between">
                <CardHeaderComp title="Incidents" desc="Incidents this month" />
                <CardContent className="p-0 mt-6">
                  <h3 className="text-4xl font-bold text-primary">{incidents.toLocaleString()}</h3>
                </CardContent>
              </Card>

              <Card className="bg-card p-6 h-full flex flex-col justify-between">
                <CardHeaderComp title="Issues" desc="Issues this month" />
                <CardContent className="p-0 mt-6">
                  <h3 className="text-4xl font-bold text-primary">{issues.toLocaleString()}</h3>
                </CardContent>
              </Card>
            </>
          )}

          {tier === 'pro' && dataToUse.avgResolutionTimeMinutes !== undefined && (
            <Card className="bg-card p-6 h-full flex flex-col justify-between">
              <CardHeaderComp title="Resolution Time" desc="Average resolution" />
              <CardContent className="p-0 mt-6">
                <h3 className="text-4xl font-bold text-primary">{dataToUse.avgResolutionTimeMinutes}m</h3>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ROW 2: Distributions and Projects */}
        {tier !== 'free' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="bg-card p-6 h-full flex flex-col">
              <CardHeaderComp title="Event Distribution" desc="Total Issues vs Incidents" />
              <CardContent className="p-0 flex-1 flex flex-col items-center justify-center mt-6">
                <div className="w-40 h-40 relative">
                  <Doughnut
                    key={Math.random()}
                    data={{
                      labels: ['Incidents', 'Issues'],
                      datasets: [
                        {
                          data: [incidents, issues],
                          backgroundColor: ['#818cf8', '#6366f1'],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-foreground">{incidents + issues}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card p-6 h-full flex flex-col overflow-hidden">
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
                    <span className="text-2xl font-bold text-[var(--color-chart-1)] shrink-0">
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

            {tier === 'pro' && dataToUse.mostFrequentEvent && (
              <Card className="bg-card p-6 h-full flex flex-col overflow-hidden">
                <CardHeaderComp title="Highest Recurrence" desc="Most frequent unique event" />
                <CardContent className="p-0 mt-6 flex-1 flex flex-col justify-center min-w-0">
                  <p className="text-sm font-semibold text-muted-foreground bg-secondary/30 inline-flex px-2 py-0.5 rounded uppercase tracking-wider mb-2 w-fit max-w-full border border-border/40 truncate">
                    {dataToUse.mostFrequentEvent.type} - {dataToUse.mostFrequentEvent.projectName}
                  </p>
                  <p className="text-xl font-bold text-foreground line-clamp-3 break-words">
                    {dataToUse.mostFrequentEvent.name}
                  </p>
                  <div className="mt-6 border-t border-border/50 pt-4 flex justify-between items-center gap-2">
                    <span className="text-muted-foreground truncate">Lifetime Occurrences</span>
                    <span className="text-2xl font-bold text-destructive shrink-0">
                      {dataToUse.mostFrequentEvent.occurrences}
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
