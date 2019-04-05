"use strict";

export default class Proceso{

    constructor(infoPrograma){
        console.log("hola");
        //la lista almacena alguna informacion del programa.
        this.infoPrograma=[];
        //Linea donde ha quedado el programa en ejecución antes de ser expropiado.
        this.lineaEjecucion=0;
        //Valor actual del acumulador al momento de ser expropiado
        this.acumulador_actual;
        

        
    }
}