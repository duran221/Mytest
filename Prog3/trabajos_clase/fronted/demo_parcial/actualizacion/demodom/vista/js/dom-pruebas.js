'use strict';


export default class DOMPruebas {

    /**
     * Devuelve true si se encuentra un elemento con el ID dado como argumento
     * @param {String} id El id del elemento a buscar
     */
    static existeElemento(id) {
        const elemento = $(id);
        return (typeof(elemento) != 'undefined' && elemento != null);
    }

    /**
     * Devuelve el total de elementos de un determinado tipo que se encuentran
     * dentro de un contenedor dado como segundo argumento
     * @param {String} tipoElemento El tipo de elemento a buscar ('input', 'div', 'textarea', ...)
     * @param {String} contenedor El elemento contenedor en el que se buscará. Puede ser un nodo o lo referenciado por un selector CSS
     */
    static totalElementos(tipoElemento, contenedor = document) {
        if (typeof(contenedor) === 'string') {
            contenedor = $(contenedor);
        }
        return contenedor.getElementsByTagName(tipoElemento).length;
    }

    /**
     * Devuelve el número de hijos director de determinado tipo, existentes en un contenedor
     * @param {*} contenedor El ID del contenedor donde se buscarán los hijos directos
     * @param {*} tipoElemento El tipo de elemento a buscar ('input', 'div', 'textarea', ...)
     */
    static totalHijosDirectos(contenedor, tipoElemento) {
        return document.querySelectorAll(`${contenedor} > ${tipoElemento}`).length;
    }

    /**
     * Un simple ejemplo de cómo asignar contenido HTML en las celdas de una tabla
     * @param {String} idTabla El ID de la tabla que se alterará
     */
    static reemplazarContenidoTabla(idTabla) {
        let k = 0;
        let imagenes = ['eye.png', 'shaka-SIGNOOOO.png', 'slideshare-logo.png'];
        // let tabla = this.getElemento(idTabla);
        let tabla = $(idTabla);

        for (let i = 1, fila; fila = tabla.rows[i]; i++) {
            for (let j = 0, celda; celda = fila.cells[j]; j++) {
                // la siguiente línea muestra el contenido actual de las celdas
                console.log(`Valor[${i}, ${j}] = ${celda.innerHTML}`);
                // enseguida se cambia los textos por defecto, por imágenes
                celda.innerHTML = `<img src="./vista/images/${imagenes[k]}" alt="img[${i}, ${j}]" width="64" height="64"/>`;
                k++;
                if (k === imagenes.length) {
                    k = 0;
                }
            }
        }
    }

    /*
        Funciones sugeridas para implementar:
        - Función que retorne un array de todos los elementos de determinado tipo dado como argumento, en determinado contenedor
        - Función que reemplace cierta incidencia de texto por un nuevo texto, ambos dados como argumentos.
        - Función que retorne un objeto cuyos atributos corresponden a todas las entradas de datos dadas en un formulario.
        - Función que aplique una clase CSS cuyo nombre se da como argumento a los elementos hijos de un elemento dado
          como argumento
        - Devolver el número de elementos 
        - Función que liste el texto de todas las etiquetas anchor a las que aún no se les ha dado click y que forman parte de 
          un contenedor determinado
        - Observe lo que hay en "main.js" a partir de la línea 65

        Documentos sugeridos:
        - https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/
        - https://vanillajstoolkit.com/helpers/
        - http://eloquentjavascript.net/  <<
        - https://plainjs.com/javascript/
        - https://code.tutsplus.com/es/tutorials/the-30-css-selectors-you-must-memorize--net-16048
        - https://stackoverflow.com/questions/11455515/how-to-check-whether-dynamically-attached-event-listener-exists-or-not
    */

}