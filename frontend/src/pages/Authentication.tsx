import OtpComponent from '@/components/auth/OtpComponent';
import ProfileDetailsInputComponent from '@/components/auth/ProfileDetailsInputComponent';
import SigninCardComponent from '@/components/auth/SigninCardComponent';
import SignupCardComponent from '@/components/auth/SignupCardComponent';
import { AuthProvider } from '@/contextProviders/AuthProvider';
import { useAuthState } from '@/hooks/useAuthState';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Authentication = () => {
  return (
    <AuthProvider>
      <AuthenticationContent />
    </AuthProvider>
  );
};

export default Authentication;

const PHRASES = [
  { id: 0, text: <>Event monitoring <br /> that stops alert fatigue</> },
  { id: 1, text: <>Real-time alerts <br /> that empower your team</> },
  { id: 2, text: <>Error tracking <br /> that accelerates debugging</> },
  { id: 3, text: <>Issue response <br /> that prevents downtime</> },
];

const AuthenticationContent = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { step, animate, setAnimate } = useAuthState();
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (window.innerWidth < 1023) {
      setAnimate(false);
    }
  }, [setAnimate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="w-full h-dvh lg:grid lg:grid-cols-2 max-w-500">
      <motion.div
        ref={cardRef}
        animate={{
          x: animate ? (step === 'signup' ? '100%' : '0%') : '',
        }}
        onAnimationStart={() => {
          if (cardRef.current) cardRef.current.style.filter = 'blur(5px)';
        }}
        onAnimationComplete={() => {
          if (cardRef.current) cardRef.current.style.filter = 'blur(0px)';
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full h-full order-1 overflow-y-auto sm:py-30"
      >
        {step === 'signup' && <SignupCardComponent />}
        {step === 'signin' && <SigninCardComponent />}
        {step === 'otp' && <OtpComponent />}
        {step === 'profile' && <ProfileDetailsInputComponent />}
      </motion.div>
      <motion.div
        animate={{
          x: animate ? (step === 'signup' ? '-100%' : '0%') : '',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-primary/40 order-2 hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
      >
        {/* Ambient background glows using app/index.css theme colors */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[90%] h-[70%] rounded-full bg-primary/40 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[110px] pointer-events-none" />
        <div className="z-10 mt-auto mb-6 flex-none font-montserrat min-h-45 xl:min-h-55">
          <AnimatePresence mode="wait">
            <motion.h1
              key={phraseIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-[3.5rem] xl:text-[4rem] font-medium leading-[1.05] tracking-tight mb-8 text-white/95 mix-blend-plus-lighter text-left"
            >
              {PHRASES[phraseIndex].text}
            </motion.h1>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-y-6 gap-x-6 z-10 flex-none pb-4">
          <div>
            <div className="flex items-center gap-2 text-[15px] font-medium text-white/95 mb-2.5">
              Multi-channel
            </div>
            <p className="text-[13.5px] text-white/60 leading-relaxed xl:pr-2">
              Route critical alerts to Telegram, Discord, and Email seamlessly.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[15px] font-medium text-white/95 mb-2.5">
              Smart Throttling
            </div>
            <p className="text-[13.5px] text-white/60 leading-relaxed xl:pr-2">
              Prevent alert fatigue with customizable throttling windows at all levels.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[15px] font-medium text-white/95 mb-2.5">
              Detailed Insights
            </div>
            <p className="text-[13.5px] text-white/60 leading-relaxed xl:pr-2">
              Automated tracking of file paths, lines, and errors to expedite debugging.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
