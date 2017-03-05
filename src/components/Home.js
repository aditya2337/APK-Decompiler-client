import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authenticate from '../Authenticate';
import { Redirect } from 'react-router-dom';
import { fetchSessionIfNeeded } from '../store/actions';
import CircularProgress from 'material-ui/CircularProgress';
import Tutorial from './Tutorial';
import '../../public/css/Home.css';

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
        <div className='flex sc-size'>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }

    return (
      <div className='container'>
        <div className='flex heading'>
          <h1>Welcome to Apk Decompiler</h1>
        </div>
        <div className='container'>
          <div className='bl flex image'>
            <img src='https://lh5.ggpht.com/x9yUAL4iKMviNVeSgZeob7kFi3xGUnnaGd5yHcC3FGPQFSDk77op85go4i8MvL4hauk=w300' />
          </div>
          <div className='flex text'>
            All applications for Android phones are distributed as APK Files.
            These files contain all the code, images and other media necessary to run the application on your phone.
            This website will decompile the code embedded in APK files and extract all the other assets in the file.
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

export default connect(mapStateToProps)(Home);
