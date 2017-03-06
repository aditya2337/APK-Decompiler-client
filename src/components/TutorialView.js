import React, { Component } from 'react';
import FileTree from './FileTree';

export default class TuroialView extends Component {
  componentWillMount () {
    console.log(this.props.location.state);
  }

  render () {
    const fileDirectory = this.props.location.state;

    return (
      <div className='container'>
        <FileTree directory={fileDirectory} />
      </div>
    );
  }
}
