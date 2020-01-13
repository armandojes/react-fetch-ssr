function createFetchsServer (){
  const fetchs = {

    list_fetchs: [],

    /**
     * @params async function
     * @returns any
     * add a new handler to list_fetch
     */
    useFetch (handler){
      this.list_fetchs.push(handler);
    },

    /**
     * @params any
     * @returns promise
     * execute fetchs
    */
    async execute(){
      await Promise.all(this.list_fetchs.map(handler => handler()));
    } 
  }

  return fetchs;
}

export default createFetchsServer;