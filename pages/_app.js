import { ThemeProvider, theme, CSSReset, withDefaultColorScheme, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '../utils/firebase/auth';

function MyApp({ Component, pageProps }) {
  const theme = extendTheme(withDefaultColorScheme({colorScheme: "twitter"}));
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CSSReset />
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp
