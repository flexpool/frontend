import './normalize.scss';
import './App.scss';
import React from 'react';
import createReduxStore from 'src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { NavBar } from 'src/components/layout/NavBar';
import { ThemeProvider } from 'styled-components/macro';
import { mainTheme } from './styledTheme';
import { HomePage } from 'src/pages/Home/Home.page';
import { FooterSection } from 'src/sections/Footer.section';
import { StatisticsPage } from 'src/pages/Statistics/Statistics.page';
import { BlocksPage } from 'src/pages/Blocks/Blocks.page';
import { MinersPage } from 'src/pages/Miners/Miners.page';
import { FaqPage } from 'src/pages/Faq/Faq.page';
import { SupportPage } from 'src/pages/Support/Support.page';
import { MinerDashboardPage } from 'src/pages/MinerDashboard/MinerDashboard.page';

import './init';
import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';

const store = createReduxStore();

const Theme = () => {};

const AppContent = () => {
  const location = useLocation();

  usePoolCoins();

  // hash
  React.useLayoutEffect(() => {
    const hash = location.hash;
    setTimeout(() => {
      const scrollToEl = document.getElementById(hash.replace('#', ''));
      if (scrollToEl) {
        window.scrollTo({
          top: scrollToEl.offsetTop - 50,
          left: 0,
          behavior: 'smooth',
        });
      }
    }, 40);
  }, [location.hash]);

  // location

  React.useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [location.pathname]);

  return (
    <>
      <NavBar />
      <Switch>
        <Route exact strict component={StatisticsPage} path="/statistics" />
        <Route exact strict component={FaqPage} path="/faq" />
        <Route exact strict component={MinersPage} path="/miners" />
        <Route component={MinerDashboardPage} path="/miners/:coin/:address" />
        <Route exact strict component={BlocksPage} path="/blocks" />
        <Route exact strict component={SupportPage} path="/support" />
        <Route exact strict component={HomePage} path="/" />
        <Redirect to="/" />
      </Switch>
      <FooterSection />
    </>
  );
};

const App = () => {
  return (
    <>
      <style>{`body {
      --bg-primary: #151519;
      --bg-secondary: #2c2c31;
      --border-color: #333;
      --text-secondary: #ccc;
      --text-primary: #eee;
      }
      
      svg tspan {
        fill: var(--text-primary);
      }
      
      `}</style>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <Helmet titleTemplate="%s | Flexpool" />
          <ThemeProvider theme={mainTheme}>
            <Router>
              <AppContent />
            </Router>
          </ThemeProvider>
        </ReduxProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
