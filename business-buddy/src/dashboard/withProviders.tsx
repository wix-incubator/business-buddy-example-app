import { WixStyleReactProvider } from "@wix/design-system";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export function withProviders(Component: React.ComponentType) {
  return function () {
    return (
      <WixStyleReactProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Component />
        </QueryClientProvider>
      </WixStyleReactProvider>
    );
  };
}
