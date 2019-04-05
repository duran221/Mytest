"use strict";

export default class Persona {

    constructor(cedula, nombre, apellido, telefono) {
        this._documento = cedula;
        this._nombre = nombre;
        this._apellido = apellido;
        this._telefono = telefono;
    }

    get documento() {
        return this._documento;
    }

    get nombre() {
        return this._nombre
    }

    get apellido() {
        return this._apellido;
    }
    get telefono() {
        return this._telefono;
    }

    set documento(docume) {
        this._documento = docume;
    }

    set nombre(nombre) {
        this._nombre = nombre;
    }

    set apellido(apellido) {
        this._apellido = apellido;
    }

    set telefono(telefono) {
        this._telefono = telefono;
    }

    getInformacion() {
        return `Documento: ${this._documento}, Nombre: ${this._nombre}, Apellido: ${this._apellido},${this._telefono}`;
    }

}