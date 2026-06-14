import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  getUnseenIncidentsHandler,
  type Incident,
} from '@/requestHandler/incidents/getIncidents/getUnseenIncidents.reqhandler';
import { updateIncidentSeenHandler } from '@/requestHandler/incidents/updateIncidents/updateIncidentSeen.reqhandler';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import ButtonComp from '../../ButtonComp';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import type { BaseEntity } from '@/types/entities';
import { BaseEntityCard } from '../shared/BaseEntityCard';
import { EntityGrid } from '../shared/EntityGrid';
import { Environment, IssuePriority } from '@/types/enums';

export const UnseenIncidents = () => {
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
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['unseenIncidents', environment, group],
      queryFn: ({ pageParam }) => getUnseenIncidentsHandler(pageParam, environment, group),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const incident_card_items = data?.pages.flatMap((page) => page.incidents) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const { mutate: updateIncidentSeen } = useMutation({
    mutationFn: updateIncidentSeenHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueriesData({ queryKey: ['unseenIncidents'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            incidents: page.incidents.filter((incident: Incident) => incident.id !== variables.incidentId),
          })),
        };
      });
      toast.success('Updated Successfully.');
    },
    onError: () => { },
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
          footer={
            <ButtonComp
              className="h-10 w-full font-semibold cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSubmit(item.id);
              }}
            >
              Set as seen
            </ButtonComp>
          }
        />
      )}
    />
  );
};
