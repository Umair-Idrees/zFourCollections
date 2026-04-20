import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { BlogProvider } from './context/BlogContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <OrderProvider>
          <BlogProvider>
            <App />
          </BlogProvider>
        </OrderProvider>
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
);
