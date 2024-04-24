import logo from './logo.svg';
import styles from './App.module.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './components/Home/Home'
import Register from './components/Register/Register';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login';
import Account from './components/Account/Account';
import { SearchContextProvider } from './contexts/SearchContext/SearchContext';
import Search from './components/Search/Search';
function App() {
  return (
    <div className={styles.App}>
       <SearchContextProvider>
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
                path="/"
                element={
                    <div className={styles.main}>
                      <Search />
                      <Header />
                      <div className={styles.homePage}>
                        <Home />
                        <Footer />
                      </div>
                    </div>
                }
            />
        </Routes>
       </SearchContextProvider>
    </div>
  );
}

export default App;
