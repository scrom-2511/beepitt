import { checkLoggedInHandler } from '@/requestHandler/auth/CheckLoggedIn.reqhandler';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from './Loading';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  console.log('i am in protected route');
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['checkLoggedIn'],
    queryFn: checkLoggedInHandler,
  });

  if (isLoading) return <Loading title="Checking authentication..." />;

  if (isSuccess) return children;

  if (isError) {
    console.log('Error');
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
