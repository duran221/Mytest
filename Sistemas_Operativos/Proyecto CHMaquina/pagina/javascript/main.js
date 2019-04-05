
"use strict";

import ChMaquina from './chmaquina.js';

(document =>{

    document.addEventListener("DOMContentLoaded",evt =>{

        //Instancie el objeto chMaquina:
        let chmaquina= new ChMaquina();

        
        //////////////////////////////Encendido del sistema://///////////////////////////////////////////7    
        //Obteniendo referencia del boton 'On':
        let btnOn = document.querySelector("#btnOn");
        //Agregando un evento tipo click cada vez que se teclee el boton 'on':
        btnOn.addEventListener("click", chmaquina.encenderSistema);


        //////////////////////////////Apagado del sistema://///////////////////////////////////////////7    
        //Obteniendo referencia al boton 'Off'
        let btnOff = document.querySelector("#btnOff");
        btnOff.addEventListener("click", chmaquina.apagarSistema);


        //////////////////////////////Ejecución Paso a paso://///////////////////////////////////////////7    
        let btnPasoPaso = document.querySelector("#btnEjecutarP");
        let btnSiguiente = document.querySelector("#btnSiguiente");
        btnPasoPaso.addEventListener('click', chmaquina.pasoAPaso);
        btnSiguiente.addEventListener('click', chmaquina.pasoAPaso);


        //////////////////////////////Ejecución Corrida del programa://///////////////////////////////////////////7    
        let btnEjecutar = document.querySelector("#btnEjecutar");

        //Creando el evento que escucha cuando se da click sobre el boton Ejecutar:
        btnEjecutar.addEventListener("click", evt => {
        //Si es true es porque el programa se va a ejecutar:
        chmaquina.instruccion = true;
        chmaquina.enviarTexto();
        alert("Ejecucion terminada satisfactoriamente");

        });


        //////////////////////////////Cargar en memoria el programa://///////////////////////////////////////////7    
        let btnCargarMemoria = document.querySelector("#btnCargarMemoria");
        btnCargarMemoria.addEventListener("click", chmaquina.cargarEnMemoria);


        //////////////////////////////Cargar un archivo desde un medio extraible://///////////////////////////////////////////7    
        //Obteniendo referencia del boton Cargar
        let btnCargar = document.getElementById("btnCargar");
        //Agregando el evento que permite escuchar cuando se hace click en el boton:
        btnCargar.addEventListener("change",chmaquina.subirArchivo);


        ////////////////////////////// Acerca De ://///////////////////////////////////////////7    
        //La funcion retorna una coleccion de elementos con el nombre especificado:
        let btnAcerca = document.getElementsByName("btnAcerca")[0];
        //Creando un evento tipo 'click' para nuestro boton acercaDe
        btnAcerca.addEventListener("click", chmaquina.acercaDe);

        ////////////////////////////Ejecución Por Prioridad Del mas corto(Cantidad de Instrucciones)///////////
        let btnMasCorto=document.getElementById("btnMasCorto");
        btnMasCorto.addEventListener("click",chmaquina.ejecucionPrioridad);


        let btnPrioridad= document.getElementById("btnPrioridad");
        btnMasCorto.addEventListener("click", ()=>{
            
        });

    });

})(document);