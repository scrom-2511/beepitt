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
import { type ConfigurationsResponse } from '@/requestHandler/settings/configurations/getConfigurationsHandler.reqhandler';
import { updateGlobalThrottleWindowHandler } from '@/requestHandler/settings/configurations/updateGlobalThrottleWindow.reqhandler';
import { updateProThrottleHandler } from '@/requestHandler/settings/configurations/updateProThrottleHandler.reqhandler';
import { convertFromSeconds } from '@/utils/convertFromSeconds';
import { convertToSeconds } from '@/utils/convertToSeconds';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ThrottlingSection = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const userSubscriptionTier = localStorage.getItem('userSubscriptionTier');

  if (userSubscriptionTier === 'free') return;

  return userSubscriptionTier === 'starter' ? (
    <ThrottlingSectionStarter configurations={configurations} />
  ) : (
    <ThrottlingSectionPro configurations={configurations} />
  );
};

export default ThrottlingSection;

const ThrottlingSectionStarter = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<'sec' | 'minutes' | 'hours'>('minutes');

  const [initialSeconds, setInitialSeconds] = useState<number | null>(null);

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

const ThrottlingSectionPro = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const [count, setCount] = useState<string>('');

  const [windowValue, setWindowValue] = useState<string>('');
  const [windowUnit, setWindowUnit] = useState<'sec' | 'minutes' | 'hours'>('minutes');

  const [cooldownValue, setCooldownValue] = useState<string>('');
  const [cooldownUnit, setCooldownUnit] = useState<'sec' | 'minutes' | 'hours'>('minutes');

  const [initialState, setInitialState] = useState<{
    count: number;
    window: number;
    cooldown: number;
  } | null>(null);

  const { mutate: updateGlobalThrottleWindow, isPending } = useMutation({
    mutationFn: updateProThrottleHandler,
    onError: (error) => toast.error(error.message),
    onSuccess: () => toast.success('Updated'),
  });

  useEffect(() => {
    if (!configurations) return;

    const { eventTriggerCount, eventTriggerWindow, globalThrottleWindow } = configurations;

    const window = convertFromSeconds(eventTriggerWindow);
    const cooldown = convertFromSeconds(globalThrottleWindow);

    setCount(String(eventTriggerCount));

    setWindowValue(window.value);
    setWindowUnit(window.unit as any);

    setCooldownValue(cooldown.value);
    setCooldownUnit(cooldown.unit as any);

    setInitialState({
      count: eventTriggerCount,
      window: eventTriggerWindow,
      cooldown: globalThrottleWindow,
    });
  }, [configurations]);

  const currentWindow = windowValue ? convertToSeconds(Number(windowValue), windowUnit) : null;
  const currentCooldown = cooldownValue ? convertToSeconds(Number(cooldownValue), cooldownUnit) : null;
  const currentCount = count ? Number(count) : null;

  const isDirty =
    initialState &&
    currentCount !== null &&
    currentWindow !== null &&
    currentCooldown !== null &&
    (currentCount !== initialState.count ||
      currentWindow !== initialState.window ||
      currentCooldown !== initialState.cooldown);

  const handleSave = () => {
    if (!currentCount || !currentWindow || !currentCooldown) return;

    updateGlobalThrottleWindow(
      {
        eventTriggerCount: currentCount,
        eventTriggerWindow: currentWindow,
        globalThrottleWindow: currentCooldown,
      },
      {
        onSuccess: () => {
          setInitialState({
            count: currentCount,
            window: currentWindow,
            cooldown: currentCooldown,
          });
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-4 text-foreground text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-poppins font-light text-lg">Send notification if event occurs</h1>

        {/* X */}
        <Input className="w-20 text-center" value={count} onChange={(e) => setCount(e.target.value)} />

        <span>times in</span>

        {/* Y value */}
        <Input className="w-20 text-center" value={windowValue} onChange={(e) => setWindowValue(e.target.value)} />

        {/* Y unit */}
        <Select value={windowUnit} onValueChange={(val: any) => setWindowUnit(val)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Window</SelectLabel>
              <SelectItem value="sec">seconds</SelectItem>
              <SelectItem value="minutes">minutes</SelectItem>
              <SelectItem value="hours">hours</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <span>then wait</span>

        {/* Z value */}
        <Input className="w-20 text-center" value={cooldownValue} onChange={(e) => setCooldownValue(e.target.value)} />

        {/* Z unit */}
        <Select value={cooldownUnit} onValueChange={(val: any) => setCooldownUnit(val)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cooldown</SelectLabel>
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
