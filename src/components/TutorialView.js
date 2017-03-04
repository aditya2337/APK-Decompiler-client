import React, { Component } from 'react';

export default class TuroialView extends Component {
  componentWillMount () {
    console.log(this.props.location.state);
  }

  render () {
    const { location } = this.props;

    return (
      <div>
        <div>
          <img src={location.state.image} />
        </div>
        <div>
          <a href={location.state.liveDemoLink}>Live link</a>
        </div>
        <div>
          <a href={location.state.githubLink}>Github link</a>
        </div>
      </div>
    );
  }
}
