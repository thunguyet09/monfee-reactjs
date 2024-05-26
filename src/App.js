import logo from './logo.svg';
import styles from './App.module.css';
import React, {Suspense} from 'react';
import { BrowserRouter as Router, Route, Routes, Switch, Navigate } from 'react-router-dom';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './components/Home/Home'
import Register from './components/Register/Register';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login';
import Account from './components/Account/Account';
import { SearchContextProvider } from './contexts/SearchContext/SearchContext';
import Search from './components/Search/Search';
import Product from './components/Product/Product';
import Detail from './components/Detail/Detail';
import MiniCart from './components/MiniCart/MiniCart';
import { MiniCartContextProvider } from './contexts/SearchContext/MiniCartContext';
import Cart from './components/Cart/Cart';
import Dashboard from './admin/Dashboard/Dashboard';
import { useState, useEffect } from 'react';
import Checkout from './components/Checkout/Checkout';

const ProtectedRoute = ({ path, element: Element }) => {
  const getUserToken = () => {
    return localStorage.getItem('token');
  };
  const verifyTokenOnServer = async (token) => {
    return fetch('http://localhost:3000/users/verifyToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => data.isValid);
  };

  const checkTokenValidity = async () => {
    const token = getUserToken();

    if (token) {
      return await verifyTokenOnServer(token);
    }

    return false;
  };
  const isAuthenticated = checkTokenValidity();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Route path={path} element={<Element />} />;
};

const UserRoute = ({ element: Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        const isValid = await verifyUserTokenOnServer(token);
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkTokenValidity();
  }, []);

  const verifyUserTokenOnServer = async (token) => {
    const response = await fetch('http://localhost:3000/users/verifyUserToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
   
    const data = await response.json();
    return data.isValid;
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Element authenticated="true"/>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};


const CartPage = () => (
  <div className={styles.main}>
    <Search />
    <Header />
    <div className={styles.homePage}>
      <Cart />
      <MiniCart />
      <Footer />
    </div>
  </div>
);
function App() {
  return (
    <div className={styles.App}>
      <SearchContextProvider>
        <MiniCartContextProvider>
          <Routes>
            <Route
              path="/register"
              element={
                <div className={styles.main}>
                  <Header />
                  <div className={styles.homePage}>
                    <Register />
                    <Footer />
                  </div>
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className={styles.main}>
                  <Header />
                  <div className={styles.homePage}>
                    <Login />
                    <Footer />
                  </div>
                </div>
              }
            />
            <Route
              path="/account"
              element={
                <div className={styles.main}>
                  <Header />
                  <div className={styles.homePage}>
                    <Account />
                    <Footer />
                  </div>
                </div>
              }
            />
            <Route element={<NotFound />} />
            <Route
              exact
              path="/shop"
              element={
                <div className={styles.main}>
                  <Search />
                  <Header />
                  <div className={styles.homePage}>
                    <Product />
                    <MiniCart />
                    <Footer />
                  </div>
                </div>
              }
            />
            <Route
              exact
              path="/products/:id"
              element={
                <div className={styles.main}>
                  <Search />
                  <Header />
                  <div className={styles.homePage}>
                    <Detail />
                    <MiniCart />
                    <Footer />
                  </div>
                </div>
              }
            />
            <Route
              exact
              path="/"
              element={
                <div className={styles.main}>
                  <Search />
                  <Header />
                  <div className={styles.homePage}>
                    <Home />
                    <MiniCart />
                    <Footer />
                  </div>
                </div>
              }
            />

            <Route
              path="/cart"
              element={<UserRoute element={CartPage} />}
            />

            <Route
              exact
              path="/checkout"
              element={
                <div className={styles.main}>
                  <Search />
                  <Header />
                  <div className={styles.homePage}>
                    <Checkout />
                    <MiniCart />
                    <Footer />
                  </div>
                </div>
              }
            />

            <Route path="/admin" element={<ProtectedRoute element={Dashboard} />} />
          </Routes>
        </MiniCartContextProvider>
      </SearchContextProvider>
    </div>
  );
}

export default App;
