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
    console.log(this.props);
    axios.get(`http://138.197.29.193:3001/users/app/view`)
      .then(res => console.log(res))
    ;
  }

  render () {
    const { title, fullObject } = this.props;
    return (
      <Link to={{
        pathname: '/view-tutorial',
        hash: title,
        state: fullObject
      }}><Card  >
        <CardTitle title={title} />
      </Card></Link>
    );
  }
}
