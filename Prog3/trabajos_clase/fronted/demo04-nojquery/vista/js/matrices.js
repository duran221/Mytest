'use strict';

import * as util from './utilidades.js';

export const generarMatrizValores = (filas = 10, columnas = 10) => {
    let matriz = new Array();

    for (let i = 0; i < filas; i++) {
        matriz[i] = [];
        for (let j = 0; j < columnas; j++) {
            matriz[i][j] = util.getRandomInt(-100, 100);
        }
    }
    return matriz;
}