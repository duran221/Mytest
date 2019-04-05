"use strict";
export default class Vendedor{

    constructor(salario,comision,fecha_contratacion){

        this._salario=salario;
        this._comision=comision;
        this._fecha_contratacion=fecha_contratacion;

    }

    get salario(){
        return this._salario;

    }

    get comision(){

        return this._comision;
    }

    get fecha_contratacion(){

        return this._fecha_contratacion;
    }

    set fecha_contratacion(fecha){
        this._fecha_contratacion=fecha;
    }

    set salario(salario){
        this._salario=salario;

    }

    set comision(comosion){
        this._comision=comision;
    }
}