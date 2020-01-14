# react-fetch-ssr
react-fetch-ssr es una librería simple y liviana para crear aplicaciones web isomórficas, no es un framework de desarrollo completo como **NextJs** o **Gatsby**, por lo tanto la arquitectura de tu aplicación seguirá estando en tu completo control.

## ¿Que es una aplicación isomórfica o universal ?
Una aplicación web isomórfica es aquella que tiene la capacidad de ser renderizado en el lado del cliente y en el lado del navegador.
Por ejemplo cuando un usuario accede por primera vez a aplicación web isomórfica el render de las vistas ocurre en el lado del servidor y el navegador obtiene un **HTML** completo con todos los datos renderizados y el resto de la navegación ocurre en el lado del cliente.

## El problema con las aplicaciones web isomórficas
Entonces, ¿Si las aplicaciones web **isomorficas** son tan geniales porque no las implementa todo el mundo ? La respuesta a esta pregunta es porque el desarrollo de estas aplicaciones son a menudo muy complejas. 

El problema principal tiene que ver con el Fetch de datos hacia una **API**, es decir cuando un componente necesita conectarse a una **API** para obtener datos, y la verdad es que casi todas las aplicaciones web en el mundo real necesitan conectarse a una **API**.


El problema ocurre básicamente porque no tenemos una forma de conectarnos a una **API** desde los componentes en el lado del servidor, en el lado del cliente esto lo hacemos fácilmente con **componentDidMount** o **useEffect**, pero estos métodos no funcionan cuando el render ocurre en el servidor.

## Entendiendo el problema
Vamos entender mejor la naturaleza de este problema con un componente real simplificando bastante el código enfocándonos únicamente en el **fetch** de datos. Considera el siguiente componente: 
```jsx
  import React, {useEffect, useState} from 'react';
  import axios from 'axios';


  function ListShows (){
    const [shows, set_shows] = useState(null);
    
    async function fetchShows(){
      const response = await axios({...});
      set_shows(response.data);
    }
    
    useEffect(() => {
      fetchShows();
    },[]);

    if (shows) return (
      <ul>
        {shows.map( show => (
          <li key={show.id}>{show.title}</li>
        ))}
      <ul>
    );
    return (<div>Cargando shows...<div>);
  }
  
``` 
El componente anterior muestra un mensaje **"Cargando shows..."** mientras esperamos la respuesta del **API**, cuando dicha respuesta llegue el componente se actualiza mostrando una lista de títulos de los shows. Esto funciona perfecto en el lado del cliente pero no en el servidor.

Como se habrán dado cuenta  declaramos la función **fetchShows** primero y luego lo ejecutamos dentro de la función que le pasamos a **useEffect**, esto tiene que ser así debido a que la función que le pasamos a **useEffect** no puede ser asíncrona ya que las funciones asíncronas retornan una **promesa** y **useEffect** espera que retornemos una función normal para ejecutarla cuando el componente se desmonte o no retornar nada.

Ahora ¿ Que ocurre cuando renderizamos este componente en el servidor con **renderToString** ? Como ya te habrás imaginado el servidor solo renderiza el componente con el mensaje **"Cargando shows..."**, esto es porque el servidor no ejecuta **useEffect** y por lo tanto la petición al **API** nunca ocurre. 

Aunque **useEffect** se ejecute en el servidor no sería posible esperar la respuesta del API antes de renderizar el componente debido a que **renderToString** no es una función asíncrona. 

Pero este no es el comportamiento que esperamos, nosotros queremos que el servidor nos renderize el componente con la lista de shows obtenidos a través del **API**, ese el el objetivo de hacer render en el lado del servidor.

## Ahora ¿Cómo solucionamos este problema?
Para solucionar este problema hace falta inventarnos una forma de realizar peticiones al **API** que funcione de la misma forma en el lado del servidor y en el lado del cliente, además tenemos que conseguir que el servidor realizarse todas las peticiones al **API**, esperar a que se completen las peticiones  y renderizar nuestros componentes después de obtener los datos al **API**. Esto es justamente lo que hace **react-fetch-ssr**.

## Referencias el API:
**react-fetch-ssr** nos exporta únicamente 3 funciones nombradas: **useFetch**, **useState** y **renderToStringAsync**

### useFetch
```jsx
useFetch (async () => {/*conectarse al api aqui*/},[])
```
Recibe como parámetro requerido una función asíncrona que ha de completarse hasta que las peticiones al **API** finalicen.

En el lado del cliente esta función se comporta igual que **useEffect**, por defecto se ejecuta después de cada render del componente, podemos modificar este comportamiento pasándole como segundo parámetro un **array**, entonces solo se volverá a ejecutar cuando uno o más elementos del **array** hayan cambiado su valor, si solo queremos que se ejecute la primera vez podemos pasarle un **array** vacío, justo como **useEffect**.

con **useFetch** no podemos retornar una función que se ejecute cuando el componente se desmonte (como en **useEffect**), esto es porque la función que recibe  **useFetch** es asíncrona y por defecto las funciones asíncronas retorna una promesa, por lo que **useFetch** es exclusivamente para realizar peticiones al **API**.

En el lado del servidor se ejecutará primero **useFetch** y luego se renderiza el componente, gracias a **renderToStringAsync** podemos esperar que se complete primero **useFetch** antes de renderizar el componente. veremos más adelante como se usa **renderToStringAsync**.
 
 ### useState:
 ```jsx
const [state, setState] = useState(initialState);
 ```
Esta función es idéntica a la función **useState** de react, devuelve un valor con estado y una función para actualizarlo recibe como parámetro el estado inicial. En futuras actualizaciones siempre se devolverá el estado más actual  justo como la función **useState*** de react.

Usamos la función **useState**  propia de **react-fetch-ssr** esto nos permite mantener el estado de los componentes desde el servidor hacia al cliente.

**renderToStringAsync:**
```jsx
  const {content, states} = await renderToStringAsync(<MyApp />);
``` 
**renderToStringAsync** recibe como parámetro  la aplicación y retorna una promesa que es resuelto retornando un **objeto** con dos propiedades: **content** y **states**.


- **Content** es el HTML de la aplicación renderizado es lo equivalente al valor que nos retorna la función **renderToString** de react.
- **States** Es un script (javascript) que necesitamos enviarlo al cliente dentro de las etiquetas **< script >< /script >**  para poder mantener el estado de los componentes en el servidor al cliente. **states** contiene un array de estados de los componentes renderizados en el servidor. 

Es necesario colocar el script **states** antes del script de nuestra aplicación react, de esta forma cuando react comience a renderizar componentes en el cliente ya tendrá disponible el estado enviado por el servidor.

## instalación
Para instalar **react-fetch-ssr** corremos
```bash
npm install react-fetch-ssr
```
Podemos importarlo como funciones nombradas:
```jsx
import {useState, useFetch, renderToStringAsync} from 'react-fetch-ssr';
```
o podemos importarlo como un objeto que contiene las tres funciones:
```jsx
import reactFetchSsr from 'react-fetch-ssr';

```
## implementación 
Entonces para que nuestra aplicación pueda realizar peticiones al **API** de la misma forma en el lado del cliente y en el lado del servidor tenemos que seguir estas reglas.
- Usar la función **useState** propia de **react-fetch-ssr** en lugar de la función que nos exporta react.
- Realizar las peticiones al **API** usando **useFetch** en lugar de useEffect
- En el servidor usar la función **renderToStringAsync** en lugar de la función **renderToString** propia de react.

## Implementando en nuestro ejemplo anterior.
Hemos visto antes  el componente **ListShows**  con las funciones **useState** y **useEffect** propias de react, veamos cómo implementarlo con **react-fetch-ssr**.

Este es nuestro componente original:
```jsx
  import React, {useEffect, useState} from 'react';
  import axios from 'axios';


  function ListShows (){
    const [shows, set_shows] = useState(null);
    
    async function fetchShows(){
      const response = await axios({...});
      set_shows(response.data);
    }
    
    useEffect(() => {
      fetchShows();
    },[]);

    if (shows) return (
      <ul>
        {shows.map( show => (
          <li key={show.id}>{show.title}</li>
        ))}
      <ul>
    );
    return (<div>Cargando shows...<div>);
  }
``` 
Ahora con react-fetch-ssr
```jsx
  import React, from 'react';
  import axios from 'axios';
  import {useState, useFetch} from 'react-fetch-ssr';
  
  function ListShows (){
    const [shows, set_shows] = useState(null);
    
    useFetch(async () => {
      const response = await axios({...});
      set_shows(response.data);
    },[]);

    if (shows) return (
      <ul>
        {shows.map( show => (
          <li key={show.id}>{show.title}</li>
        ))}
      <ul>
    );
    return (<div>Cargando shows...<div>);
  }
``` 
El segundo ejemplo será renderizado desde el servidor con la lista de títulos de los shows, mientras que en el primer ejemplo solo renderizara el mensaje "Cargando shows..."

**Nota:** Como habrán notado en el ejemplo anterior cuando usamos **useFetch** no necesitamos declarar una función asíncrona primero y luego ejecutarlo como lo hacíamos con **useEffect**.

Esto es porque la función que le pasamos a **useFetch** es asíncrona y podemos usar **await** en el cuepo de la funcion directamente: 

```jsx
//con useEffect
async function fetchShows(){
  const response = await axios({});
  setState(response.data);
}
useEffect(() => {
  fetchShows();
},[]);


// con useFetch
useFetch(async () => {
  const response = await axios({});
  setState(response.data);
},[]);
```

## Código del servidor:
ahora veamos un ejemplo del código encargado de renderizar nuestra aplicación en el servidor. Nuevamente simplificando bastante y enfocándonos en la función encargado del render.

Este es un ejemplo clásico con express y renderToString.
```jsx
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import express from 'express';
import MyApp from './myApp';
import Markup from './markup';

const app = exress();

app.get('*', (request, response) => {
  const content = renderToString(<MyApp />);
  const full_html = renderToStaticMarkup(<Markup content={content }/>);
  response.send(full_html );
  response.end();
});
```
Ahora con **renderToStringAsync** de **react-fetch-ssr**:
```jsx
import {renderToStaticMarkup} from 'react-dom/server';
import {renderToStringAsync} from 'react-fetch-ssr';
import express from 'express';
import MyApp from './myApp';
import Markup from './markup';

const app = exress();

app.get('*', async (request, response) => {
  const {content, states } = await renderToStringAsync(<MyApp />);
  const full_html = renderToStaticMarkup(<Markup content={content } states={states}/>);
  response.send(full_html );
  response.end();
});
```

Veamos a detalle las diferencias:
- Ahora debemos usar una función asíncrona para manejar el **request**, esto para poder usar **await** y **renderToStringAsync**:
```jsx
  // antes
  app.get('*', (request, response) => {...});  
  
  //ahora
  app.get('*', async (request, response) => {...});
```
- **renderToStringAsync** nos devuelve una promesa que será resuelto con un objeto con dos propiedades: **content** y **states** donde content es la cadena HTML de nuestra aplicación renderizada y states un **script** con los estados de los componentes renderizados en el servidor.
```jsx
  //Antes
  const content = renderToString(<MyApp />);

  //Ahora 
  const {content, states} = await renderToStringAsync(<MyApp />);
```

Ahora tenemos tenemos que inyectar el estado de los componentes devuelto por **renderToStringAsync** en el HTML que enviamos al cliente.
```jsx
  //Antes
  const full_html = renderToStaticMarkup(<Markup content={content} />);

  //Ahora
  const full_html = renderToStaticMarkup(<Markup content={content} states={states} />);
```
## ¿Qués Markup y renderToStaticMarkup ?
**Markup** es el html básico que envuelve nuestra aplicación react, es equivalente al **index.html** en una **SPA**, 

En el servidor necesitamos inyectar el código HTML generado por **renderToString** o **renderToStringAsync** dentro de nuestro HTML contenedor y tenemos dos formas de hacerlo: 
- crear **Markup** como un componente de react 
- crear **Markup** como una función simple.

### Markup como un componente 
Este es un componente básico contenedor
```jsx
  function Markup (props){
    return (
      <html  lang="en">
        <head>
          <link  rel="stylesheet" href="/styles.css">
          <title>my title</title>
        </head>
        <boy>
          <div id="render_target" dangerouslySetInnerHTML={{__html: props.content}}></div>
          <script  src="/bundle.js"></script>
        </body>
      </html>
    )
  }
```
Este componente **Markup** recibe como **prop** el contenido de nuestra aplicación devuelto por  **renderToStaringAsync** e inyecta dentro de las etiquetas **div** con id **"render_target"**

**Nota:** usamos la propiedad **dangerouslySetInnerHTML** porque react por defecto escapa las cadenas HTML por ejemplo esto
```jsx
 <div id="render_targte">{props.content}</div>
```
Haría que el HTML se lea literalmente en pantalla como texto plano, para evitar esto debemos usar **dangerouslySetInnerHTML**  asi:
```jsx
 <div id="render_target" dangerouslySetInnerHTML={{__html: props.content}}></div>
```

Ahora ¿como sincronizamos el estado del servidor al cliente? simplemente debemos colocar el script **states** justo antes de cargar nuestra **bundle.js**, debemos colocarlo entre las etiquetas **< script  >** y usando **dangerouslySetInnerHTML** para que react no lo escapee!
```jsx
<body>
  <div id="render_target" dangerouslySetInnerHTML={{__html: props.content}}></div>
  <script dangerouslySetInnerHTML={__html: props.states}></script>
  <script  src="/bundle.js"></script>
</body>
```

Ahora solo debemos renderizarlo de la siguiente forma
```jsx
 const full_html = renderToStaticMarkup(<Markup content={content} states={states} />);
```
### Markup como una función
Ahora veamos un ejemplo con una función simple, 
```javascript
function markup (content, states){
  return 
  `<html  lang="en">
    <head>
      <link  rel="stylesheet" href="/styles.css">
      <title>my title</title>
    </head>
    <boy>
      <div id="render_target" >${content}</div>
      <script>${states}</script>
      <script  src="/bundle.js"></script>
    </body>
  </html>`;
}
```
Con una función no necesitamos usar **dangerouslySetInnerHTML** ni **renderToStaticMarkup** ya que no es un componente de react si no una función que retorna un string.

Lo ejecutamos de la siguiente forma:
```jsx
 const full_html = markup(content, states);
```


## ¿ Porque necesitamos enviar el estado del servidor al cliente ?
Cuando renderizamos nuestra aplicación en el servidor obtenemos como resultado un string HTML y lo enviamos al cliente, en el lado del cliente React va a volver a renderizar los componentes con el estado inicial sin memorizar el estado que tenía los componentes en el servidor, generando como resultado un HTML diferente, en estos casos react va a descartar el HTML del servidor y volverá a generar todo desde cero en el lado del cliente.

Veamos este comportamiento en código usando nuestro ejemplo anterior **ListShows**
```jsx
  function ListShows (){
    const [shows, set_shows] = useState(null);
    
    useFetch(async () => {
      const response = await axios();
      set_shows(response.data);
    },[]);

    if (shows) return (
      <ul>
        {shows.map( show => (
          <li key={show.id}>{show.title}</li>
        ))}
      <ul>
    );
    return (<div>Cargando shows...<div>);
  }
```
¿ Que ocurre en el servidor ?
- **renderToStringAsync** detectará que estamos usando **useFetch** dentro del componente, ejecutará dicha función y esperará que se complete.
- Cuando la petición al  **API** finalice se ejecutará **set_shows** actualizando la variable **shows** de **null** a un **array** de shows que es lo que respondió nuestra **API**.
- Finalmente el componente será renderizado con el nuevo valor de la variable  **shows**.

### ¿ Ahora que ocurre en el lado del cliente ?
- El HTML generado en el servidor será pintado en pantalla (Lista de shows)
- El navegador descargará el **script** nuestra aplicación  (bundle.js)
- **React.hydrate** volverá a procesar nuestro componente **ListShows** con el estado inicial que en esta caso es **null** generando como resultado un HTML con el mensaje "Cargando shows", un HTML diferente al generado por el servidor. 
- Esto ocasionará que react descarte el resultado generado por el servidor renderizando todo de nuevo desde el navegador.

Este es un comportamiento que queremos evitarlo, para conseguir que el html que se genera en el cliente sea idéntico al html generado en el servidor tenemos guardar el estado de los componentes en el servidor y enviarlo al cliente.

En el caso de nuestro componente **ListShows** tenemos que hacer que la variable **shows** tenga como valor inicial en el lado del cliente un **array** de **shows**, que es el valor que tenía en el servidor.

### ¿ Como enviamos el estado de los componentes del servidor al cliente ? 
Esto es justamente lo que hace el script **states** retornado por **renderToStringAsync** como ya hemos visto en ejemplos anteriores, **react-fetch-ssr** se encarga de serializar el estado de los componentes en el servidor e hidratarlo en el cliente...

## compatible con react-router
Esta librería ha sido desarrollado para trabajar de la mano con **react-router** y este es una de las grandes ventajas, ya que no necesitas usar **react-router-config** y declara rutas estáticas, puedes seguir desarrollado con los componentes **Switch** y **Route**

### Ejemplo de uso básico con react-router
- App.jsx
```jsx
import React from  'react';
import {Route, Switch} from  'react-router-dom';

//pages
import ListShows from  './pages/list_shows';
import ShowDetail from  './pages/showdetail';

function  App  (){
  return (
    <Switch>
      <Route  path="/list"  exact  component={ListShows} />
      <Route  path="/showdetail/:id"  exact  component={ShowDetail} />
    </Switch>
  )
}

export  default App;
```
- server.js
```jsx
import express from  'express';
import {renderToStaticMarkup} from  'react-dom/server';
import Markup from  './markup';
import React from  'react';
import App from  './app';
import {StaticRouter} from  'react-router';
import {renderToStringAsync} from  'react-fetch-ssr';

const server =  express();

server.get('*',  async  (request,  response)  => {

  const context = {};
  const {content, states} =  await  renderToStringAsync(
    <StaticRouter  location={request.url} context={context}>
      <App  />
    </StaticRouter>
  );

  const full_html =  renderToStaticMarkup(<Markup  content={content} states={states} />);
  response.send(full_html);
  response.end();
})

server.listen(3000);
```
## Contribuyendo
Este paquete aún esta en una etapa muy tempranas. Participe, siéntase libre de criticarlo, ofrezca soluciones que puedan cambiar ligeramente su enfoque o solicite ejemplos sobre cómo desea usarlo. 


 
