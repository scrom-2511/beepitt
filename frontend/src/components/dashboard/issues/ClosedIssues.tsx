import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getClosedIssuesHandler } from '@/requestHandler/issues/getIssues/getClosedIssues.reqhandler';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import ButtonComp from '../../ButtonComp';
import { Button } from '@/components/ui/button';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import type { BaseEntity } from '@/types/entities';
import { BaseEntityCard } from '../shared/BaseEntityCard';
import { EntityGrid } from '../shared/EntityGrid';
import { Environment, IssuePriority } from '@/types/enums';

const ClosedIssues = () => {
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
      <IssueCardsSection environment={environment} group={group} />
    </>
  );
};

export default ClosedIssues;

const IssueCardsSection = ({
  environment,
  group,
}: {
  environment: Environment | null;
  group: string | null;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['closedIssues', environment, group],
      queryFn: ({ pageParam }) => getClosedIssuesHandler(pageParam, environment, group),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const issue_card_items = data?.pages.flatMap((page) => page.issues) ?? [];

  if (isError || isLoading || isPending || issue_card_items?.length === 0) {
    return (
      <Fallback
        data={issue_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        isPending={isPending}
        refetch={refetch}
        emptyTitle="Closed Issues"
        loadingTitle="closed issues"
        addNew={false}
      />
    );
  }

  return (
    <EntityGrid
      items={issue_card_items}
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
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-foreground/70 p-0 m-0 text-xs font-bold uppercase tracking-wider">
                  Fixed At
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    {item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : 'N/A'}
                  </Button>
                  <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    {item.resolvedAt
                      ? new Date(item.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'N/A'}
                  </Button>
                </div>
              </div>
            </div>
          }
          footer={
            <>
              <div className="flex flex-row items-center group">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0px 2px rgba(34, 197, 94, 0.2)',
                      '0 0px 8px rgba(34, 197, 94, 0.6)',
                      '0 0px 2px rgba(34, 197, 94, 0.2)',
                    ],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="h-2.5 w-2.5 mr-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"
                ></motion.div>
                <span className="text-sm tracking-tighter">Fixed</span>
              </div>

              <ButtonComp className="h-10 w-full font-semibold cursor-pointer">
                Mark as not fixed
              </ButtonComp>
            </>
          }
          dialogExtraContent={
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                    <Clock size={14} /> Total Events
                  </div>
                  <div className="text-xl font-bold text-foreground">{item.occurrences}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                    <CheckCircle size={14} /> Resolution Date
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {item.resolvedAt
                      ? new Date(item.resolvedAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </>
          }
        />
      )}
    />
  );
};
