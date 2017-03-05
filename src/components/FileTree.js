import React, { Component } from 'react';
import NestedFileTreeView from 'react-nested-file-tree';
import axios from 'axios';

export default class FileTree extends Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedFile: 'some_folder/some_file',
      fileData: '//code',
      redirectToRefferer: false
    };

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

  render () {
    const directory = this.props.directory;
    return (
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
  }
}
