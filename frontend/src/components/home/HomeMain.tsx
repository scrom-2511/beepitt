import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import HowItWorks from "./HowItWorks";
import Navbar from "./Navbar";

const HomeMain = () => {
  const words = ["Issue", "Error"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Navbar />

      {/* Hero section */}
      <div className="relative w-full min-h-screen bg-[#171211] overflow-hidden">
        {/* Background video */}
        <video
          className="absolute right-0 top-0 h-full w-auto object-contain"
          src="/beepitt-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Content */}
        <div
          className="relative z-10 h-full flex flex-col gap-8 justify-end
            font-poppins font-light text-7xl text-foreground p-20 pt-40"
        >
          <div>
            {/* <div className="mb-20">
              <h1 className="text-muted-foreground text-xl">
                Get instant notifications whenever an,
              </h1>
              <h1 className="text-muted-foreground text-xl">
                issue is detected or an error is caught!
              </h1>
            </div> */}
            <h1 className="text-7xl font-light mb-5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>{" "}
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
