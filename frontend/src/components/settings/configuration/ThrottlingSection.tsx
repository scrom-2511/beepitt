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
import {
    type ConfigurationsResponse
} from '@/requestHandler/settings/configurations/getConfigurationsHandler.reqhandler';
import { updateGlobalThrottleWindowHandler } from '@/requestHandler/settings/configurations/updateGlobalThrottleWindow.reqhandler';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
const ThrottlingSection = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<'sec' | 'minutes' | 'hours'>('minutes');

  const [initialSeconds, setInitialSeconds] = useState<number | null>(null);

  // Convert to seconds
  const convertToSeconds = (val: number, unit: string) => {
    if (unit === 'sec') return val;
    if (unit === 'minutes') return val * 60;
    if (unit === 'hours') return val * 60 * 60;
    return val;
  };

  // Convert from seconds → UI format
  const convertFromSeconds = (seconds: number) => {
    if (seconds % 3600 === 0) {
      return { value: String(seconds / 3600), unit: 'hours' };
    }
    if (seconds % 60 === 0) {
      return { value: String(seconds / 60), unit: 'minutes' };
    }
    return { value: String(seconds), unit: 'sec' };
  };

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: updateGlobalThrottleWindowHandler,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success('Updated');
    },
  });

  // Set initial values from backend
  useEffect(() => {
    if (configurations?.globalThrottleWindow !== undefined) {
      const seconds = configurations.globalThrottleWindow;

      const { value, unit } = convertFromSeconds(seconds);

      setValue(value);
      setUnit(unit as any);
      setInitialSeconds(seconds);
    }
  }, [configurations]);

  // Current computed value
  const currentSeconds = value ? convertToSeconds(Number(value), unit) : null;

  // Dirty check
  const isDirty = initialSeconds !== null && currentSeconds !== null && currentSeconds !== initialSeconds;

  const handleSave = () => {
    if (!currentSeconds) return;

    mutate(
      { globalThrottleWindow: currentSeconds },
      {
        onSuccess: () => {
          setInitialSeconds(currentSeconds);
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4 text-foreground text-sm">
      <div className="flex items-center gap-4">
        <h1 className="font-poppins font-light text-lg">Send a new notification for the same event after,</h1>

        <Input className="w-20 text-center" value={value} onChange={(e) => setValue(e.target.value)} />

        <Select value={unit} onValueChange={(val: any) => setUnit(val)}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Time units" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time units</SelectLabel>
              <SelectItem value="sec">seconds</SelectItem>
              <SelectItem value="minutes">minutes</SelectItem>
              <SelectItem value="hours">hours</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Save Button (only when dirty) */}
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

export default ThrottlingSection