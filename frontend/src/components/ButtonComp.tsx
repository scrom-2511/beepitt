import type { VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { Button, buttonVariants } from './ui/button';

const ButtonComp = ({
  children,
  className = 'flex-1 w-full py-5 sm:py-6 font-semibold cursor-pointer',
  variant = 'default',
  size = 'default',
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="w-full"
    >
      <Button {...props} size={size} variant={variant} className={className} onClick={onClick}>
        {children}
      </Button>
    </motion.div>
  );
};

export default memo(ButtonComp);
