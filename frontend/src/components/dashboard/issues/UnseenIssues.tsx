import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getUnseenIssuesHandler, type Issue } from '@/requestHandler/issues/getIssues/getUnseenIssues.reqhandler';
import {
  updateIssuePriorityHandler,
  type UpdateIssuePriorityEnum,
} from '@/requestHandler/issues/updateIssues/updateIssuePriority.reqhandler';
import type { UpdateIssuePriorityType } from '@/types/dataTypes';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import type z from 'zod';
import ButtonComp from '../../ButtonComp';
import { Button } from '../../ui/button';
import { Card, CardContent, CardFooter } from '../../ui/card';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import LoadMoreDiv from '../LoadMoreDiv';

export const UnseenIssues = () => {
  return (
    <>
      <FilterSection showEnvironment={true} showGroup={true} showPriority={false} />
      <IssueCardsSection />
    </>
  );
};

const IssueCardsSection = () => {
  type UpdateIssuePriorityType = z.infer<typeof UpdateIssuePriorityType>;
  const [priorities, setPriorities] = useState<Record<string, UpdateIssuePriorityType['issuePriority']>>({});
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['unseenIssues'],
      queryFn: ({ pageParam }) => getUnseenIssuesHandler(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const issue_card_items = data?.pages.flatMap((page) => page.issues) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const { mutate: updateIssuePriority } = useMutation({
    mutationFn: updateIssuePriorityHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['unseenIssues'], (oldData: any) => {
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

  const onSumitSetPriority = (issueId: number) => {
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
    <AnimatePresence>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
        {issue_card_items?.map((item, i) => (
          <CardAnimation i={i} key={item.id}>
            <Card className="bg-card p-5 sm:p-10">
              <CardHeaderComp title={item.name} desc={item.description} />
              <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
                <Button variant={'outline'} className="flex-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Button>
                <Button variant={'outline'} className="flex-1">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Button>
              </CardContent>
              <CardFooter className="p-0 flex flex-col items-start gap-5">
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

                <ButtonComp
                  className="h-10 w-full font-semibold cursor-pointer"
                  onClick={() => onSumitSetPriority(item.id)}
                >
                  Set Priority
                </ButtonComp>
              </CardFooter>
            </Card>
          </CardAnimation>
        ))}
      </section>
      <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
    </AnimatePresence>
  );
};
