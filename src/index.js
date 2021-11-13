import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from "./screen/errorBoundary";
import { ProvideAuth } from './Hooks/useAuth';

import Loader from './components/Loader'
import { QueryClient, QueryClientProvider } from 'react-query';

const App = lazy(() => import('./App'))

const g = "color:#00000;font-weight:bold;font-size:18px;";
const hello = `%c 🤙 https://guillaume-morin.fr/`;
console.info(hello, g);

const queryClient = new QueryClient()

ReactDOM.render(
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <ProvideAuth>
        <RecoilRoot>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </BrowserRouter>
        </RecoilRoot>
      </ProvideAuth>
    </Suspense>
  </ErrorBoundary>,
  document.getElementById('root')
);

reportWebVitals();
