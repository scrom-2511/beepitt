import { useEffect } from "react";

type UseInfiniteScrollProps = {
  targetRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
};

export function useInfiniteScroll({
  targetRef,
  hasNextPage,
  fetchNextPage,
  threshold = 0.5,
}: UseInfiniteScrollProps) {
  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold },
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage]);
}
