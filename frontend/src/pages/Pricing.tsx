import ButtonComp from '@/components/ButtonComp';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { razorPayCreateOrderHandler } from '@/requestHandler/payment/RazorpayPayment.reqhandler';
import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

enum Tier {
  Free = 'Free',
  Starter = 'Starter',
  Pro = 'Pro',
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
  const { mutate: razorPayCreateOrder, isPending } = useMutation({
    mutationFn: razorPayCreateOrderHandler,
    onSuccess: (res) => {
      console.log(res.orderId);
      if (typeof window === 'undefined') return;

      const options = {
        key: 'rzp_test_S5dfQBnwZhdrTq',
        amount: res.amount,
        currency: 'INR',
        name: 'Beepitt',
        description: 'Test Transaction',
        order_id: res.orderId,
        prefill: {
          name: 'user2',
        },
        theme: {
          color: '#6366f1',
        },
        method: {
          card: true,
          upi: true,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },

        handler: function async(response: any) {
          navigate('/paymentconfirmation');
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
      <div className=" max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground mb-6">
            Let's talk numbers
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for monitoring your projects and incidents. Upgrade anytime as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => {
            const isStarter = item.tier === Tier.Starter;
            const isFree = item.tier === Tier.Free;

            return (
              <Card
                key={item.tier}
                className={`
                  bg-card
                relative flex flex-col justify-between p-10 rounded-xl
                border border-border
                ${isStarter ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
              `}
              >
                {/* Featured Badge */}
                {isStarter && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm px-4 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}

                <div>
                  <CardHeader className="p-0 mb-6">
                    <div className="flex flex-row justify-between">
                      <CardTitle className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                        {item.title}
                      </CardTitle>
                      {!isFree && (
                        <div className="bg-accent px-3 rounded-2xl">
                          {Math.round(
                            ((Number(item.lineThroughPrice) - Number(item.price)) / Number(item.lineThroughPrice)) *
                              100,
                          )}
                          % Off
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <h1 className="line-through text-muted-foreground">
                        {isFree ? '' : '$'}
                        {item.lineThroughPrice}
                      </h1>
                      <h1 className="text-5xl font-semibold text-foreground">
                        {isFree ? '' : '$'}
                        {item.price}
                        <span className="text-muted-foreground mb-2 text-base font-light">
                          {isFree ? '' : ' / month'}
                        </span>
                      </h1>
                    </div>
                  </CardHeader>

                  <Separator className="my-6" />

                  <CardContent className="px-0 space-y-6">
                    {/* Limits */}
                    <div>
                      <h3 className="font-light text-foreground mb-4 font-montserrat text-base">Limits:</h3>
                      <div className="space-y-3">
                        {item.limits.map((limit) => (
                          <div key={limit} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CircleCheck className="size-5 text-primary shrink-0" />
                            <span>{limit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="font-light text-foreground mb-4 font-montserrat text-base">Features:</h3>
                      <div className="space-y-3">
                        {item.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CircleCheck className="size-5 text-primary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-8">
                  <ButtonComp
                    disabled={isPending}
                    variant={isStarter ? 'default' : 'secondary'}
                    className={`
                    w-full font-semibold transition-all duration-300
                    ${!isStarter ? 'hover:bg-primary hover:text-primary-foreground' : ''}
                  `}
                    onClick={() => onSubmit(item.tier)}
                  >
                    {item.tier === Tier.Free ? 'Get Started' : 'Get Started'}
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
