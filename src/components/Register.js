import React, { Component, PropTypes } from 'react';
import Authenticate from '../Authenticate';
import { connect } from 'react-redux';
import { registerUserIfNeeded, fetchSessionIfNeeded } from '../store/actions';
import { Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

class Register extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isSignedUp: false
    };
    this.handleSignup = this.handleSignup.bind(this);
  }

  static propTypes = {
    selectedSession: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  handleSignup (e) {
    e.preventDefault();
    let { username, password, firstName, lastName } = this.refs;
    username = username.getValue();
    password = password.getValue();
    firstName = firstName.getValue();
    lastName = lastName.getValue();
    const { dispatch } = this.props;
    dispatch(registerUserIfNeeded(username, password, firstName, lastName));
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedSession !== this.props.selectedSession) {
      const { dispatch } = nextProps;
      dispatch(fetchSessionIfNeeded('androiditya@gmail.com', 'aditya337'));
    }

    Authenticate.isFetching = nextProps.isFetching;
    Authenticate.isAuthenticated = nextProps.posts.authenticated;

    if (Authenticate.isAuthenticated) {
      this.setState({ isSignedUp: true });
    }
  }

  render () {
    const { isSignedUp } = this.state;
    const { isFetching } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    if (isSignedUp) {
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
          <div className='col-md-6'>
            <form onSubmit={this.handleSignup}>
              <div>
                <TextField
                  hintText='Jon'
                  floatingLabelText='First Name'
                  ref='firstName'
                />
              </div>
              <div>
                <TextField
                  hintText='doe'
                  floatingLabelText='Last Name'
                  ref='lastName'
                />
              </div>
              <div>
                <TextField
                  hintText='abc@abc.com'
                  floatingLabelText='Email'
                  ref='username'
                />
              </div>
              <div>
                <TextField
                  hintText='********'
                  floatingLabelText='Password'
                  ref='password'
                  type='password'
                />
              </div>
              <div>
                <TextField
                  hintText='********'
                  floatingLabelText='Password'
                  ref='password2'
                  type='password'
                />
              </div>
              <div className='form-group'>
                <RaisedButton type='submit' label='Register' primary={true} />
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

export default connect(mapStateToProps)(Register);
