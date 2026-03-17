import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import ButtonComp from './ButtonComp';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';

const ErrorFetching = ({ error, refetch }: { error: any; refetch: () => void }) => {
  toast.error(error.message);
  return (
    <Empty className="h-full">
      <EmptyHeader className="flex flex-row items-center justify-center">
        <EmptyMedia variant="icon" className="m-0">
          <CircleAlert color="red" />
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
};

export default ErrorFetching;
