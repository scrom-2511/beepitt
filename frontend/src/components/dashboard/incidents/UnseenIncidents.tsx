import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  getUnseenIncidentsHandler,
  type Incident,
} from '@/requestHandler/incidents/getIncidents/getUnseenIncidents.reqhandler';
import { updateIncidentSeenHandler } from '@/requestHandler/incidents/updateIncidents/updateIncidentSeen.reqhandler';
import { converUtcToLocaleDate, converUtcToLocalTime } from '@/utils/UtcToLocale';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { toast } from 'sonner';
import ButtonComp from '../../ButtonComp';
import { Button } from '../../ui/button';
import { Card, CardContent, CardFooter } from '../../ui/card';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import LoadMoreDiv from '../LoadMoreDiv';

export const UnseenIncidents = () => {
  return (
    <>
      <FilterSection showEnvironment={true} showGroup={true} showPriority={false} />
      <IncidentCardsSection />
    </>
  );
};

const IncidentCardsSection = () => {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['unseenIncidents'],
      queryFn: ({ pageParam }) => getUnseenIncidentsHandler(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const incident_card_items = data?.pages.flatMap((page) => page.incidents) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const { mutate: updateIncidentSeen } = useMutation({
    mutationFn: updateIncidentSeenHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['unseenIncidents'], (oldData: Incident[]) => {
        return oldData.filter((incident) => incident.id !== variables.incidentId);
      });
      toast.success('Updated Successfully.');
    },
    onError: () => {},
  });

  const onSubmit = (incidentId: number) => {
    updateIncidentSeen({ incidentId });
  };

  if (isError || isLoading || isPending || incident_card_items?.length === 0) {
    return (
      <Fallback
        data={incident_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        isPending={isPending}
        refetch={refetch}
        emptyTitle="Unseen Incidents"
        loadingTitle="unseen incidents"
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
                <Button variant="outline" className="flex-1">
                  {converUtcToLocaleDate(item.incidentDateAndTime, localStorage.getItem('timeZone')!)}
                </Button>

                <Button variant="outline" className="flex-1">
                  {converUtcToLocalTime(item.incidentDateAndTime, localStorage.getItem('timeZone')!)}
                </Button>
              </CardContent>

              <CardFooter className="p-0 flex flex-col items-start gap-5">
                <ButtonComp className="h-10 w-full font-semibold cursor-pointer" onClick={() => onSubmit(item.id)}>
                  Set as seen
                </ButtonComp>
              </CardFooter>
            </Card>
          </CardAnimation>
        ))}
        <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
      </AnimatePresence>
    </section>
  );
};
