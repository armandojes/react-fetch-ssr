import React from 'react';
import useSsrContext from '../hooks/useContext';
import isDom from '../helpers/is_dom';
import client_states from '../core/states_client';


function useState (initialState){
  
  if (isDom){
    const preloaded_state = client_states.getState();
    return React.useState(preloaded_state || initialState);
  }
  else {
    const {states} = useSsrContext();
    return states.useState(initialState);
  }
}

export default useState;