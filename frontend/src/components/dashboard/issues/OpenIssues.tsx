import { Badge } from '@/components/ui/badge';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Issue } from '@/requestHandler/issues/getIssues/getOpenIssues.reqhandler';
import { getOpenIssuesHandler } from '@/requestHandler/issues/getIssues/getOpenIssues.reqhandler';
import { updateIssuePriorityHandler } from '@/requestHandler/issues/updateIssues/updateIssuePriority.reqhandler';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Hash, Terminal, Calendar } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Separator } from '@/components/ui/separator';

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
    <AnimatePresence>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-5 gap-5">
        {issue_card_items?.map((item, i) => (
          <IssueCard key={`${item.id}-${i}`} item={item} i={i} onClickToUpdatePriority={onClickToUpdatePriority} />
        ))}
      </section>
      <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
    </AnimatePresence>
  );
};

const IssueCard = ({
  item,
  i,
  onClickToUpdatePriority,
}: {
  item: Issue;
  i: number;
  onClickToUpdatePriority: (id: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <CardAnimation i={i}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card className="bg-card p-5 sm:p-10 flex flex-col h-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="capitalize font-semibold text-md text-foreground">{item.projectName}</div>
              <div className="flex gap-2">
                <Badge className="capitalize rounded-[8px] font-semibold">{item.environment}</Badge>
                {item.group && <Badge variant="secondary">{item.group}</Badge>}
              </div>
            </div>

            <CardHeaderComp title={item.name} desc={item.description} />

            <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
              <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Button>
              <Button variant={'outline'} className="flex-1" onClick={(e) => e.stopPropagation()}>
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Button>
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-start gap-5">
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
            </CardFooter>
          </Card>
        </DialogTrigger>

        <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
          <div className="bg-primary/5 p-6 border-b">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight text-foreground">
                {item.name}
              </DialogTitle>
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
                <p className="text-base leading-relaxed text-foreground/90">{item.projectName}</p>
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CardAnimation>
  );
};
