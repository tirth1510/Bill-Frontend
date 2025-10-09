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
  const clientId = "42299733053-0vvhi1j4qk1ma0jc8cqg0p9l0k0mi8os.apps.googleusercontent.com"

  

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
