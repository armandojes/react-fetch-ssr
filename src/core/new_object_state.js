/**
 * @params initialState,
 * @return {state, updater}
 * create a new objectState with updater
**/

function newObjectState(initial_state){
  const state_created = {
    state: initial_state,
    updater(new_state){
      typeof(new_state) === 'function'
      ? state_created.state = new_state(state_created.state)
      : state_created.state = new_state;
    }
  }
  return state_created;
}

export default newObjectState;