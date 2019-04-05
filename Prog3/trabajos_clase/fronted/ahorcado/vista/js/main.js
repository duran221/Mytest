'use strict';

import Ahorcado from './ahorcado.js';

((doc, win) => {

    doc.addEventListener('DOMContentLoaded', event => {

        let ahorcado = new Ahorcado();
        ahorcado.inicializarAplicacion();

        var listaCategorias = $('#index-categorias');
        var instances = M.FormSelect.init(listaCategorias);
    });

})(document, window);

/**
 * Permite usar el identificador $ como nombre de la función querySelector o querySelectorAll
 * Si se proporciona un segundo argumento true, se usa querySelectorAll, si no, se usa querySelector
 */
window.$ = (selector, all = false) => {
    if (all) {
        return document.querySelectorAll(selector);
    } else {
        return document.querySelector(selector);
    }
};