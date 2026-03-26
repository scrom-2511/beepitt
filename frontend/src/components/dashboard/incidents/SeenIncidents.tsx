import { getSeenIncidentsHandler } from '@/requestHandler/incidents/getIncidents/getSeenIncidents.reqhandler';
import { converUtcToLocaleDate, converUtcToLocalTime } from '@/utils/UtcToLocale';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import LoadMoreDiv from '../LoadMoreDiv';

export const SeenIncidents = () => {
  return (
    <>
      <FilterSection showEnvironment={true} showGroup={true} showPriority={false} />
      <IncidentCardsSection />
    </>
  );
};

const IncidentCardsSection = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['seenIncidents'],
      queryFn: ({ pageParam }) => getSeenIncidentsHandler(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage]);

  const incident_card_items = data?.pages.flatMap((page) => page.incidents) ?? [];

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
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
      <AnimatePresence mode="popLayout">
        {incident_card_items?.map((item, i) => (
          <CardAnimation i={i} key={item.id}>
            <Card className="bg-card p-5 sm:p-10">
              <CardHeaderComp title={item.incidentName} desc={item.incidentDesc} />
              <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
                <Button variant={'outline'} className="flex-1">
                  {converUtcToLocaleDate(item.incidentDateAndTime, localStorage.getItem('timeZone')!)}
                </Button>
                <Button variant={'outline'} className="flex-1">
                  {converUtcToLocalTime(item.incidentDateAndTime, localStorage.getItem('timeZone')!)}
                </Button>
              </CardContent>
            </Card>
          </CardAnimation>
        ))}
        <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
      </AnimatePresence>
    </section>
  );
};
