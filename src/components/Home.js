import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authenticate from '../Authenticate';
import { Redirect } from 'react-router-dom';
import { fetchSessionIfNeeded } from '../store/actions';
import CircularProgress from 'material-ui/CircularProgress';
import Tutorial from './Tutorial';

class Home extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      tutorials: []
    };
  }

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch(fetchSessionIfNeeded('androiditya@gmail.com'));
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.posts.authenticated) {
      this.setState({ isLoggedIn: false });
    }
    Authenticate.isFetching = nextProps.isFetching;
  }

  render () {
    const { isLoggedIn, tutorials } = this.state;
    const { isFetching } = this.props;

    if (!isLoggedIn) {
      return (
        <Redirect to='/login' />
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
      <div className='container'>
        {tutorials.map(tutorial =>
          <Tutorial title={tutorial.title} imgURI={tutorial.image} key={tutorial._id} fullObject={tutorial} />
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

export default connect(mapStateToProps)(Home);
