"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

const ReactQueryProvider: React.FC<Props> = ({ children }) => {
  const clientId = "248488594338-dj46dqfrollrm3m06sfr4ee0fdf1b87d.apps.googleusercontent.com"

  

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default ReactQueryProvider;
