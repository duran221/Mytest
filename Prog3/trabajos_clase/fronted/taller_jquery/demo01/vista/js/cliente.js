"use strict";

export default class Cliente{

    constructor(ciudad,codigo_postal,correo){

        this._ciudad=ciudad;
        this._codigo_postal=codigo_postal;
        this._correo=correo;


    }

    get ciudad(){

        return this._ciudad;

    }

    get codigo_postal(){
        return this._codigo_postal;

    }

    get correo(){
        return this._correo;

    }

    set ciudad(ciudad){
        this._ciudad=ciudad;

    }

    set codigo_postal(codigo_postal){
        this._codigo_postal=codigo_postal;

    }

    set correo(correo){
        this._correo=correo;
    }
}