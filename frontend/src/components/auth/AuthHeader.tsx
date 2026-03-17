import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';

interface AuthHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}
const AuthHeader = ({ title, description, children }: AuthHeaderProps) => {
  console.log('i was called');
  return (
    <CardHeader>
      <CardTitle className="text-4xl sm:text-6xl font-montserrat font-medium text-foreground">{title}</CardTitle>
      <CardDescription className="font-montserrat mt-1 text-xs sm:text-sm sm:mt-4 mb-8">
        {description}
        {children}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
