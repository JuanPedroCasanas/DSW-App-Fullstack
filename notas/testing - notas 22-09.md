
- tipos de tests
    - unitario -> se hace a una pieza de codigo de manera aislada
        - un componente, un servicio, un provider
        - se pide para el tp
    - integracion -> se testea un conjunto de piezas
        - testing mas conjunto de todas las partes que usa ese componente/servicio en particular
        - mas abarcativo que el aislado
    - e2e - end to end - se testea un flujo completo funcional

github.com/utnfrrodsw/react -> repo del profe
    - read me con pasos a seguir para testear en JEST
    - jest es tmb para backend

    - "test" : "jest"

- en index.html de la carpeta coverage - icov-report -> se muestra todo lo del cmd
- el nombre.jsx al lado del nombre.test.jsx
- extension jest runner -> sirve para correr el test desde el archivo nombre.test.jsx

github.com/utnfrrodsw/react/blob/main/react-testing/src/components/SimpleComponent/SimpleComponent.test.jsx

- jest.useFakeTimers(); -> OJO!! usar para cosas que requieren simular tiempo


