import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HowItWorks from './HowItWorks';
import Navbar from './Navbar';

const HomeMain = () => {
  const words = ['Incident', 'Issue'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />

      {/* Hero section */}
      <div
        className="relative w-full min-h-screen bg-[#0d0b0e] overflow-hidden"
        // style={{
        //   backgroundImage: "url(/bg2.jpg)",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        // }}
      >
        {/* Background video */}
        <video
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.5;
          }}
          className="absolute right-0 top-0 h-full w-auto"
          src="/beepitt-bg3.mp4"
          autoPlay
          loop
          muted
        />

        {/* Content */}
        <div
          className="relative z-10 h-full flex flex-col gap-8 justify-end
            font-poppins font-light text-7xl text-foreground pt-40 p-20"
        >
          <div>
            <h1 className="text-7xl font-light mb-5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>{' '}
              caught,
            </h1>
            <h1>
              <span className="text-8xl text-primary">Notification</span> sent!
            </h1>
          </div>
        </div>
      </div>

      <Separator className="p-0.5" />

      <HowItWorks />
    </div>
  );
};

export default HomeMain;
