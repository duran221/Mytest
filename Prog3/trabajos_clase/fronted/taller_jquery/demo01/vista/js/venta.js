"use strict";


export default class Venta{

    constructor(codigo,iva){

        this._codigo_venta=codigo;
        this._iva=iva;

    }

    get codigo_venta(){

        return this._codigo_venta;

    }

    get iva(){

        return this.iva;
    }

    set codigo_venta(codigo){
        this._codigo_venta=codigo;
    }

    set iva(iva){
        this._iva=iva;

    }
    

}