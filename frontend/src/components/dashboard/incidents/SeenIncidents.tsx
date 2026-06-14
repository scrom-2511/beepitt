import { Badge } from '@/components/ui/badge';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getSeenIncidentsHandler } from '@/requestHandler/incidents/getIncidents/getSeenIncidents.reqhandler';
import { type Incident } from '@/requestHandler/incidents/getIncidents/getUnseenIncidents.reqhandler';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Calendar, Hash, Terminal } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import LoadMoreDiv from '../LoadMoreDiv';
import { Environment, IssuePriority } from '@/types/enums';

export const SeenIncidents = () => {
  const [priority, setPriority] = useState<IssuePriority | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [group, setGroup] = useState<string | null>(null);

  return (
    <>
      <FilterSection
        showEnvironment={true}
        showGroup={true}
        showPriority={false}
        priority={priority}
        setPriority={setPriority}
        environment={environment}
        setEnvironment={setEnvironment}
        group={group}
        setGroup={setGroup}
      />
      <IncidentCardsSection environment={environment} group={group} />
    </>
  );
};

const IncidentCardsSection = ({
  environment,
  group,
}: {
  environment: Environment | null;
  group: string | null;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['seenIncidents', environment, group],
      queryFn: ({ pageParam }) => getSeenIncidentsHandler(pageParam, environment, group),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const incident_card_items = data?.pages.flatMap((page) => page.incidents) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  if (isError || isLoading || isPending || incident_card_items?.length === 0) {
    return (
      <Fallback
        data={incident_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        isPending={isPending}
        refetch={refetch}
        emptyTitle="Seen Incidents"
        loadingTitle="seen incidents"
        addNew={false}
      />
    );
  }

  return (
    <AnimatePresence>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
        {incident_card_items?.map((item, i) => (
          <IncidentCard
            key={`${item.id}-${i}`}
            item={item}
            i={i}
          />
        ))}
      </section>
      <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
    </AnimatePresence>
  );
};

const IncidentCard = ({
  item,
  i,
}: {
  item: Incident;
  i: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardAnimation i={i}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card className="bg-card p-5 sm:p-10 flex flex-col h-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="capitalize font-semibold text-md ">{item.projectName}</div>
              <div className="flex gap-2">
                <Badge className="capitalize rounded-[8px] font-semibold">{item.environment}</Badge>
                {item.group && <Badge variant="secondary">{item.group}</Badge>}
              </div>
            </div>

            <CardHeaderComp title={item.name} desc={item.description} />

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-foreground/70 p-0 m-0 text-xs font-bold uppercase tracking-wider">
                  Occurred At
                </p>
                <div className="flex gap-2 mt-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Button>
                  <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-foreground/70 p-0 m-0 text-xs font-bold uppercase tracking-wider">
                  Marked as seen
                </p>
                <div className="flex gap-2 mt-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    {item.seenAt ? new Date(item.seenAt).toLocaleDateString() : 'N/A'}
                  </Button>
                  <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    {item.seenAt
                      ? new Date(item.seenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'N/A'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden shadow-2xl rounded-xl border-none">
          <div className="bg-primary/5 p-6 border-b">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight text-foreground">{item.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="outline" className="capitalize">
                {item.environment}
              </Badge>
              {item.group && <Badge variant="secondary">{item.group}</Badge>}
            </div>
          </div>
          <ScrollArea className="max-h-[70vh]">
            <div className="p-4 sm:p-6 space-y-6">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Project Name</h4>
                <p className="text-base leading-relaxed text-foreground/90">
                  {item.projectName}
                </p>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                <p className="text-base leading-relaxed text-foreground/90">
                  {item.description || 'No description provided for this incident.'}
                </p>
              </section>

              {item.filePath && (
                <section>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Terminal size={14} /> Source Location
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm border border-border/50 group relative">
                    <div className="break-all leading-normal text-foreground">
                      <span className="text-muted-foreground mr-1">Path:</span>
                      {item.filePath}
                      {item.lineNumber && (
                        <span className="text-primary font-bold ml-1">
                          :{item.lineNumber}
                          {item.columnNumber && `:${item.columnNumber}`}
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                    <Hash size={14} /> Total Events
                  </div>
                  <div className="text-xl font-bold text-foreground">{item.occurrences}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                    <Calendar size={14} /> First Occurrence
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                  <Calendar size={14} /> Marked as Seen
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {item.seenAt
                    ? new Date(item.seenAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                    : 'N/A'}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CardAnimation>
  );
};


