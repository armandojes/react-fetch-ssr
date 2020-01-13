try {
  var is_dom = window ? true : false;
} catch (error) {
  var is_dom = false
}

export default is_dom;