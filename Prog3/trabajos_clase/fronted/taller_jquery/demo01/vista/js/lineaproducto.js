"use strict";


export default class LineaProducto{

    constructor(cantidad,precio){
        this._cantidad=cantidad;
        this._precio=precio;
    
    }


    get cantidad(){
        return this._cantidad;
    
    }

    get precio(){
        return this._precio;
    
    }

    set precio(precio){
        this._precio=precio;
    
    }

    set cantidad(cantidad){
        this._cantidad=cantidad;
    
    }
}