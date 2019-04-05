'use strict';

var verLog = true;

/**
 * Muestra un mensaje de error por consola y al usuario
 * @param {String} mensajeLog el mensaje que aparece por consola
 * @param {String} mensajeUsuario el mensaje que se da al usuario. Si se omite se utiliza mensajeLog
 * @param {boolean} depurar activa o desactiva la visualización por consolas
 */
export const mensaje = (mensajeLog, mensajeUsuario = mensajeLog, depurar = verLog) => {
    if (depurar) {
        console.error(mensajeLog);
    }
    M.toast({
        html: mensajeUsuario,
        classes: 'red darken-4'
    })
}

/**
 * Devuelve un número aleatorio entre min (inclusive) y max (inclusive)
 * ¡Usar Math.round() te dará una distribución no uniforme!
 * Ver: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 * @param {int} min 
 * @param {int} max 
 */
export const getRandom = (min, max) => Math.random() * (max - min) + min;

/**
 * Devuelve un entero aleatorio entre min (inclusive) y max (inclusive)
 * ¡Usar Math.round() te dará una distribución no uniforme!
 * Ver: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 * @param {int} min 
 * @param {int} max 
 */
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * calcula si un número dado como argumento es primo, disminuyendo la complejidad del algoritmo de O(n)a O(sqrt(n))
 * https://grupos.emagister.com/debate/_existen_numeros_primos_negativos_/1023-797436 (<< ¿primos?)
 * @param {*} numero 
 */
export const esPrimo = numero => {
    if (numero < 0) {
        return NaN;
    }

    for (let i = 2, valor = Math.sqrt(numero); i <= valor; i++) {
        if (numero % i === 0) {
            return NaN;
        }
    }
    return numero !== 1 && numero !== 0 ? numero : NaN;
}


/**
 * Elimina un elemento del DOM
 * @param {String} selector El nombre del elemento a eliminar (use notación de selectores CSS)
 */
export const eliminarElementoDOM = selector => {
    let elemento = $(selector);
    if (elemento) {
        elemento.parentNode.removeChild(elemento);
    }
}

/**
 * Demuestra como gestionar eventos sobre las celdas de una tabla, de igual manera podría probarse otros eventos como:
 * mousedown, mouseup, mousemove, click, dblclick, mouseout, mouseenter, mouseleave y contextmenu
 * @param {*} idTabla el ID de la tabla 
 */
export let mouseOverCell = (idTabla) => {
    let filas = doc.getElementById(idTabla).rows;

    for (let i = 0; i < filas.length; i++) {
        let celdasFila = filas[i].cells;
        for (let j = 0; j < celdasFila.length; j++) {
            let celda = celdasFila[j];
            celda.addEventListener('mouseover', () => {
                console.log(`mouseover sobre [${i}, ${j}]`);
            })
        }
    }
}

export let resaltarCeldas = (idTabla, filtro, color) => { /////////////////
    let tabla = document.getElementById(idTabla);
    if (tabla && tabla.nodeName == "TABLE") {
        let filas = document.getElementById(idTabla).rows;

        for (let i = 0; i < filas.length; i++) {
            let celdasFila = filas[i].cells;
            for (let j = 0; j < celdasFila.length; j++) {
                // let valor = Number(celdasFila[j].innerHTML);
                let valor = Number(celdasFila[j].innerText);
                if (!isNaN(filtro(valor))) {
                    celdasFila[j].style.backgroundColor = color;
                }
            }
        }
    } else {
        mensaje(`No existe una tabla con ID '${idTabla}'`);
    }
}

/**
 * Crear una tabla en un elemento del DOM a partir de un array
 * @param {String} idContenedor El ID del elemento que contendrá la tabla
 * @param {String} idTabla El ID con el que se creará la tabla
 * @param {Array} elementos Un array bidimensional de elementos 
 * @param {String} estilo Nombre opcional de una clase CSS para aplicar a la tabla
 */
export let crearTabla = (idContenedor, idTabla, elementos, estilo = 'highlight') => {
    let tabla = document.getElementById(idTabla);

    if (!tabla) {
        let contenedor = document.getElementById(idContenedor);
        tabla = document.createElement('table');
        tabla.setAttribute('id', idTabla);
        contenedor.appendChild(tabla); // agregar la tabla al idContenedor
    } else {
        tabla.innerHTML = "";
    }

    elementos.forEach(fila => {
        let tr = tabla.insertRow(); // crear una nueva fila

        fila.forEach(columna => {
            let td = tr.insertCell(); // crear una celda en una fila
            td.innerText = columna; // También se puede usar innerHTML
        });
    });

    if (estilo) { // si se proporciona el última argumento, agregar el estilo
        tabla.classList.add(estilo);
    }
    return tabla;
};

/**
 * Ejecuta una acción de la aplicación con base a una opción indicada como argumento
 * Normalmente la opción corresponderá al nombre de una página que debe cargarse
 * @param {string} opcion un ID de las opciones del menú 
 */
export let gestionarOpciones = (opciones, opcion) => { //////////////////////////

    if (opcion === 'opc-salir') {
        window.location.href = 'index.html'
    } else {
        if (opcion in opciones) {
            if (typeof opciones[opcion] === 'function') {
                opciones[opcion]();
            } else {
                $('#index-contenedor').cargar(opciones[opcion], function(contenedor) {
                    if (status === "error") {
                        let log = `Error '${xhr.status}': '${xhr.statusText}'. Sucedió en main.gestionar(), opción '${opcion}' al cargar '${opciones[opcion]}'`;
                        mensaje(log, 'No se pudo acceder a la opción');
                    }
                });
            }
        } else {
            let log = `La opción con ID '${opcion}' no está referenciada en el objeto opciones de la función 'gestionar(opcion)'`;
            mensaje(log, 'La opción no está disponible');
        }
    }
}

/**
 * permite obtener una promesa con recursos de forma asíncrona por el canal HTTP
 * @param {String} url La dirección a la que se envía la petición.
 * @param {Object} data Opcional. Un objeto para enviar argumentos.
 */
export const fetchData = async(url, data = {}) => {
    if ('body' in data) {
        data.body = JSON.stringify(data.body);
    }
    const respuesta = await fetch(url, data);
    if ('type' in data) {
        return await respuesta[data.type]();
    }
    return await respuesta.json();
}