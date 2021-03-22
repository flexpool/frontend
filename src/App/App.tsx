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

const store = createReduxStore();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={mainTheme}>
        <Router>
          <NavBar />
          <Switch>
            <Route component={HomePage} path="/" />
            <Redirect to="/" />
          </Switch>
        </Router>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
