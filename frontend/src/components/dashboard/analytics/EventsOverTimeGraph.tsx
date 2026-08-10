import { Card, CardContent } from '@/components/ui/card';
import type { ScriptableContext } from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import CardHeaderComp from '../CardHeader';

export const EventsOverTimeGraph = ({ events }: { events: any[] }) => {
  const chartData = useMemo(() => {
    const labels = events.map((e) => {
      const d = new Date(e.date);
      return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    });

    const commonLineOptions = {
      borderWidth: 2,
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.5,
      fill: true,
    };

    return {
      labels,
      datasets: [
        {
          label: 'Incidents',
          data: events.map((e) => e.incidentCount),
          borderColor: '#818cf8',
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(129, 140, 248, 0.4)');
            gradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
            return gradient;
          },
          ...commonLineOptions,
        },
        {
          label: 'Issues',
          data: events.map((e) => e.issueCount),
          borderColor: '#4f46e5',
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
            gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
            return gradient;
          },
          ...commonLineOptions,
        }
      ],
    };
  }, [events]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(25, 25, 28, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: 'rgba(255,255,255,0.4)', maxRotation: 0, font: { family: "'Montserrat', sans-serif", size: 10 } },
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="p-6 border-transparent w-full relative overflow-hidden transition-all duration-300 bg-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-2 relative z-10 text-[rgba(255,255,255,0.9)]">
        <CardHeaderComp title="Daily Velocity" desc="7 Days Incidents & Issues over time" />
      </div>

      <CardContent className="h-[300px] p-0 relative z-10">
        <Line data={chartData} options={options as any} />
      </CardContent>
    </Card>
  );
};
