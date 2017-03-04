import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Authenticate from '../Authenticate';
import { Redirect } from 'react-router-dom';
import { authenticateUserIfNeeded, fetchSessionIfNeeded } from '../store/actions';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import AuthService from '../utils/AuthService';

class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
    this.login = this.login.bind(this);
  }
  
  static propTypes = {
    selectedSession: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  login (e) {
    e.preventDefault();
    let { username, password } = this.refs;
    username = username.getValue();
    password = password.getValue();
    const { dispatch } = this.props;
    dispatch(authenticateUserIfNeeded(username, password));
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedSession !== this.props.selectedSession) {
      const { dispatch } = nextProps;
      dispatch(fetchSessionIfNeeded('androiditya@gmail.com', 'aditya337'));
    }

    Authenticate.isFetching = nextProps.isFetching;
    Authenticate.isAuthenticated = nextProps.posts.authenticated;

    if (Authenticate.isAuthenticated) {
      this.setState({ isLoggedIn: true });
    }
  }

  render () {
    const { isLoggedIn } = this.state;
    const { isFetching } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    if (isLoggedIn) {
      return (
        <Redirect to={from} />
      );
    }

    if (isFetching) {
      return (
        <div className='container'>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-6' id='contactForm'>
            <form onSubmit={this.login}>
              <div className='form-group'>
                <TextField
                  hintText='abc@abc.com'
                  floatingLabelText='Email'
                  ref='username'
                />
              </div>
              <div className='form-group'>
                <TextField
                  hintText='*****'
                  floatingLabelText='Password'
                  ref='password'
                  type='password'
                />
              </div>
              <div className='form-group'>
                <RaisedButton type='submit' label='Log In' primary={true} />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

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

export default connect(mapStateToProps)(Login);
