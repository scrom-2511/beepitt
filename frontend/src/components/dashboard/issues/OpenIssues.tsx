import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getOpenIssuesHandler, type Issue } from '@/requestHandler/issues/getIssues/getOpenIssues.reqhandler';
import { updateIssuePriorityHandler } from '@/requestHandler/issues/updateIssues/updateIssuePriority.reqhandler';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComp from '../../ButtonComp';
import { Button } from '../../ui/button';
import { Separator } from '@/components/ui/separator';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import type { BaseEntity } from '@/types/entities';
import { BaseEntityCard } from '../shared/BaseEntityCard';
import { EntityGrid } from '../shared/EntityGrid';
import { Environment, IssuePriority } from '@/types/enums';

export const OpenIssues = () => {
  const [priority, setPriority] = useState<IssuePriority | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [group, setGroup] = useState<string | null>(null);

  return (
    <>
      <FilterSection
        showEnvironment={true}
        showGroup={true}
        showPriority={true}
        priority={priority}
        setPriority={setPriority}
        environment={environment}
        setEnvironment={setEnvironment}
        group={group}
        setGroup={setGroup}
      />
      <IssueCardsSection priority={priority} environment={environment} group={group} />
    </>
  );
};

const IssueCardsSection = ({
  priority,
  environment,
  group,
}: {
  priority: IssuePriority | null;
  environment: Environment | null;
  group: string | null;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['openIssues', priority, environment, group],
      queryFn: ({ pageParam }) => getOpenIssuesHandler(pageParam, priority, environment, group),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const issue_card_items = data?.pages.flatMap((page) => page.issues) ?? [];

  const { mutate: updateIssuePriority } = useMutation({
    mutationFn: updateIssuePriorityHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueriesData({ queryKey: ['openIssues'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            issues: page.issues.filter((issue: Issue) => issue.id !== variables.issueId),
          })),
        };
      });
    },
  });

  const onClickToUpdatePriority = (issueId: number) => {
    updateIssuePriority({ issuePriority: 'closed', issueId });
  };

  if (isError || isLoading || isPending || issue_card_items?.length === 0) {
    return (
      <Fallback
        data={issue_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        isPending={isPending}
        refetch={refetch}
        emptyTitle="Open Issues"
        loadingTitle="open issues"
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
          footer={
            <>
              <div className="flex flex-row items-center" onClick={(e) => e.stopPropagation()}>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0px 2px rgba(255, 0, 0, 0.2)',
                      '0 0px 8px rgba(255, 0, 0, 0.6)',
                      '0 0px 2px rgba(255, 0, 0, 0.2)',
                    ],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className={`h-2.5 w-2.5 mr-3 rounded-full ${item.priority === 'critical'
                    ? 'bg-red-600'
                    : item.priority === 'high'
                      ? 'bg-red-500'
                      : 'bg-yellow-600'
                    }`}
                ></motion.div>
                <span className="capitalize font-semibold text-foreground">{item.priority}</span>
              </div>
              <ButtonComp
                className="h-10 w-full font-semibold cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickToUpdatePriority(item.id);
                }}
              >
                Mark As Fixed
              </ButtonComp>
            </>
          }
          dialogExtraContent={
            <>
              <Separator />
              <section className="p-5 rounded-xl ">
                <div className="flex items-center justify-center">
                  <Button
                    className="h-12 px-8 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm w-full"
                    onClick={() => {
                      navigate(`ai-chat/${item.id}`, { state: { issue: item } });
                    }}
                  >
                    Find solution with AI
                  </Button>
                </div>
              </section>
            </>
          }
        />
      )}
    />
  );
};
