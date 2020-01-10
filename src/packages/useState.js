import React from 'react';
import useSsrContext from '../hooks/useContext';
import isDom from '../helpers/is_dom';


function useState (initialState){
  if (isDom()){
    return React.useState(initialState);
  }
  else {
    const {states} = useSsrContext();
    return states.useState(initialState);
  }
}

export default useState;