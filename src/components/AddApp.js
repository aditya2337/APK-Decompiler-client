import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import NestedFileTreeView from 'react-nested-file-tree';
import 'react-nested-file-tree/dist/default.css';

const directory1 = {
  '_contents': [
    {
      'name': 'filename_1',
      'path': 'filename_1'
    },
    {
      'name': 'filename_2',
      'path': 'filename_2'
    }
  ],
  'folder_1': {
    '_contents': [
      {
        'name': 'filename_1',
        'path': 'folder_1/filename_1'
      }
    ]
  },
  'folder_2': {
    '_contents': [],
    'folder_2_1': {
      '_contents': [
        {
          'name': 'filename1.md',
          'path': 'folder_2/folder_2_1/filename1.md'
        }
      ],
      'folder_2_1_1': {
        '_contents': [
          {
            'name': 'filename1.md',
            'path': 'folder_2/folder_2_1/folder_2_1_1/filename1.md'
          }
        ]
      }
    }
  }
}

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
      selectedFile: 'some_folder/some_file',
      directory: null,
      redirectToRefferer: false,
      fileData: null,
      isDecompiling: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFileClick = this.handleFileClick.bind(this);
    this.handleFolderClick = this.handleFolderClick.bind(this);
    this.CustomFolder = this.CustomFolder.bind(this);
    this.CustomFile = this.CustomFile.bind(this);
  }

  handleFileClick (file) {
    axios.get(`http://138.197.29.193:3001/users/app/get-code?filePath=${file.path}`)
    .then(res => this.setState({
      fileData: res.data,
      redirectToRefferer: true
    }));
    this.setState({ selectedFile: file.path });
  }

  handleFolderClick (folderName) {
    console.log(folderName);
  }

  handleOpen () {
    this.setState({open: true});
  }

  handleClose () {
    this.setState({open: false});
  }

  CustomFolder (props) {
    return (
      <a onClick={props.onclick}><span className='svg'
        dangerouslySetInnerHTML={{__html: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00" enable-background="new 0 0 24.00 24.00" xml:space="preserve">' +
        '<path d="M0 0h24v24H0z" fill="none"></path>' +
        '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path>' +
        '</svg>'}} />
        { props.name }
      </a>
    );
  }

  CustomFile (props) {
    return (
      <a><span className='svg'
        dangerouslySetInnerHTML={{__html: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00" enable-background="new 0 0 24.00 24.00" xml:space="preserve">' +
        '<path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"></path>' +
        '</svg>'}} />
        { props.name }
      </a>
    );
  }

  handleSubmit (e) {
    e.preventDefault();
    console.log(this.props.posts.user[0]._id);
    this.setState({isDecompiling: true});
    const file = this.refs;
    const userId = this.props.posts.user[0]._id;
    let data = new FormData();
    const imagedata = document.querySelector("input[type='file']").files[0];
    data.append('file', imagedata);
    data.append('userId', userId);
    if (file) {
      this.setState({ isPosting: true });
      axios.post('http://138.197.29.193:3001/users/app', data)
      .then(res => {
        this.setState({directory: res.data, isDecompiling: false});
      })
      .catch(err => console.error(err));
    }
  }

  render () {
    const { isPosting, isPosted, directory, redirectToRefferer, fileData, isDecompiling } = this.state;
    const { isFetching } = this.props;
    const fileStructure = (isDecompiling) ? (
      <h1>Please wait while we decompile your app..</h1>
    ) : (
      <div id='container_id'>
        <NestedFileTreeView
          selectedFilePath={this.state.selectedFile}
          fileClickHandler={this.handleFileClick}
          folderClickHandler={this.folderClickHandler}
          fileTemplate={this.CustomFile}
          folderTemplate={this.CustomFolder}
          directory={directory} />
      </div>
    );
    const { from } = { from: { pathname: '/my-posts' } };
    if (isPosted) {
      return (
        <Redirect to={from} />
      );
    }

    if (redirectToRefferer) {
      return (
        <Redirect to={{
          pathname: '/edit-file',
          state: fileData
        }} />
      );
    }

    // if (isFetching || isPosting) {
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
