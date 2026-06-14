import { AnimatePresence } from 'framer-motion';
import LoadMoreDiv from '../LoadMoreDiv';

interface EntityGridProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export const EntityGrid = <T,>({
  items,
  renderCard,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
}: EntityGridProps<T>) => {
  return (
    <AnimatePresence>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4 sm:p-6 gap-6">
        {items.map((item, i) => renderCard(item, i))}
      </section>
      <LoadMoreDiv
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreRef={loadMoreRef}
      />
    </AnimatePresence>
  );
};
