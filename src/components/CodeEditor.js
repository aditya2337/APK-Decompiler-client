import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import axios from 'axios';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../public/css/CodeEditor.css';

export default class CodeEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      code: '//code'
    };

    this.updateCode = this.updateCode.bind(this);
  }

  componentWillMount () {
    this.setState({code: this.props.location.state});
  }

  updateCode (newCode) {
    this.setState({
      code: newCode
    });
  }

  render () {
    const options = {
      lineNumbers: true
    };

    const { code } = this.state;

    return (
      <div className='container'>
        <CodeMirror value={code} onChange={this.updateCode} options={options} className='code-editor' />
      </div>
    );
  }
}
