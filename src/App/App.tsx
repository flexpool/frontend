import './normalize.scss';
import './App.scss';
import createReduxStore from 'src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
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

const store = createReduxStore();

const App = () => {
  return (
    <>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <Helmet titleTemplate="%s | Flexpool" />
          <ThemeProvider theme={mainTheme}>
            <Router>
              <NavBar />
              <Switch>
                <Route
                  exact
                  strict
                  component={StatisticsPage}
                  path="/statistics"
                />
                <Route exact strict component={FaqPage} path="/faq" />
                <Route exact strict component={MinersPage} path="/miners" />
                <Route exact strict component={BlocksPage} path="/blocks" />
                <Route exact strict component={HomePage} path="/" />
                <Redirect to="/" />
              </Switch>
              <FooterSection />
            </Router>
          </ThemeProvider>
        </ReduxProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
