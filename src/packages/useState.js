import React from 'react';
import useSsrContext from '../hooks/useContext';
import isDom from '../helpers/is_dom';
import client_states from '../core/states_client';


function useState (initialState){
  
  if (isDom){
    const preloaded_state = client_states.getState();
    const state = React.useState(preloaded_state || initialState)
    console.log('state library', state);
    return state;
  }
  else {
    const { states } = useSsrContext();
    return states.useState(initialState);
  }
}

export default useState;