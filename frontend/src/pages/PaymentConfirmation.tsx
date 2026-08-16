import { Loading } from '@/components/Loading';
import { getBillingDetailsHandler } from '@/requestHandler/billing/getBillingDetails.reqhandler';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
      }, 5000);

      return () => clearTimeout(timer);
    } else if (billingDetails?.subscription_tier === 'free') {
      const timer = setTimeout(() => {
        navigate('/pricing');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [billingDetails?.subscription_tier, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loading title="Confirming payment" />
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-card text-card-foreground p-8 rounded-4xl shadow-2xl shadow-destructive/10 border border-destructive/20 flex flex-col items-center text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2"
          >
            <AlertCircle className="w-10 h-10" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We couldn't verify your payment status. If the issue persists, please contact support.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (billingDetails?.subscription_tier === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-card text-card-foreground p-8 rounded-4xl shadow-2xl shadow-foreground/5 border border-border flex flex-col items-center text-center space-y-6"
        >
          <div className="relative mb-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="h-20 w-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center relative z-10"
            >
              <XCircle className="w-10 h-10" />
            </motion.div>
            <div className="absolute inset-0 bg-muted rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Payment Unsuccessful</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your payment could not be processed. If any money was deducted, it will be refunded to your original payment method automatically.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 flex flex-col items-center"
          >
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide uppercase">Redirecting to pricing</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (billingDetails?.subscription_tier === 'starter' || billingDetails?.subscription_tier === 'pro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-card text-card-foreground p-10 rounded-4xl shadow-2xl shadow-primary/20 border border-primary/20 flex flex-col items-center text-center space-y-6"
        >
          <div className="relative mb-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center relative z-10"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Success!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your payment was successful and your subscription is now active. Welcome aboard!
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 flex flex-col items-center"
          >
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide uppercase">Redirecting to dashboard</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"></div>
  );
};

export default PaymentConfirmation;