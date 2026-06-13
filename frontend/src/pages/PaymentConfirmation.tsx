import { Loading } from '@/components/Loading';
import { getBillingDetailsHandler } from '@/requestHandler/billing/getBillingDetails.reqhandler';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmation = () => {
  const {
    data: billingDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetailsHandler,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (billingDetails?.subscription_tier === 'starter' || billingDetails?.subscription_tier === 'pro') {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

      return () => clearTimeout(timer);
    } else if (billingDetails?.subscription_tier === 'free') {
      const timer = setTimeout(() => {
        navigate('/pricing');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [billingDetails?.subscription_tier, navigate]);

  if (isLoading) {
    return <Loading title="Confirming payment" />;
  }

  if (isError) {
    return <h1>Something went wrong</h1>;
  }

  if (billingDetails?.subscription_tier === 'free') {
    return <h1>Payment unsuccessful. Money will be refunded in case of deduction.</h1>;
  }

  if (billingDetails?.subscription_tier === 'starter' || billingDetails?.subscription_tier === 'pro') {
    return <h1>Payment Successful</h1>;
  }

  return null;
};

export default PaymentConfirmation;