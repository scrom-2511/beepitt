import ButtonComp from '@/components/ButtonComp';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ConfigurationsResponse } from '@/requestHandler/settings/configurations/getConfigurationsHandler.reqhandler';
import { updateRetryConfigHandler } from '@/requestHandler/settings/configurations/updateRetryConfigHandler.reqhandler';
import { convertFromSeconds } from '@/utils/convertFromSeconds';
import { convertToSeconds } from '@/utils/convertToSeconds';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const RetryOffsetSection = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const [count, setCount] = useState<string>('');

  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<'sec' | 'minutes' | 'hours'>('minutes');

  const [initialState, setInitialState] = useState<{
    count: number;
    offset: number;
  } | null>(null);

  const { mutate: updateRetryConfig, isPending } = useMutation({
    mutationFn: updateRetryConfigHandler,
    onError: (error) => toast.error(error.message),
    onSuccess: () => toast.success('Updated'),
  });

  useEffect(() => {
    if (!configurations) return;

    const { maxRetries, retryOffset } = configurations;

    const offset = convertFromSeconds(retryOffset);

    setCount(String(maxRetries));
    setValue(offset.value);
    setUnit(offset.unit as any);

    setInitialState({
      count: maxRetries,
      offset: retryOffset,
    });
  }, [configurations]);

  const currentCount = count ? Number(count) : null;
  const currentOffset = value ? convertToSeconds(Number(value), unit) : null;

  const isDirty =
    initialState &&
    currentCount !== null &&
    currentOffset !== null &&
    (currentCount !== initialState.count || currentOffset !== initialState.offset);

  const handleSave = () => {
    if (!currentCount || !currentOffset) return;

    updateRetryConfig(
      {
        maxRetries: currentCount,
        retryOffset: currentOffset,
      },
      {
        onSuccess: () => {
          setInitialState({
            count: currentCount,
            offset: currentOffset,
          });
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4 text-foreground text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-poppins font-light text-lg">Retry up to</h1>

        {/* X */}
        <Input className="w-20 text-center" value={count} onChange={(e) => setCount(e.target.value)} />

        <span>times every</span>

        {/* Y value */}
        <Input className="w-20 text-center" value={value} onChange={(e) => setValue(e.target.value)} />

        {/* Y unit */}
        <Select value={unit} onValueChange={(val: any) => setUnit(val)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time</SelectLabel>
              <SelectItem value="sec">seconds</SelectItem>
              <SelectItem value="minutes">minutes</SelectItem>
              <SelectItem value="hours">hours</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isDirty && (
        <div className="w-full flex justify-center">
          <ButtonComp variant={isPending ? 'ghost' : 'default'} onClick={handleSave} disabled={isPending}>
            Save
          </ButtonComp>
        </div>
      )}
    </section>
  );
};

export default RetryOffsetSection;
