import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportLogsHandler } from '@/requestHandler/settings/moreSettings/exportLogsHandler.reqhandler';
import type { ExportLogsType } from '@/types/dataTypes';
import { getBillingDetailsHandler } from '@/requestHandler/billing/getBillingDetails.reqhandler';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

const ExportLogs = () => {
  const [logsType, setLogsType] = useState<z.infer<typeof ExportLogsType>>({ exportType: 'csv' });

  const handleSave = () => {
    if (!logsType) return;

    exportLogs({ exportType: logsType.exportType });
  };

  // Mutation
  const { mutate: exportLogs, isPending } = useMutation({
    mutationFn: exportLogsHandler,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success('You will receive an email with the logs');
    },
  });

  const { data: billingDetails } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetailsHandler,
  });

  const isPro = billingDetails?.subscription_tier === 'pro';

  return (
    <section className="flex flex-col gap-4 text-foreground text-sm">
      <div className="flex justify-between mb-4">
        <h1 className="font-poppins font-light text-lg">Select export logs type</h1>
        <Select
          value={logsType.exportType}
          onValueChange={(val: z.infer<typeof ExportLogsType>['exportType']) => {
            setLogsType({ exportType: val });
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Logs Type</SelectLabel>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex justify-center">
        <Button 
          className='mt-10 w-full font-bold h-12' 
          variant={isPending ? 'ghost' : 'default'} 
          onClick={handleSave} 
          disabled={isPending || !isPro}
        >
          {!isPro ? 'Upgrade to Pro to Export Logs' : (isPending ? 'Exporting...' : 'Export Logs')}
        </Button>
      </div>
    </section>
  );
};

export default ExportLogs;
