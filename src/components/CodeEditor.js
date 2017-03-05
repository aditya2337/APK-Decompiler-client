import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import axios from 'axios';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../public/css/CodeEditor.css';
import RaisedButton from 'material-ui/RaisedButton';

export default class CodeEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      code: '//code'
    };

    this.updateCode = this.updateCode.bind(this);
    this.handleCode = this.handleCode.bind(this);
  }

  componentWillMount () {
    this.setState({code: this.props.location.state.fileData});
  }

  updateCode (newCode) {
    this.setState({
      code: newCode
    });
  }

  handleCode (code) {
    const { filePath } = this.props.location.state;
    axios.post(`http://138.197.29.193:3002/users/app/save-code?updatedCode=${code}&filePath=${filePath}`)
      .then(res => console.log(res))
      .catch(err => console.error(err))
    ;
  }

  render () {
    const options = {
      lineNumbers: true
    };

    const { code } = this.state;

    return (
      <div className='container'>
        <CodeMirror value={code} onChange={this.updateCode} options={options} className='code-editor' />
        <RaisedButton label='Save file' primary={true} onclick={() => this.handleCode(this.updateCode)} />
      </div>
    );
  }
}
