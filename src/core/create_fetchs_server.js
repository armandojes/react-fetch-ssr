function createFetchsServer (){
  const fetchs = {
    list_fetchs = [],


    /**
     * @params async function
     * @returns any
     * add a new handler to list_fetch
     */
    useFetch (handler){
      this.list_fetchs.push(async () => {
        try {
          await handler();
        } catch (error) {
          if (process.env.NODE_ENV !== 'production')
          console.log(error);
        }
      });
    },


    /**
     * @param async function
     * @returns any
     * execute fetchs
    */
    async execute(){
      await Promise.all(this.list_fetchs.map(handler => handler()));
    } 
  }

  return fetchs;
}