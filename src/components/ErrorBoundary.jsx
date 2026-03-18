import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) { 
    super(props); 
    this.state = { crashed: false }; 
  }
  static getDerivedStateFromError() { 
    return { crashed: true }; 
  }
  render() { 
    return this.state.crashed ? this.props.fallback : this.props.children; 
  }
}
