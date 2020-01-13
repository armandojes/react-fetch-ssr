import isDom from '../helpers/is_dom';

if (isDom){
  var client_states = {
    preloaded_state: window.__SSR__STATES__ || [],
    state_index: 0,

    getState(){
      const current_state = this.preloaded_state[this.state_index] 
        ? this.preloaded_state[this.state_index]
        : null;
      this.state_index++;
      return current_state
    }
  };
} else {
  var client_states = null;
}

export default client_states;