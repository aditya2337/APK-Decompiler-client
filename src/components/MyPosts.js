import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authenticate from '../Authenticate';
import { Redirect } from 'react-router-dom';
import { fetchSessionIfNeeded } from '../store/actions';
import CircularProgress from 'material-ui/CircularProgress';
import Tutorial from './Tutorial';

class MyPosts extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      apps: []
    };
  }

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch(fetchSessionIfNeeded('androiditya@gmail.com'));
  }

  componentWillReceiveProps (nextProps) {
    const id = nextProps.posts.user[0]._id;
    fetch(`http://138.197.29.193:3002/users/app/my-apps?userId=${id}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(json => {
      this.setState({
        apps: json.apps
      });
    });
    if (!nextProps.posts.authenticated) {
      this.setState({ isLoggedIn: false });
    }
    Authenticate.isFetching = nextProps.isFetching;
  }

  render () {
    const { isLoggedIn, apps } = this.state;
    const { isFetching } = this.props;

    if (!isLoggedIn) {
      return (
        <Redirect to='/login' />
      );
    }

    if (isFetching) {
      return (
        <div>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }

    return (
      <div className='container'>
        {apps.map(app =>
          <Tutorial title={app.apk} fullObject={app} />
        )}
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

export default connect(mapStateToProps)(MyPosts);
