import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../middlewares/queryClient';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
