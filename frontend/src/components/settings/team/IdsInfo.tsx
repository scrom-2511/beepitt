import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Label } from '@/components/ui/label';
import { UserMinus2 } from 'lucide-react';

const IdsInfo = ({ chatIds }: { chatIds: string[] }) => {
  if (chatIds?.length === 0) {
    return (
      <Empty className="h-full">
        <EmptyHeader className="flex flex-row items-center justify-center">
          <EmptyMedia variant="icon" className="m-0">
            <UserMinus2 className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle className="text-muted-foreground">There are no linked Ids.</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <div className="flex flex-col gap-6 text-muted-foreground text-sm">
      <div className="grid w-full gap-5">
        {chatIds.map((chatId, index) => (
          <div key={chatId ?? index} className="flex-1">
            <Label htmlFor={`firstName-${index}`}>Id {index + 1}</Label>
            <div
              id={`id-${index}`}
              className="py-4 px-6 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2 bg-input/30 rounded-2xl flex justify-between"
            >
              {chatId}
              {/* <Trash2 className="hover:text-red-600 hover:cursor-pointer size-5" /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdsInfo;
