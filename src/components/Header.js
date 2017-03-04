import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Tab } from 'material-ui/Tabs';
import { signOutUserIfNeeded, fetchSessionIfNeeded } from '../store/actions';
import { connect } from 'react-redux';
import Authenticate from '../Authenticate';

class Header extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false,
      isLoggedIn: true
    };
    this._toggle = this._toggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handletitletouch = this.handletitletouch.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  static propTypes = {
    selectedSession: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedSession !== this.props.selectedSession) {
      const { dispatch } = nextProps;
      dispatch(fetchSessionIfNeeded('androiditya@gmail.com', 'aditya337'));
    }

    Authenticate.isFetching = nextProps.isFetching;
    Authenticate.isAuthenticated = nextProps.posts.authenticated;

    if (!Authenticate.isAuthenticated) {
      this.setState({ isLoggedIn: false, open: false });
    }
  }

  _toggle (e) {
    e.preventDefault();
    this.setState({open: !this.state.open});
  }

  handleClose (e) {
    e.preventDefault();
    this.setState({open: false});
  }

  handletitletouch (e) {
    e.preventDefault();
    console.log('title touched');
  }

  handleLogout (e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(signOutUserIfNeeded('androiditya'));
    this.setState({ isLoggedIn: false, open: false });
  }

  render () {
    const title = (
      <Link to='/'>
        <Tab label='apk decompiler' style={{
          color: 'white',
          height: '100%',
          width: '20rem',
          fontWeight: 'bold'
        }} />
      </Link>
    );

    const menuItems = (Authenticate.isAuthenticated) ? (
      <div>
        <MenuItem onTouchTap={this.handleClose} containerElement={<Link to='/add-app' />}>Add App</MenuItem>
        <MenuItem onTouchTap={this.handleClose} containerElement={<Link to='/my-apps' />}>My Apps</MenuItem>
        <MenuItem onTouchTap={this.handleLogout} containerElement={<Link to='/home' />}>Log Out</MenuItem>
      </div>
    ) : (
      <div>
        <MenuItem onTouchTap={this.handleClose} containerElement={<Link to='/login' />}>Log In</MenuItem>
        <MenuItem onTouchTap={this.handleClose} containerElement={<Link to='/register' />}>Register</MenuItem>
        <MenuItem><a href='http://138.197.29.193:3001/users/auth/twitter'>Log In/Sign Up with twitter</a></MenuItem>
      </div>
    );

    return (
      <div>
        <div>
          <AppBar onLeftIconButtonTouchTap={this._toggle}
            title={title}
            onTitleTouchTap={this.handletitletouch}
          />
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            {menuItems}
          </Drawer>
        </div>
        <div className='container'>
          {this.props.children}
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

export default connect(mapStateToProps)(Header);
