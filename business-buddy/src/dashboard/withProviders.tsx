import { WixDesignSystemProvider } from "@wix/design-system";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { withDashboard } from "@wix/dashboard-react";

export function withProviders(Component: React.ComponentType) {
  return withDashboard(function () {
    return (
      <WixDesignSystemProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Component />
        </QueryClientProvider>
      </WixDesignSystemProvider>
    );
  });
}
