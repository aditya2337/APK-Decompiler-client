import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import CircularProgress from 'material-ui/CircularProgress';
import FileTree from './FileTree';
import 'react-nested-file-tree/dist/default.css';

class AddApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isSignedUp: false,
      uploadedFileCloudinaryUrl: '',
      _tutorialLink: null,
      _tutorialTitle: null,
      _tutorialType: null,
      isPosting: false,
      isPosted: false,
      directory: null,
      redirectToRefferer: false,
      fileData: null,
      isDecompiling: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen () {
    this.setState({open: true});
  }

  handleClose () {
    this.setState({open: false});
  }

  saveApkFile (file, userId) {
    console.log(file.name);
    axios.post(`http://138.197.29.193:3001/users/app/save-apk?file=${file.name}&userId=${userId}`)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.error(err));
  }

  handleSubmit (e) {
    e.preventDefault();
    console.log(this.props.posts.user[0]._id);
    this.setState({isDecompiling: true});
    const file = this.refs;
    const userId = this.props.posts.user[0]._id;
    let data = new FormData();
    const fileData = document.querySelector("input[type='file']").files[0];
    data.append('file', fileData);
    data.append('userId', userId);
    if (file) {
      this.setState({ isPosting: true });
      axios.post('http://138.197.29.193:3001/users/app', data)
      .then(res => {
        this.setState({directory: res.data, isDecompiling: false});
        this.saveApkFile(fileData, userId);
      })
      .catch(err => console.error(err));
    }
  }

  render () {
    const { isPosting, isPosted, directory, isDecompiling } = this.state;
    const { isFetching } = this.props;
    const fileStructure = (isDecompiling) ? (
      <h1>Please wait while we decompile your app..</h1>
    ) : (
      <FileTree directory={directory} />
    );
    const { from } = { from: { pathname: '/my-posts' } };
    if (isPosted) {
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
            <form onSubmit={this.handleSubmit} encType='multipart/form-data' method='post'>
              <input
                type='file'
                multiple={this.props.multi}
                ref='file'
                accept={this.props.accept} />
              <div className='form-group'>
                <RaisedButton type='submit' label='Add Apk' primary={true} />
              </div>
            </form>
          </div>
        </div>
        {fileStructure}
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

export default connect(mapStateToProps)(AddApp);
