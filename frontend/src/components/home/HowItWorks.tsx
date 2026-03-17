import { Button } from '@/components/ui/button';
import { ArrowRight, BellRing, CheckCircle2, Code2, Download } from 'lucide-react';
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
        icon: Download,
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
        icon: Code2,
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
        icon: Code2,
        label: 'Code Integration',
      },
      reverse: false,
    },
    {
      step: 4,
      title: 'Receive Notifications',
      description:
        "As soon as an error is caught by Beepitt, you'll receive instant notifications through your preferred channels—email, Slack, Discord, webhook, or in-app alerts.",
      extras: (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <BellRing className="w-5 h-5 text-primary mb-2" />
            <div className="text-foreground font-medium text-sm">Email Alerts (Soon)</div>
            <div className="text-muted-foreground text-xs">Instant notifications</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <div className="text-foreground font-medium text-sm">Telegram & Discord</div>
            <div className="text-muted-foreground text-xs">Team notifications</div>
          </div>
        </div>
      ),
      buttonText: 'Configure Channels',
      visual: {
        icon: BellRing,
        label: 'Notification System',
      },
      reverse: true,
    },
  ];

  return (
    <div className="bg-background w-full">
      <main className="w-full">
        {/* Hero */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-24 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-6">Beep in 3 steps</h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Three simple steps to integrate Beepitt into your application
            </p>
          </div>
        </section>

        {/* Steps */}
        {steps.map(({ step, title, description, code, extras, buttonText, visual, reverse }) => {
          const VisualIcon = visual.icon;

          return (
            <section key={step} className="w-full px-4 sm:px-6 md:px-8 py-16 border-b border-border">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
                  {/* Visual */}
                  <div
                    className={`bg-background rounded-lg p-6 md:p-8 flex items-center justify-center min-h-[200px] md:min-h-[320px] ${
                      reverse ? 'md:order-2' : ''
                    }`}
                  >
                    <div className="text-center">
                      <VisualIcon className="w-16 h-16 md:w-24 md:h-24 text-primary mx-auto mb-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`relative ${reverse ? 'md:order-1' : ''}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>

                    <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">{description}</p>

                    {code && (
                      <div className="bg-card rounded-lg border border-border p-4 font-mono text-xs sm:text-sm text-muted-foreground mb-6 overflow-x-auto">
                        {code}
                      </div>
                    )}

                    {extras && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">{extras.props.children}</div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}

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
    </div>
  );
};

export default HowItWorks;
