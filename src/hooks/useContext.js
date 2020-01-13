import Context from '../components/context';
import React from 'react'


export function useSsrContext() {
  const contextValue = React.useContext(Context);
  return contextValue;
}

export default useSsrContext;