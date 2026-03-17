import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const IdentifierKeyComp = ({ identifierKey }: { identifierKey: string }) => {
  return (
    <div className="flex flex-col gap-6 text-muted-foreground text-sm">
      <div className="flex w-full gap-5">
        <div className=" flex-1">
          <Label htmlFor="identifier key">Identifier Key</Label>
          <div
            onMouseDown={async () => {
              await navigator.clipboard.writeText(identifierKey);
              toast.success('Copied to clipboard');
            }}
            id="identifierKey"
            className="py-4 px-6 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2 bg-input/30 rounded-2xl"
          >
            {identifierKey}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentifierKeyComp;
