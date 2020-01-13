// function isDOM(){
//   try{
//     var key;
//     while(localStorage[key='detect-dom-'+Math.random()]) ;
//     localStorage[key]=1;
//     return localStorage[key]!==1;
//   }catch(err){
//     return false;
//   }
// }
try {
  var is_dom_test = window ? true : false;
} catch (error) {
  var is_dom_test = false
}

export default is_dom_test;