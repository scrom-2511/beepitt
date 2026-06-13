import ButtonComp from '@/components/ButtonComp';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { razorPayCreateOrderHandler } from '@/requestHandler/payment/RazorpayPayment.reqhandler';
import { razorPayVerifyPaymentHandler } from '@/requestHandler/payment/RazorpayVerifyPayment.reqhandler';
import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

enum Tier {
  Free = 'free',
  Starter = 'starter',
  Pro = 'pro',
}

interface PriceCardItems {
  tier: Tier;
  title: string;
  lineThroughPrice: string;
  price: string;
  featureTitle: string;
  limits: string[];
  features: string[];
}

const items: PriceCardItems[] = [
  {
    tier: Tier.Free,
    title: 'Basic Plan',
    lineThroughPrice: '',
    price: 'Free',
    limits: ['3 days validity', 'Up to 1 project', '1,000 events', '7 days log history', 'Up to 1 alert recipient'],
    featureTitle: 'Features:',
    features: ['Incident & Issue Alerts', 'Basic Dashboard', 'Single notificaiton channel'],
  },
  {
    tier: Tier.Starter,
    title: 'Starter Plan',
    lineThroughPrice: '19.99',
    price: '14.99',
    featureTitle: 'Everything in free plus:',
    limits: [
      '30 days validity',
      'Up to 3 projects',
      '10,000 events',
      '14 days log history',
      'Up to 3 alert recipients',
    ],
    features: ['Everything in Free', 'Basic Analytics', 'Multi-channel notifications'],
  },
  {
    tier: Tier.Pro,
    title: 'Pro Plan',
    lineThroughPrice: '49.99',
    price: '39.99',
    featureTitle: 'Everything in Starter plus:',
    limits: [
      '30 days validity',
      'Up to 10 projects',
      '100,000 events',
      '30 days log history',
      'Up to 10 alert recipients',
    ],
    features: [
      'Everything in Starter',
      'Export Logs(CSV/JSON)',
      'Separate Recepients for Incident and Issues',
      'Event throttling',
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { mutate: razorPayVerifyPayment } = useMutation({
    mutationFn: razorPayVerifyPaymentHandler,
    onSuccess: () => {
      navigate('/paymentconfirmation');
    },
    onError: (err: any) => {
      console.error('Verification failed', err);
    },
  });

  const { mutate: razorPayCreateOrder, isPending } = useMutation({
    mutationFn: razorPayCreateOrderHandler,
    onSuccess: (res) => {
      console.log(res.orderId);
      if (typeof window === 'undefined') return;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: 'INR',
        name: 'Beepitt',
        description: 'Test Transaction',
        order_id: res.orderId,
        prefill: {
          name: res.name,
          email: res.email,
        },
        theme: {
          color: '#6366f1',
        },
        method: {
          card: true,
          upi: true,
          netbanking: true,
          wallet: true,
          emi: true,
          paylater: true,
        },

        handler: function (response: any) {
          razorPayVerifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    },
  });

  const onSubmit = (id: Tier) => {
    console.log(id);
    razorPayCreateOrder({ id: id.toString() });
  };

  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16 md:mb-20">
          <h1 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 sm:mb-6">
            Let's talk numbers
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto">
            Choose the perfect plan for monitoring your projects and incidents. Upgrade anytime as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => {
            const isStarter = item.tier === Tier.Starter;
            const isFree = item.tier === Tier.Free;

            return (
              <Card
                key={item.tier}
                className={`
                bg-card relative flex flex-col justify-between
                p-6 sm:p-8 md:p-10
                rounded-xl border border-border
                transition-all duration-300
                ${isStarter ? 'ring-2 ring-primary shadow-lg lg:scale-105' : 'hover:shadow-md'}
              `}
              >
                {/* Featured Badge */}
                {isStarter && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}

                <div>
                  <CardHeader className="p-0 mb-4 sm:mb-6">
                    <div className="flex flex-row justify-between items-center gap-2">
                      <CardTitle className="text-muted-foreground text-xs sm:text-sm font-medium tracking-wide uppercase">
                        {item.title}
                      </CardTitle>

                      {!isFree && (
                        <div className="bg-accent px-2 sm:px-3 py-1 rounded-xl text-xs sm:text-sm">
                          {Math.round(
                            ((Number(item.lineThroughPrice) - Number(item.price)) / Number(item.lineThroughPrice)) *
                            100,
                          )}
                          % Off
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-col gap-1">
                      {!isFree && (
                        <h1 className="line-through text-muted-foreground text-sm sm:text-base">
                          ${item.lineThroughPrice}
                        </h1>
                      )}

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground">
                        {isFree ? item.price : `$${item.price}`}
                        {!isFree && (
                          <span className="text-muted-foreground ml-1 text-xs sm:text-sm font-light">/ month</span>
                        )}
                      </h1>
                    </div>
                  </CardHeader>

                  <Separator className="my-4 sm:my-6" />

                  <CardContent className="px-0 space-y-5 sm:space-y-6">
                    {/* Limits */}
                    <div>
                      <h3 className="font-light text-foreground mb-3 sm:mb-4 font-montserrat text-sm sm:text-base">
                        Limits:
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {item.limits.map((limit) => (
                          <div
                            key={limit}
                            className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                          >
                            <CircleCheck className="size-4 sm:size-5 text-primary shrink-0" />
                            <span>{limit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="font-light text-foreground mb-3 sm:mb-4 font-montserrat text-sm sm:text-base">
                        Features:
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {item.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                          >
                            <CircleCheck className="size-4 sm:size-5 text-primary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-6 sm:pt-8">
                  <ButtonComp
                    disabled={isPending}
                    variant={isStarter ? 'default' : 'secondary'}
                    className={`
                    w-full text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer
                    ${!isStarter ? 'hover:bg-primary hover:text-primary-foreground' : ''}
                  `}
                    onClick={() => onSubmit(item.tier)}
                  >
                    Get Started
                  </ButtonComp>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
