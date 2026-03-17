import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getClosedIssuesHandler } from '@/requestHandler/issues/getIssues/getClosedIssues.reqhandler';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import ButtonComp from '../../ButtonComp';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardFooter } from '../../ui/card';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';
import Fallback from '../Fallback';
import LoadMoreDiv from '../LoadMoreDiv';
const ClosedIssues = () => {
  return <ErrorCardsSection />;
};

export default ClosedIssues;

const ErrorCardsSection = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, isLoading, refetch } = useInfiniteQuery(
    {
      queryKey: ['closedIssues'],
      queryFn: ({ pageParam }) => getClosedIssuesHandler(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({ fetchNextPage, hasNextPage, targetRef: loadMoreRef });

  const issue_card_items = data?.pages.flatMap((page) => page.issues) ?? [];

  if (isError || isLoading || issue_card_items?.length === 0) {
    return (
      <Fallback
        data={issue_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        emptyTitle="Closed Issues"
      />
    );
  }

  return (
    <AnimatePresence>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
        {issue_card_items?.map((item, i) => (
          <CardAnimation i={i} key={item.id}>
            <Card className="bg-card p-10">
              <CardHeaderComp title={item.issueName} desc={item.issueDesc} />
              <div>
                <CardDescription className="text-foreground p-0 m-0">Error Occured At: </CardDescription>
                <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-2">
                  <Button variant={'outline'} className="flex-1">
                    Date
                  </Button>
                  <Button variant={'outline'} className="flex-1">
                    Date
                  </Button>
                </CardContent>
              </div>
              <div>
                <CardDescription className="text-foreground p-0 m-0">Error Fixed At: </CardDescription>
                <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-2 mb-6">
                  <Button variant={'outline'} className="flex-1">
                    Date
                  </Button>
                  <Button variant={'outline'} className="flex-1">
                    Time
                  </Button>
                </CardContent>
              </div>
              <CardFooter className="p-0 flex flex-col items-start gap-5">
                <div className="flex flex-row items-center">
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
