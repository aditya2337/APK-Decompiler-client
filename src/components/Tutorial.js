import React, { Component } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { Link } from 'react-router-dom';
import '../../public/css/Tutorial.css';

export default class Tutorial extends Component {
  render () {
    const { title, fullObject } = this.props;
    return (
      <Link to={{
        pathname: '/view-tutorial',
        hash: title,
        state: fullObject
      }}><Card>
        <CardTitle title={title} />
      </Card></Link>
    );
  }
}
