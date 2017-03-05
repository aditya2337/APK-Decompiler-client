import React, { Component } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../public/css/Tutorial.css';

export default class Tutorial extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fileDirectory: null
    };
  }

  componentWillMount () {
    const { fullObject } = this.props;
    axios.get(`http://138.197.29.193:3002/users/app/view?file=${fullObject.apk}&userId=${fullObject.userId}`)
      .then(res => this.setState({fileDirectory: res.data}))
      .catch(err => console.log(err))
    ;
  }

  render () {
    const { title } = this.props;
    const { fileDirectory } = this.state;
    return (
      <Link to={{
        pathname: '/view-tutorial',
        hash: title,
        state: fileDirectory
      }}><Card>
        <CardTitle title={title} />
      </Card></Link>
    );
  }
}
