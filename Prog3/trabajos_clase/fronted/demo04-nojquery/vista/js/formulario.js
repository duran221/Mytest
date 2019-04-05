'use strict';

((doc, win) => {

    const generarMatriz = () => {
        let error = '';

        let filas = Number($('#frm-txtfilas').value);
        if (isNaN(filas) || filas < 2) {
            error = 'Se espera un número de filas superior a 1';
        }

        let columnas = Number($('#frm-txtcols').value);
        if (isNaN(columnas) || columnas < 2) {
            error += '<br>Se espera un número de columnas superior a 1';
        }

        if (error) {
            util.mensaje(error);
        } else {
            $('#index-contenedor').cargar('./vista/html/matriz.html', function(contenedor) {
                const m = matriz.generarMatrizValores(filas, columnas);
                util.crearTabla('matriz-contenedor', 'tabla-matriz', m, 'centered');
                $("#matriz-titulo").innerHTML = `Matriz de ${filas} x ${columnas}`;
            });
        }
    }

    $('#frm-btngenerar-matriz').addEventListener('click', e => {
        generarMatriz();
    });

})(document, window);