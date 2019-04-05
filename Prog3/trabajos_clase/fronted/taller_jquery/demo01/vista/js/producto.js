"use strict";


export default class Producto{

    constructor (id,color,descripcion){

        this._id=id;
        this._color=color;
        this._descripcion=descripcion;
        this._stock=10;

    }

    get id(){
        return this._id;
    }

    get color(){
        return this._color;
    }

    get descripcion(){
        return this._descripcion;
    }

    set id(id){
        this._id=id;
    }

    set color(color){
        this._color=color;
    }

    set descripcion(descripcion){
        this._descripcion=descripcion;
    }

    get _stock(){
        return this._stock;
    }

    set stock(){
        this._stock=stock;
    }


}