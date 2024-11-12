import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { WixDesignSystemProvider } from "@wix/design-system";

export function withProviders(Component: React.ComponentType) {
  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <QueryClientProvider client={new QueryClient()}>
        <Component />
      </QueryClientProvider>
    </WixDesignSystemProvider>
  );
}
