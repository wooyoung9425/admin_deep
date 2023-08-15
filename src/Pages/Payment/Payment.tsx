import React from 'react';
import { Outlet, BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar from '../../Common/Topbar';
import PaymentNavbar from '../../Common/PaymentNavbar';
import PaymentDetail from './PaymentDetail';

function Payment() {
  const rendering = () => {
    const result = [];
    result.push(
      <PaymentNavbar />
    )
    return result;
  }
  return (
    <>
      { rendering() }
      <Topbar/>
      <PaymentDetail/>
      <Outlet/>
    </>
  );
}

export default Payment;
