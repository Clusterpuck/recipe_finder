/*Standard class to manage errors that can occur from compononents smoothly to avoid crashing the whole site*/
import React from 'react';


class ErrorBoundary extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError( error )
  {
    return {hasError: true };
  }
  
  componentDidCatch( error, errorInfo )
  {
    console.log( error.message, errorInfo );
  }
  
  render()
  {
    if( this.state.hasError)
    {
      return <h1>We have encountered an error... oops</h1>
    }
    
    return this.props.children;
  }

}

export default ErrorBoundary;