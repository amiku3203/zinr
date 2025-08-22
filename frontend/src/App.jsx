import React from 'react'
import { HelmetProvider } from 'react-helmet-async';
import AppRoute from './routes/AppRoute'
import { ToastContainer } from "react-toastify";
import { SocketProvider } from './context/SocketContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

const App = () => {
  return (
    <HelmetProvider>
      <SocketProvider>
        <SubscriptionProvider>
          <AppRoute/>
          <ToastContainer />
        </SubscriptionProvider>
      </SocketProvider>
    </HelmetProvider>
  )
}

export default App