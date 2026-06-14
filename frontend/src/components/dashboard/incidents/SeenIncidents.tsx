import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getSeenIncidentsHandler } from '@/requestHandler/incidents/getIncidents/getSeenIncidents.reqhandler';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Button } from '../../ui/button';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import type { BaseEntity } from '@/types/entities';
import { BaseEntityCard } from '../shared/BaseEntityCard';
import { EntityGrid } from '../shared/EntityGrid';
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
    <EntityGrid
      items={incident_card_items}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      loadMoreRef={loadMoreRef}
      renderCard={(item, i) => (
        <BaseEntityCard
          key={`${item.id}-${i}`}
          entity={item as BaseEntity}
          index={i}
          showDefaultDates={false}
          cardExtraContent={
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-foreground/70 p-0 m-0 text-xs font-bold uppercase tracking-wider">
                  Occurred At
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
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
                <div className="flex flex-col sm:flex-row gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
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
          }
          dialogExtraContent={
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                Marked as Seen
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
          }
        />
      )}
    />
  );
};
