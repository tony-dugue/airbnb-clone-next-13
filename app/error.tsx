'use client';

import { useEffect } from "react";

import EmptyState from "@/app/components/EmptyState";

interface ErrorStateProps {
  error: Error
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return ( 
    <EmptyState title="Oups" subtitle="Une erreur est survenue !" />
   );
}
 
export default ErrorState;

