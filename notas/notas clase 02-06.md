########### REACT ###########
https://react.dev

- react -> SPA: single page application
- es libreria -> no framework

- exportar:
    numbers.js
        const E = 'holaa';
        const pi = 3.14;
        export const pi2 = 3.14;
        export {pi};
    
    calc.js
        import {pi} from '.numbers.js';

- otra forma de exportar:
    export default App -> import App from './App.jsx';
        recomendado, buena practica

PoC -> prueba de concepto -> la exposicion oral


fe -> api -> bd
api: express
node v22.16.0 -> npm
nodeman
debugger de vscode

npm init -> para arrancar un proyecto de node
npm start -> para arrancar el proyecto
npm i -> no hace falta subir el node-modules (se puede poner en gitignore)
    -> la otra persona hace npm i y le instala todo, solo con el packi json
npm run dev


-src
    -controllers
    -routes -> definir los endpoints de entrada -> https://expressjs.com/en/starter/basic-routing.html
    -services -> trabajan sobre la base de datos
    -helpers
    -middlewares
    -app.js
    -server.js
- otra forma
    - middleware
    - modulos
        - producto
            - controllers, routes, services
    - helpers


- los controladores hacen uso de servicios
    - rutas -> controladores -> servicios