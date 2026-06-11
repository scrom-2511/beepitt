import { Badge } from '@/components/ui/badge';
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
import { Hash, Terminal, Calendar } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  type UpdateIssuePriorityType = z.infer<typeof UpdateIssuePriorityType>;
  const [priorities, setPriorities] = useState<Record<string, UpdateIssuePriorityType['issuePriority']>>({});
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
    <AnimatePresence>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
        {issue_card_items?.map((item, i) => (
          <IssueCard
            key={`${item.id}-${i}`}
            item={item}
            i={i}
            onSubmitSetPriority={onSubmitSetPriority}
            priorities={priorities}
            setPriorities={setPriorities}
          />
        ))}
      </section>
      <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
    </AnimatePresence>
  );
};

const IssueCard = ({
  item,
  i,
  onSubmitSetPriority,
  priorities,
  setPriorities,
}: {
  item: Issue;
  i: number;
  onSubmitSetPriority: (id: number) => void;
  priorities: Record<string, UpdateIssuePriorityEnum>;
  setPriorities: React.Dispatch<React.SetStateAction<Record<string, UpdateIssuePriorityEnum>>>;
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

            <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
              <Button
                variant={'outline'}
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {new Date(item.createdAt).toLocaleDateString()}
              </Button>
              <Button
                variant={'outline'}
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Button>
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-start gap-5">
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
            </CardFooter>
          </Card>
        </DialogTrigger>

        <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
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
                  {item.description || 'No description provided for this issue.'}
                </p>
              </section>

              {item.filePath && (
                <section>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Terminal size={14} /> Source Location
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm border border-border/50 group relative">
                    <div className="break-all leading-normal">
                      <span className="text-muted-foreground mr-1">Path:</span>
                      <span className="text-foreground">{item.filePath}</span>
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


            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CardAnimation>
  );
};

