import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../public/css/CodeEditor.css';
import RaisedButton from 'material-ui/RaisedButton';

export default class CodeEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      code: '//code',
      redirectToRefferer: false
    };

    this.updateCode = this.updateCode.bind(this);
    this.handleCode = this.handleCode.bind(this);
  }

  componentWillMount () {
    console.log(this.props.location.state);
    this.setState({code: this.props.location.state.fileData});
  }

  updateCode (newCode) {
    this.setState({
      code: newCode
    });
  }

  handleCode (code) {
    const { selectedFile } = this.props.location.state;
    code = {code};
    var data = new FormData();
    axios.post(`http://138.197.29.193:3002/users/app/save-code?updatedCode=${code}&filePath=${selectedFile}`, data)
      .then(res => this.setState({redirectToRefferer: true}))
      .catch(err => console.error(err))
    ;
  }

  render () {
    const options = {
      lineNumbers: true
    };

    const { code, redirectToRefferer } = this.state;

    if (redirectToRefferer) {
      return (
        <Redirect to='/my-apps' />
      );
    }

    return (
      <div className='container'>
        <CodeMirror value={code} onChange={this.updateCode} options={options} className='code-editor' />
        <RaisedButton label='Save file' primary={true} onClick={() => this.handleCode(code)} />
      </div>
    );
  }
}
