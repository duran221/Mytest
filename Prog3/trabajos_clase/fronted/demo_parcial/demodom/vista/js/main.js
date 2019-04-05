'use strict';

import DOMPruebas from './dom-pruebas.js';

((doc, win) => {

    doc.addEventListener('DOMContentLoaded', event => {
        console.log('Cargado el contenido del DOM');

        console.log(DOMPruebas.existe('div1'));
        console.log(DOMPruebas.totalElementos('div'));
        console.log(DOMPruebas.totalElementos('div', 'div0'));


        console.log(DOMPruebas.existe2(doc.getElementById('div1')));

        console.log(DOMPruebas.totalElementos("div",'div0'));

        console.log(DOMPruebas.hallarPadre2("#div1"));

        console.log(DOMPruebas.hallarPadre1("parrafo1"));

        console.log(DOMPruebas.retornarElementoHermanos("main"));

        console.log(DOMPruebas.retornarDescendencia("body"));
    });

    console.log('Cargada la función anónima principal');


})(document, window);