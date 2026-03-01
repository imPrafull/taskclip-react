import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { PostHogProvider } from '@posthog/react';
import { store } from './store/store';
import { App } from "./App";
import { initPostHog, posthog } from './lib/posthog';

initPostHog();

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </PostHogProvider>
  </StrictMode>,
);
