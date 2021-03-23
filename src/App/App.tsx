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
import { NavBar } from 'src/components/layout/NavBar';
import { ThemeProvider } from 'styled-components/macro';
import { mainTheme } from './styledTheme';
import { HomePage } from 'src/pages/Home/Home.page';
import { FooterSection } from 'src/sections/Footer.section';
import { StatisticsPage } from 'src/pages/Statistics/Statistics.page';
import { Helmet, HelmetProvider } from 'react-helmet-async';

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
