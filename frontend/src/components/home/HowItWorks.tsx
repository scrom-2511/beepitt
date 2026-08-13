import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      step: 1,
      title: 'Install the SDK',
      description:
        "Install the Beepitt SDK in your project using npm or yarn. It's lightweight and takes less than a minute to set up.",
      code: <div className="text-primary">npm install beepitt</div>,
      buttonText: 'View Documentation',
      visual: {
        label: 'SDK Installation',
      },
      reverse: false,
    },
    {
      step: 2,
      title: 'Track Incidents',
      description:
        'Wrap your incident handling code with a single Beepitt call. Use it in try-catch blocks throughout your application to monitor errors in real-time.',
      code: (
        <>
          <div className="text-muted-foreground">{'{'}</div>
          <div className="text-muted-foreground ml-4">// your code</div>
          <div className="text-primary ml-4">beepitt.captureIncident(incidentObj)</div>
          <div className="text-muted-foreground">{'}'}</div>
        </>
      ),
      // buttonText: "See Code Examples",
      visual: {
        label: 'Code Integration',
      },
      reverse: true,
    },
    {
      step: 3,
      title: 'Track Issues',
      description:
        'Wrap your error handling code with a single Beepitt call. Use it in try-catch blocks throughout your application.',
      code: (
        <>
          <div className="text-muted-foreground">try {'{'}</div>
          <div className="text-muted-foreground ml-4">// your code</div>
          <div className="text-muted-foreground">
            {'}'} catch (error) {'{'}
          </div>
          <div className="text-primary ml-4">beepitt.captureIssue(issueObj)</div>
          <div className="text-muted-foreground">{'}'}</div>
        </>
      ),
      // buttonText: "See Code Examples",
      visual: {
        label: 'Code Integration',
      },
      reverse: false,
    },
    {
      step: 4,
      title: 'Receive Notifications',
      description:
        "As soon as an error is caught by Beepitt, you'll receive instant notifications.",
      extras: (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <div className="text-foreground font-medium text-sm">Telegram & Discord</div>
            <div className="text-muted-foreground text-xs">Team notifications</div>
          </div>
        </div>
      ),
      buttonText: 'Configure Channels',
      visual: {
        label: 'Notification System',
      },
      reverse: true,
    },
  ];

  return (
    <div className="bg-background w-full">
      <main className="w-full">
        {/* Hero */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-6">Beep in 3 steps</h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Three simple steps to integrate Beepitt into your application
            </p>
          </div>
        </section>

        {/* Steps Bento Grid */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map(({ step, title, description, code, extras }, index) => {
                const bentoClasses = [
                  "md:col-span-1",
                  "md:col-span-2",
                  "md:col-span-2",
                  "md:col-span-1",
                ];

                const isWide = index === 1 || index === 2;

                return (
                  <div
                    key={step}
                    className={`bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 overflow-hidden relative group hover:border-primary/30 hover:scale-102 transition-all hover:bg-card/60 duration-500 flex flex-col cursor-pointer ${bentoClasses[index]
                      }`}
                  >
                    {/* Background faint icon */}
                    <div className="absolute -top-8 -right-6 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none text-9xl text-red-50 font-bold">
                      {step}
                    </div>

                    {/* Content wrapper */}
                    <div className={`relative z-10 w-full h-full flex flex-col grow ${isWide ? 'md:flex-row md:items-center gap-8 md:gap-12' : ''}`}>
                      <div className={isWide ? 'md:w-[45%] flex flex-col justify-center h-full w-full' : 'flex flex-col grow w-full'}>
                        <div className="flex items-center gap-3 mb-6">
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{title}</h2>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 md:mb-0">
                          {description}
                        </p>
                      </div>

                      <div className={isWide ? 'md:w-[55%] mt-auto md:mt-0 w-full min-w-0' : 'mt-auto w-full min-w-0'}>
                        {code && (
                          <div className="bg-background rounded-2xl border border-border p-5 font-mono text-xs sm:text-sm text-muted-foreground overflow-x-auto shadow-sm">
                            {code}
                          </div>
                        )}

                        {extras && (
                          <div className="flex flex-col gap-4 w-full">
                            {extras.props.children}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to get started?</h2>

            <p className="text-base text-muted-foreground mb-8">
              Join thousands of developers who are already using Beepitt to monitor their applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-accent bg-transparent"
              >
                View Docs
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-border bg-background py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 Beepitt. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div >
  );
};

export default HowItWorks;
