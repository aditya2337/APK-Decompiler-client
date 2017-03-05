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
      isSignedUp: false,
      _firstName: null,
      _lastName: null,
      _username: null,
      _password: null,
      _password2: null
    };
    this.handleSignup = this.handleSignup.bind(this);
  }

  // static propTypes = {
  //   selectedSession: PropTypes.bool.isRequired,
  //   posts: PropTypes.array.isRequired,
  //   isFetching: PropTypes.bool.isRequired,
  //   lastUpdated: PropTypes.number,
  //   dispatch: PropTypes.func.isRequired
  // }

  handleSignup (e) {
    e.preventDefault();
    let post = true;
    let passwordsMatch = false;
    const nameFilter = /^[A-z]+$/;
    const emailFilter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let { username, password, firstName, lastName, password2 } = this.refs;
    username = username.getValue();
    password = password.getValue();
    firstName = firstName.getValue();
    lastName = lastName.getValue();
    password2 = password2.getValue();

    if (!username) {
      this.setState({_username: 'This field is required'});
      post = false;
    } else if (!emailFilter.test(username)) {
      this.setState({_username: 'Email format is not correct'});
      post = false;
    } else {
      this.setState({_username: null});
    }

    if (!firstName) {
      this.setState({_firstName: 'This field is required'});
      post = false;
    } else if (!nameFilter.test(firstName)) {
      this.setState({_firstName: 'Special Character and numbers are not allowed'});
      post = false;
    } else {
      this.setState({_firstName: null});
    }

    if (!lastName) {
      this.setState({_lastName: 'This field is required'});
      post = false;
    } else if (!nameFilter.test(lastName)) {
      this.setState({_lastName: 'Special Character and numbers are not allowed'});
      post = false;
    } else {
      this.setState({_lastName: null});
    }

    if (!password) {
      this.setState({_password: 'This field is required'});
      post = false;
    } else if (password.length < 8) {
      this.setState({_password: 'Password too short, atleast 8 characters required'});
      post = false;
    } else if (password !== password2) {
      this.setState({
        _password: `Passwords don't match`,
        _password2: `Passwords don't match`
      });
      post = false;
    } else {
      this.setState({_password: null});
      passwordsMatch = true;
    }

    if (!password2) {
      this.setState({_password2: 'This field is required'});
      post = false;
    }

    if (passwordsMatch) {
      this.setState({_password2: null});
    }

    const { dispatch } = this.props;
    if (post) {
      dispatch(registerUserIfNeeded(username, password, firstName, lastName));
    }
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
    console.log(this.state);
    const { isSignedUp } = this.state;
    const { isFetching } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    if (isSignedUp) {
      return (
        <Redirect to={from} />
      );
    }

    // if (isFetching) {
    //   return (
    //     <div className='container'>
    //       <CircularProgress size={80} thickness={5} />
    //     </div>
    //   );
    // }

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
                  errorText={this.state._firstName}
                />
              </div>
              <div>
                <TextField
                  hintText='doe'
                  floatingLabelText='Last Name'
                  ref='lastName'
                  errorText={this.state._lastName}
                />
              </div>
              <div>
                <TextField
                  hintText='abc@abc.com'
                  floatingLabelText='Email'
                  ref='username'
                  errorText={this.state._username}
                />
              </div>
              <div>
                <TextField
                  hintText='********'
                  floatingLabelText='Password'
                  ref='password'
                  type='password'
                  errorText={this.state._password}
                />
              </div>
              <div>
                <TextField
                  hintText='********'
                  floatingLabelText='Repeat Password'
                  ref='password2'
                  type='password'
                  errorText={this.state._password2}
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
