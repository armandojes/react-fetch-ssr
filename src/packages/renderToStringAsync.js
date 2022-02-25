import ReacDomServer from 'react-dom/server.js';
import React from 'react';
import Provider from '../components/provider';
import createStatesServer from '../core/create_states_server';
import createFetchsServer from '../core/create_fetchs_server';


async function renderToStringAsync (react_app){
  const states = createStatesServer();
  const fetchs = createFetchsServer();
  const App_enhanced = () => (<Provider fetchs={fetchs} states={states}>{react_app}</Provider>);
  
  ReacDomServer.renderToString(<App_enhanced />);
  await fetchs.execute();
  states.set_collected();
  const content = ReacDomServer.renderToString(<App_enhanced />);
  const preloaded_states = states.getStates();
  return {content,  preloaded_states: `window.__SSR__STATES__=${JSON.stringify(preloaded_states)}`};
}

export default renderToStringAsync;