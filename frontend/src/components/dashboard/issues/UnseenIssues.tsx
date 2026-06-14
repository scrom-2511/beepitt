import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getUnseenIssuesHandler, type Issue } from '@/requestHandler/issues/getIssues/getUnseenIssues.reqhandler';
import {
  updateIssuePriorityHandler,
  type UpdateIssuePriorityEnum,
} from '@/requestHandler/issues/updateIssues/updateIssuePriority.reqhandler';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import ButtonComp from '../../ButtonComp';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import type { BaseEntity } from '@/types/entities';
import { BaseEntityCard } from '../shared/BaseEntityCard';
import { EntityGrid } from '../shared/EntityGrid';
import { Environment, IssuePriority } from '@/types/enums';

export const UnseenIssues = () => {
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

const IssueCardsSection = ({
  environment,
  group,
}: {
  environment: Environment | null;
  group: string | null;
}) => {
  const [priorities, setPriorities] = useState<Record<string, UpdateIssuePriorityEnum>>({});
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['unseenIssues', environment, group],
      queryFn: ({ pageParam }) => getUnseenIssuesHandler(pageParam, environment, group),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const issue_card_items = data?.pages.flatMap((page) => page.issues) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const { mutate: updateIssuePriority } = useMutation({
    mutationFn: updateIssuePriorityHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueriesData({ queryKey: ['unseenIssues'] }, (oldData: any) => {
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

  const onSubmitSetPriority = (issueId: number) => {
    const priority = priorities[issueId];
    if (!priority) return;
    updateIssuePriority({ issuePriority: priority, issueId });
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
        emptyTitle="Unseen Issues"
        loadingTitle="unseen issues"
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
              <div className="w-full" onClick={(e) => e.stopPropagation()}>
                <Select
                  value={priorities[item.id]}
                  onValueChange={(value) =>
                    setPriorities((prev) => ({
                      ...prev,
                      [item.id]: value as UpdateIssuePriorityEnum,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ButtonComp
                className="h-10 w-full font-semibold cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmitSetPriority(item.id);
                }}
              >
                Set Priority
              </ButtonComp>
            </>
          }
        />
      )}
    />
  );
};
