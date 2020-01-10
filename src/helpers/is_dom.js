function isDOM(){
  try{
    var key;
    while(localStorage[key='detect-dom-'+Math.random()]) ;
    localStorage[key]=1;
    return localStorage[key]!==1;
  }catch(err){
    return false;
  }
}

export default isDOM;