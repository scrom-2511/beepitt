import { CircleAlert, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import ButtonComp from "../ButtonComp";
import { Loading } from "../Loading";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface fallbackInterface<T> {
  isError: boolean;
  error: Error | null;
  isLoading: boolean;
  data: T[] | undefined;
  refetch: () => void;
}

const Fallback = <T,>({
  isError,
  error,
  isLoading,
  data,
  refetch,
}: fallbackInterface<T>) => {
  if (!isError && !isLoading && data?.length !== 0) {
    return null;
  }

  if (isError) {
    toast.error(error?.message);
    return (
      <Empty className="h-full">
        <EmptyHeader className="flex flex-row items-center justify-center">
          <EmptyMedia variant="icon" className="m-0">
            <CircleAlert color="red" />
          </EmptyMedia>
          <EmptyTitle className="text-foreground ">
            Error fetching data
          </EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <ButtonComp className="w-50 font-bold" onClick={() => refetch()}>
            Refetch
          </ButtonComp>
        </EmptyContent>
      </Empty>
    );
  }

  if (data?.length === 0) {
    return (
      <Empty className="h-full">
        <EmptyHeader className="flex flex-row items-center justify-center">
          <EmptyMedia variant="icon" className="m-0">
            <PartyPopper className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle className="text-muted-foreground">
            Woohoo, zero open issues!
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isLoading) {
    return (
      <div className="text-white flex justify-center h-full w-full">
        <Loading title="Open Issues" />
      </div>
    );
  }
};

export default Fallback;
