"use client";

import { store } from "@/store/Store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { CurrencyProvider } from "./CurrencyContext";


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <SessionProvider>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </SessionProvider>
    </Provider>
  );
};

export default Providers;