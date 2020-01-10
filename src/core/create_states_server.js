import newObjectState from './new_object_state';
import { useState } from 'react';

function createStatesServer(){
  const states = {
    list_states: [],
    state_index: 0,
    collected: false,

    /**
     * @params initial_state
     * @returns [state, updater]
     * create a new state and add to list_states
     * private function
    **/
    newState(initial_state){
      const state_created = newObjectState(initial_state);
      this.list_states.push(state_created);
      return [state_created.state, state_created.updater];
    },


    /**
     * @params initial_state
     * @returns [state, updater]
     * return latest state if exist or create a new state
    **/
    getState(initial_state){
      const currect_state = this.list_states[this.state_index];
      this.state_index++;
      return currect_state
      ? [currect_state.state, currect_state.updater]
      : this.newState(initial_state);
    },

     /**
     * @params initial_state
     * @returns [state, updater]
     * create a new state and add to list_states
    **/
    useState(initial_state){
      return this.collected 
      ? this.get_state(initial_state)
      : this.newState(initial_state);
    },


    /**
     * @param any
     * @returns any
     * define collected true
    **/
    set_collected(){
      this.collected = true;
    },
    

    /**
     * @params any
     * @return array of latest global state
     */
    getStates(){
      return this.list_states.map(object_of_state => object_of_state.state);
    }

  }

  return states;
}

export default createStatesServer;