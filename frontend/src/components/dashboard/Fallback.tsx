import type { DashboardState } from '@/pages/Dashboard';
import { CircleAlert, FilePlusCorner, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import ButtonComp from '../ButtonComp';
import { Loading } from '../Loading';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';

interface FallbackInterface<T> {
  isError: boolean;
  error: Error | null;
  isLoading: boolean;
  data: T[] | undefined;
  refetch: () => void;
  emptyTitle: DashboardState;
  loadingTitle: string;
  addNew: boolean;
}

const Fallback = <T,>({
  isError,
  error,
  isLoading,
  data,
  refetch,
  emptyTitle,
  loadingTitle,
  addNew,
}: FallbackInterface<T>) => {
  if (!isError && !isLoading && data?.length !== 0) {
    return null;
  }

  if (isError) {
    toast.error(error?.message);
    return (
      <Empty className="h-full">
        <EmptyHeader className="flex flex-row items-center justify-center">
          <EmptyMedia variant="icon" className="m-0 p-0">
            <CircleAlert className="text-red-600 m-0 p-0" />
          </EmptyMedia>
          <EmptyTitle className="text-foreground ">Error fetching data</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <ButtonComp className="w-50 font-bold" onClick={() => refetch()}>
            Refetch
          </ButtonComp>
        </EmptyContent>
      </Empty>
    );
  }

  if (isLoading) {
    return (
      <div className="text-white flex justify-center h-full w-full">
        <Loading title={loadingTitle} />
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <Empty className="h-full">
        <EmptyHeader className="flex flex-row items-center justify-center">
          <EmptyMedia variant="icon" className="m-0">
            {addNew ? (
              <FilePlusCorner className="text-muted-foreground" />
            ) : (
              <PartyPopper className="text-muted-foreground" />
            )}
          </EmptyMedia>
          <EmptyTitle className="text-muted-foreground">
            {!addNew
              ? 'Woohoo, zero' + emptyTitle.toLowerCase()
              : 'Currently you have zero ' + loadingTitle.toLowerCase() + '!'}
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }
};

export default Fallback;
