import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchSessionIfNeeded } from './store/actions';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Header from './components/Header';
import AddApp from './components/AddApp';
import MyPosts from './components/MyPosts';
import TutorialView from './components/TutorialView';
import CodeEditor from './components/CodeEditor';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Authenticate from './Authenticate';
import App from './App';
import {cyan500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan500
  },
  appBar: {
    height: 50
  }
});

class Routes extends Component {
  static propTypes = {
    selectedSession: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchSessionIfNeeded('androiditya@gmail.com', 'aditya337'));
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedSession !== this.props.selectedSession) {
      const { dispatch } = nextProps;
      dispatch(fetchSessionIfNeeded('androiditya@gmail.com', 'aditya337'));
    }

    Authenticate.isFetching = nextProps.isFetching;
    Authenticate.isAuthenticated = nextProps.posts.authenticated;
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router>
          <div>
            <Header />
            <Route exact={true} path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/add-app' component={AddApp} />
            <Route path='/my-apps' component={MyPosts} />
            <Route path='/view-tutorial' component={TutorialView} />
            <Route path='/edit-file' component={CodeEditor} />
            <PrivateRoute path='/home' component={Home} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => (
      !Authenticate.isAuthenticated
          ? (Authenticate.isFetching ? (
              <div className='container'>
                <CircularProgress size={80} thickness={5} />
              </div>
            ) : <Redirect to='/login' />)
          : React.createElement(component, props)
    )} />
);

const mapStateToProps = state => {
  const { selectedSession, postsBySession } = state;
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySession['undefined'] || {
    isFetching: true,
    items: []
  };

  return {
    selectedSession,
    posts,
    isFetching,
    lastUpdated
  };
};

export default connect(mapStateToProps)(Routes);
