import isDom from '../helpers/is_dom';
import React from 'react';
import useSsrContext from '../hooks/useContext';


function useFetch(handler, array){
  
  if (isDom){
    return array
    ? React.useEffect(() => {handler()}, array)
    : React.useEffect(() => {handler()});
  }
  else {
    const {fetchs} = useSsrContext();
    fetchs.useFetch(handler);
  }
}

export default useFetch;