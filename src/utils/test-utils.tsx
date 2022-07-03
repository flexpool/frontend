import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const AlltheProviders = ({ children }: { children?: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, { wrapper: AlltheProviders, ...options });
};

export * from '@testing-library/react';

export { customRender as render };
