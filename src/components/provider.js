import React from 'react'
import Context  from './context';

function Provider(props) {

  const value = {
    states: props.states,
    fetchs: props.fetchs,
  };

  return (
    <Context.Provider 
      value={value}>
      {props.children}
    </Context.Provider>
  )
}

export default Provider