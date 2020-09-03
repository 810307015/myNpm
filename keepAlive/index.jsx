import React from 'react';

const keepAlive = (Comp) => {

  let cache = {};

  return class Alive extends React.Component {

    componentDidMount() {
      const state = this.comp.state;
      this.comp.setState({ ...state, ...cache });
    }

    componentWillUnmount() {
      const state = this.comp.state;
      cache = { ...state };
    }

    render() {
      return (
        <Comp ref={comp => this.comp = comp} { ...this.props } />
      )
    }
  }
}

export default keepAlive;