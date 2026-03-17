import OtpComponent from '@/components/auth/OtpComponent';
import ProfileDetailsInputComponent from '@/components/auth/ProfileDetailsInputComponent';
import SigninCardComponent from '@/components/auth/SigninCardComponent';
import SignupCardComponent from '@/components/auth/SignupCardComponent';
import { AuthProvider } from '@/contextProviders/AuthProvider';
import { useAuthState } from '@/hooks/useAuthState';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const Authentication = () => {
  return (
    <AuthProvider>
      <AuthenticationContent />
    </AuthProvider>
  );
};

export default Authentication;

const AuthenticationContent = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { step, animate, setAnimate } = useAuthState();

  useEffect(() => {
    if (window.innerWidth < 1023) {
      setAnimate(false);
    }
  });
  return (
    <motion.div className="w-full h-full lg:grid lg:grid-cols-2 overflow-scroll sm:py-30 max-w-500">
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
        className="w-full h-full order-1"
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
        className="bg-black order-2 mr-20 rounded-3xl hidden lg:block"
      >
        content yet to come
      </motion.div>
    </motion.div>
  );
};
