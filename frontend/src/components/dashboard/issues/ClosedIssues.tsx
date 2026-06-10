import { Badge } from '@/components/ui/badge';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getClosedIssuesHandler } from '@/requestHandler/issues/getIssues/getClosedIssues.reqhandler';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Hash, Terminal } from 'lucide-react';
import { useRef } from 'react';
import ButtonComp from '../../ButtonComp';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardFooter } from '../../ui/card';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import FilterSection from '../FilterSection';
import LoadMoreDiv from '../LoadMoreDiv';
const ClosedIssues = () => {
  return (
    <>
      <FilterSection showEnvironment={true} showGroup={true} showPriority={false} />
      <IssueCardsSection />
    </>
  );
};

export default ClosedIssues;

const IssueCardsSection = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, isPending, refetch } =
    useInfiniteQuery({
      queryKey: ['closedIssues'],
      queryFn: ({ pageParam }) => getClosedIssuesHandler(pageParam),
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
    <AnimatePresence>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
        {issue_card_items?.map((item, i) => (
          <CardAnimation i={i} key={item.id}>
            <Card className="bg-card p-5 sm:p-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="capitalize">
                  {item.projectName}
                </Badge>
                <div className="flex gap-2">
                  <Badge className="capitalize">{item.environment}</Badge>
                  {item.group && <Badge variant="secondary">{item.group}</Badge>}
                </div>
              </div>

              <CardHeaderComp title={item.name} desc={item.description} />

              <div className="flex-1">
                {item.filePath && (
                  <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                      <Terminal size={14} /> Source
                    </div>
                    <div className="text-sm font-mono break-all text-foreground">
                      {item.filePath}
                      {item.lineNumber && (
                        <span className="text-primary font-bold">
                          :{item.lineNumber}
                          {item.columnNumber && `:${item.columnNumber}`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash size={14} /> Occurrences: <span className="font-bold text-foreground">{item.occurrences}</span>
                </div>
              </div>

              <div className="mt-6">
                <CardDescription className="text-foreground p-0 m-0 text-xs font-semibold">
                  Error Occured At:{' '}
                </CardDescription>
                <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-2">
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
              </div>
              <div>
                <CardDescription className="text-foreground p-0 m-0 text-xs font-semibold">
                  Error Fixed At:{' '}
                </CardDescription>
                <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-2 mb-6">
                  <Button variant={'outline'} className="flex-1">
                    {item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : 'N/A'}
                  </Button>
                  <Button variant={'outline'} className="flex-1">
                    {item.resolvedAt
                      ? new Date(item.resolvedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </Button>
                </CardContent>
              </div>
              <CardFooter className="p-0 flex flex-col items-start gap-5">
                <div className="flex flex-row items-center">
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
                    className={`h-2.5 w-2.5  mr-3 rounded-full bg-green-500`}
                  ></motion.div>
                  Fixed
                </div>
                <ButtonComp className="h-10 w-full font-semibold cursor-pointer">Mark As Unfixed</ButtonComp>
              </CardFooter>
            </Card>
          </CardAnimation>
        ))}
      </section>
      <LoadMoreDiv hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
    </AnimatePresence>
  );
};
