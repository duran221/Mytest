'use strict';

export default class DOMPruebas {


    /**
     * Metodo statico que formatea un texto ingresado para el id de un elemento del DOM
     * @param {String} id: selector css que identifica el elemento a buscar: 
     */
    static normalize(id) {
        //Normaliza una cadena eliminando espacios al principio y al final
        id = id.trim();
        if (id.charAt(0) !== '#') {
            id = '#' + id;
        }
        return id;
    }
    /**
     * Retorna un elemento del dom estableciendo como parametro un selector css
     * 
     * @param {String} id Elemento que se decea buscar.
     */
    static existe(id) {
        id = this.normalize(id);
        const elemento = document.querySelector(id);
        return (typeof(elemento) != 'undefined' && elemento != null);
    }


    /**
     * Si el elemento enviado es el body retorna falso, si es un elemento contenido retorna
     * si el elemento está contenido dentro del body.
     * @param {Elemento Nodo} nodo 
     */
    static existe2(nodo) {
        return (nodo === document.body) ? false : document.body.contains(nodo);
    }

    /**
     * Retorna un elemento proporcionando su id
     * @param {String} id selector css que identifica el id de un elemento. 
     */
    static getElemento(id) {
        id = this.normalize(id);
        return document.querySelector(id);
    }

    /**
     * Retorna el total de elementos hijos que contiene un contenedor
     * @param {String} tipoElemento tag que identifica el elemento  a consultar ejemplo: p-div-img-a 
     * @param {String-Nodo} contexto : Contenedor o elemento del cual se decea obtener los elementos que contiene 
     */
    static totalElementos(tipoElemento, contexto = document) {
        let contenedor = null;
        //Si el contexto es un String, busque el elemento identificado con ese nombre.
        if (typeof(contexto) === 'string') {
            contenedor = this.getElemento(contexto);
        } else {

            contenedor = contexto;
        }
        //Retorne la cantidad de elementos identificados con ese tag
        return contenedor.getElementsByTagName(tipoElemento).length;
    }

    /**
     * Retorna un String con el nombre del elemento contenedor, elemento 'padre' mas inmediato:
     * @param {String} tipoElemento selector css que se proporciona para buscar a su padre 
     */
    static hallarPadre1(tipoElemento){
        if(this.existe(tipoElemento)){
            let elemento= document.getElementById(tipoElemento);
            let padre= elemento.parentNode;
            return padre.tagName;
        }else{
            return "No se ha encontrado el elemento";
        }
    }


    /**
     *Retorna un String con el nombre del elemento contenedor, elemento 'padre' mas inmediato:

     * @param {String} tipoElemento Selector css 'id' que identifica el elemento a buscar
     */
    static hallarPadre2(tipoElemento){
        return this.existe(tipoElemento) ? document.querySelector(tipoElemento).parentNode.tagName : "No se encontraron conicidencias";

    }

    static retornarElementoHermanos(elemento){
        let listaHermanos= [];
        if(this.existe(elemento)){
            let padre= this.getElemento(elemento).parentNode;
            for(let i of padre.childNodes){
                if(i.id!=elemento && i.tagName!=undefined){
                    listaHermanos.push(i.id);
                }
            }
            return listaHermanos;
        }else{
            return "Elemento no encontrado";
        }
    }

    static retornarDescendencia(elemento){
        let listaDescendencia= [];
        if(this.existe(elemento)){
            let padre=this.getElemento(elemento)
            this._retornarDescendencia(padre,listaDescendencia);
            return listaDescendencia;
            
        }
    }
    
    static _retornarDescendencia(padre,listaDescendencia){
        if(padre.childElementCount>0){
            for(let i of padre.childNodes){
                if(i.tagName!=undefined){
                    listaDescendencia.push(i);
                    this._retornarDescendencia(i,listaDescendencia);
                }
            }
            
        }

    }




    /*
        es una X?
            es un input?
            es un div?
        getElementsByClassName
        getElementsByName
        Una solución basada en el DOM para reemplazar todas las ocurrencias de una palabra determinada, sin afectar los atributos
        Pasar a un objeto el contenido de las entradas de un formulario

    */
}