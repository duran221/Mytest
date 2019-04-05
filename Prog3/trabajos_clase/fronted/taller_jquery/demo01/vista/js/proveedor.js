"use strict";


export default class Proveedor{

    constructor(telefono,direccion){
        this._telefono=telefono;
        this._direccion=direccion;


    }

    get telefono(){

        return this._telefono;
    }

    get direccion(){

        return this._direccion;
    }

    set telefono(telefono){
        this._telefono=telefono;
    
    }

    set direccion(direccion){
        this._direccion=direccion;
    }
    
}