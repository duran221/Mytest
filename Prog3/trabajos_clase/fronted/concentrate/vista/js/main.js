'use strict';

import Concentrese from './concentrese.js'; //#endregion

((document, win) => {

    document.addEventListener('DOMContentLoaded', event => {

        let concentrese = new Concentrese();
        concentrese.inicializarAplicacion();
    });

})(document, window);

/**
 * Permite usar el sidentificador $ como nombre de la función querySelector o querySelectorAll
 * Si se proporciona un segundo argumento true, se usa querySelectorAll, si no, se usa querySelector
 */
window.$ = (selector, all = false) => {
    if (all) {
        return document.querySelectorAll(selector);
    } else {
        return document.querySelector(selector);
    }
};