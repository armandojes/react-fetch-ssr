import isDom from '../helpers/is_dom';
import React from 'react';
import useSsrContext from '../hooks/useContext';


function useFetch(handler, deps){
  
  if (isDom){
    return deps
    ? React.useEffect(() => {handler()}, deps)
    : React.useEffect(() => {handler()});
  }
  else {
    const {fetchs} = useSsrContext();
    fetchs.useFetch(handler);
  }
}

export default useFetch;