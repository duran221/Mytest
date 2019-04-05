"use strict";

export default class Proceso{

    constructor(infoPrograma){
        console.log("hola");
        //la lista almacena alguna informacion del programa.
        this.infoPrograma=infoPrograma;
        //Linea donde ha quedado el programa en ejecución antes de ser expropiado.
        this.lineaEjecucion=0;
        //Valor actual del acumulador al momento de ser expropiado
        this.acumulador_actual;
        //vector que contiene las instrucciones de el procesito para ser ejecutadas.
        this.copiaInstrucciones=[];
        this.longitudPrograma=0;
        //Este array contiene la información de copiaInstrucciones, pero ya lista para ser ejecutada
        this.arrayFormateado=[];



        
    }
}