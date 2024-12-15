import { Provider } from "react-redux";
//import { store } from "@/lib/store";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <Provider store={store}>
    // <Provider store={AppStore}>
    <Component {...pageProps} />
    // </Provider>
  );
}

export default MyApp;
