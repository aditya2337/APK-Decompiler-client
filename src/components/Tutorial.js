import React, { Component } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { Link } from 'react-router-dom';
import '../../public/css/Tutorial.css';

export default class Tutorial extends Component {
  render () {
    const { title, imgURI, fullObject } = this.props;
    return (
      <Link to={{
        pathname: '/view-tutorial',
        hash: title,
        state: fullObject
      }}><Card className='tutorial'>
        <CardMedia>
          <img src={imgURI} />
        </CardMedia>
        <CardTitle title={title} className='tutorial-media' />
      </Card></Link>
    );
  }
}
