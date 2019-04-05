'use strict';

import * as util from './utilidades.js';
import * as matriz from './matrices.js';

//Para que me quede visible en toda parte referenciamos a nivel global con el objeto window
window.matriz = matriz;
window.util = util;

((doc, win) => {

    let menuPrincipal;
    let filaFormulario;

    const definirMatriz = () => { ////////////////////////
        $('#index-contenedor').cargar('./vista/html/formulario.html');
    }

    const resaltarPares = () => {
        console.log('Resaltar pares');
    };

    const resaltarImpares = () => {
        console.log('Resaltar impares');
    };

    const resaltarPrimos = () => {
        util.resaltarCeldas('tabla-matriz', util.esPrimo, '#e5e5e5'); /////////////////
    };

    let opciones = { ////////////////
        'menu-ir-a-inicio': () => window.location.href = 'index.html',
        'menu-btndefinir-matriz': definirMatriz,
        'menu-btnresaltar-pares': resaltarPares,
        'menu-btnresaltar-impares': resaltarImpares,
        'menu-btnresaltar-primos': resaltarPrimos,
        'menu-btnacercade': './vista/html/acercade.html'
    }

    doc.addEventListener('DOMContentLoaded', event => {

        $('#index-menu').cargar('./vista/html/menu.html', (contenedor) => {
            let elementosMenu = $('#menu-principal');
            menuPrincipal = M.Sidenav.init(elementosMenu);

            elementosMenu.addEventListener('click', (e) => {
                // obtener el enlace y el ID del enlace
                let enlace = e.target;
                let idEnlace = enlace.getAttribute('id');

                // si efectivamente es un enlace y tiene nombre ejecutar algo...
                if (enlace.nodeName.toLowerCase() === 'a' && idEnlace) {
                    util.gestionarOpciones(opciones, idEnlace);
                }
                e.preventDefault();
            }, false);
        });

    });

})(document, window);