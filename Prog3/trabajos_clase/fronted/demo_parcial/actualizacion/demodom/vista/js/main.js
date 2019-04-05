'use strict';

import DOMPruebas from './dom-pruebas.js';

((doc, win) => {

    doc.addEventListener('DOMContentLoaded', event => {

        console.log('Cargado el contenido del DOM');

        let texto = `¿Existe un elemento con ID = 'div1'? => ${DOMPruebas.existeElemento('#div1')}\n`;
        texto += `Total de elementos DIV en 'document' => ${DOMPruebas.totalElementos('#div')}\n`;
        texto += `Total de elementos DIV en 'div0' => ${DOMPruebas.totalElementos('div', '#div0')}\n`;
        texto += `Total de elementos DIV hijos directos de 'div0' => ${DOMPruebas.totalHijosDirectos('#div0', 'div')}`;

        DOMPruebas.reemplazarContenidoTabla('#tabla-imagenes');

        let txtArea = $('#txtDOM');
        txtArea.innerHTML = texto;
        M.textareaAutoResize(txtArea);
        M.updateTextFields();

        $('#btn-hacer-algo').addEventListener('click', event => {
            M.toast({ html: '¿Qué quieres que haga?' });
        });

        $('#btn-prueba2').addEventListener('click', event => {
            console.log('clic en btn-prueba2');
        });

        $('#btn-prueba2').addEventListener('mousedown', event => {
            console.log('MouseDown en btn-prueba2');
        });

        $('#btn-prueba3').addEventListener('mousedown', event => {
            console.log('MouseDown en btn-prueba3');
        });

        $('#btn-comprobar').addEventListener('click', event => {
            let eventos = $('#btn-hacer-algo').getEventListeners();
            console.log('btn-hacer-algo', eventos);

            eventos = $('#btn-prueba1').getEventListeners();
            console.log('btn-prueba1', eventos);

            eventos = $('#btn-prueba2').getEventListeners();
            console.log('btn-prueba2', eventos);

            let boton = $('#btn-prueba3');
            console.log('resultados con getEventListeners', boton.getEventListeners()); // <<<
            console.log('resultados con getEventHandlers', boton.getEventHandlers('onclick')); // <<<
            console.log('resultado con getEvents', boton.getEvents()); // <<<

            if (Object.keys(eventos).length) {
                M.toast({ html: `'${boton}' tiene asociados eventos` });
            } else {
                M.toast({ html: `'${boton}' &nbsp;<u>no</u>&nbsp;tiene asociados eventos` });
            }
        })

    });

    console.log('Cargada la función anónima principal');

    /**
     * querySelector al estilo jQuery
     * @param {*} selector Use '.class', '#id', 'etiqueta' o cualquier selector tipo CSS
     * Ejemplo: $('#idElemento')
     */
    window.$ = function(selector) {
        return document.querySelector(selector);
    };

})(document, window);