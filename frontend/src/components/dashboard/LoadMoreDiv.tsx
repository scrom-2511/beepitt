import type React from 'react';
import { Loading } from '../Loading';

type LoadMoreDivProps = {
  hasNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
};

const LoadMoreDiv = ({ hasNextPage, loadMoreRef, isFetchingNextPage }: LoadMoreDivProps) => {
  return (
    <div>
      {hasNextPage && (
        <div ref={loadMoreRef} className="col-span-full text-center py-5">
          {isFetchingNextPage ? <Loading title="Loading" /> : 'Scroll to load more'}
        </div>
      )}
    </div>
  );
};

export default LoadMoreDiv;
