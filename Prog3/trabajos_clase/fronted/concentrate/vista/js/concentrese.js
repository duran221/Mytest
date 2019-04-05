/*
 * Ahorcado.js
 * Un simple demostración de programación modular orientada a objetos. 
 */
'use strict';


export default class Concentrese {

    constructor() {
        //Vector de imagenes generadas aleatoriamente para el tablero de juego
        this.imagenes = ["./vista/images/animal1.png","./vista/images/animal2.png","./vista/images/animal3.png",
        "./vista/images/animal4.png","./vista/images/animal5.png","./vista/images/animal6.png","./vista/images/animal7.png",
        "./vista/images/animal8.png"];

        //Vector de imagenes auxialiares a mostrar cuando se gana o pierde el juego:
        this.imagenes_extra=["./vista/images/ganar.png","./vista/images/perder.png"];

        this.tiempoLimite = 120 ; // segundos
        this.idSetInterval; // Un número, que representa el ID del temporizador setInterval. Se usa con el clearInterval(), para activar o desactivar el conteo
        this.segundosJugados;
        this.jugando = false; // true cuando hay un juego activo
        this.audio;

        this.intento=0; //Corresponde al intento que se esta realizando en el juego 1 o 2

        this.puntuacion=0; //La puntuacion que lleva actualmente el jugador:

        //Pareja de rutas de imagenes que se seleccionan:
        this.seleccionImagen1="";
        this.seleccionImagen2="";

        this.lista_encontrados=[]; //En esta lista se van almacenando las imagenes que ya han sido encontradas.
        
        this.equivocaciones=0; //Representa la cantidad de intentos errados del usuario

        this.id_contador_imagen=0;

        //Objetos imagenes que se van clickeando, estas referencias se tienen para poder ir ocultando o mostrando las que ya estan encontradas
        this.imagen_clickeada1=undefined;
        this.imagen_clickeada2=undefined;
    }

    /**
     * Crea el evento 'click' para el boton 'iniciar juego'
     * Llena una tabla con imagenes generaadas de forma aleatoria
     */
    inicializarAplicacion = () => {
        
        $('#btn-inicio-juego').addEventListener('click', event => {
            this.iniciarJuego();
        });

        this.crearTablaImagenes('#div-tabla-letras', 'tabla-letras', 'highlight');
        
        //Creando los sonidos del juego:
        this.audio_ganar= new Audio('./vista/media/ganar.mp3');
        this.audio = new Audio('./vista/media/perder.mp3');
        this.audio_acierto = new Audio('./vista/media/acierto.mp3');

    }

    /**
     * Reinicia los componentes globales del juego
     */
    iniciarJuego = () => {
        this.jugando = true;
        this.puntuacion = 0;
        this.equivocaciones=0;
        this.id_contador_imagen=0;
        $("#div-intentos").innerHTML = `Intentos = ${this.puntuacion} -  Intentos fallidos= ${this.equivocaciones}`;
        this.contadorDeTiempo();
    }

    /**
     * Encargado de manejar la puntuacion del juego, verifica si dos imagenes seleccionadas coinciden
     * @param {String} imagenSeleccionada ruta de la imagen seleccionada
     * @param {String} id de la imagen que se ha seleccionado.
     */
    verificarIntento = (imagenSeleccionada,imagenId) => {
        if (!this.jugando) {
            return;
        }

        if(this.intento!=1 && this.imagen_clickeada1 && this.imagen_clickeada2){
            //Fadetoggle(slow)
            this.imagen_clickeada1.style.transform='rotateY(180deg)';
            this.imagen_clickeada1.style.transition='transform .2s';
            this.imagen_clickeada2.style.transformStyle= 'preserve_3d';
            this.imagen_clickeada1.style.visibility='hidden';
            this.imagen_clickeada2.style.visibility='hidden';
            
        }

        // si la letra seleccionada ya fue encontrada, perdonársela al usuaro
        if (this.intento==0) {
            this.seleccionImagen1=imagenSeleccionada;
            this.imagen_clickeada1=document.getElementById(imagenId);
            this.imagen_clickeada1.style.visibility='visible';
            this.intento=1;



        }else{
            this.seleccionImagen2=imagenSeleccionada;
            //Se crea una instancia global para mostrar u ocultar las imagenes:
            this.imagen_clickeada2=document.getElementById(imagenId);
            this.imagen_clickeada2.style.visibility='visible';
            this.intento=0;
            if(this.seleccionImagen1==this.seleccionImagen2){
                this.imagen_clickeada1=undefined;
                this.imagen_clickeada2=undefined;
                if(!this.lista_encontrados.includes(imagenSeleccionada)){
                    this.lista_encontrados.push(imagenSeleccionada);
                    M.toast({html:"Has seleccionado una coincidencia!"});
                    this.puntuacion+=2;
                    this.audio_acierto.play();
                    $("#div-intentos").innerHTML= `Su puntuacion = ${this.puntuacion} -  Intentos fallidos= ${this.equivocaciones}`

                }       
                
            }else{
                if(this.puntuacion!=0){

                    this.puntuacion-=1;
                }
                this.audio.play();
                this.equivocaciones+=1;
                $("#div-intentos").innerHTML= `Su puntuacion = ${this.puntuacion} -  Intentos fallidos= ${this.equivocaciones}`



            }

            if(this.lista_encontrados.length==8){
                this.audio_ganar.play();
                this.finalizarJuego(`Fin del juego,tu puntuacion! ${this.puntuacion}`,this.imagenes_extra[0]);
            }
        
            
        }
    }

    /**
     * Muestra el estado final del juego y desactiva la posibilidad de continuar verificando intentos
     */
    finalizarJuego = (estado, imagen) => {
        this.jugando = false;
        M.toast({ html: estado });
        $('#div-imagen').innerHTML = `<img class="responsive-img" src="${imagen}"></img>`;
        clearInterval(this.idSetInterval);
    }


    /**
     * Crear una tabla en un elemento del DOM a partir de array de imagenes aleatorias
     * @param {String} idContenedor El ID del elemento que contendrá la tabla
     * @param {String} idTabla El ID con el que se creará la tabla
     * @param {String} estilo Nombre opcional de una clase CSS para aplicar a la tabla
     */
    crearTablaImagenes = (idContenedor, idTabla, estilo = 'highlight') => {
        let $this = this;
        let tabla = $(idTabla);
        let indices_imagenes=this.generarIndices();
        let vector= this.generarVectorAleatorios(indices_imagenes);
        if (!tabla) {
            tabla = document.createElement('table');
            tabla.setAttribute('id', idTabla);
            $(idContenedor).appendChild(tabla); // agregar la tabla al idContenedor
        } else {
            tabla.innerHTML = "";
        }

        for(let i=0; i<4; i++){
            let tr = tabla.insertRow(); // crear una nueva fila
            for(let i=0; i<4; i++){
                let td = tr.insertCell(); // crear una celda en una fila
                let imagen=document.createElement("img");
                imagen.src=this.imagenes[vector.pop()];
                imagen.width=80;
                imagen.height=80;
                imagen.setAttribute("id",this.id_contador_imagen);
                this.id_contador_imagen+=1;
                td.appendChild(imagen);
                imagen.style.visibility='hidden';
               // document.getElementById('1').style.transform = 'rotate(45deg)';
                // agrega oyentes de eventos clic a cada celda creada
                td.addEventListener("click", function() {
                    $this.verificarIntento(imagen.src,imagen.id);
                });

            }

        }
        if (estilo) { // si se proporciona el última argumento, agregar el estilo
            tabla.classList.add(estilo);
        }
        return tabla;
    };

    /**
     * A partir de el vector de numeros generados aleatoriamente, los duplica y ubica en posiciones aleatorias
     * para conformar asi el vector que posicionará las imagenes en la tabla
     */
    generarVectorAleatorios = (vectorNumeros) =>{
        let limite=vectorNumeros.length;
        let vector=[];
        for(let i=0; i<15; i++){
            vector.push(null);
        }
        if(vectorNumeros){
            let cont=0;
            while(vector.includes(null)){
                let posicion1= Concentrese.getRandomInt(0,15);
                let posicion2=Concentrese.getRandomInt(0,15);
                if(posicion1!=posicion2){
                    let numero= vectorNumeros.pop();
                    if(!vector.includes(numero)){
                        if(vector[posicion1]==null && vector[posicion2]==null){
                            vector[posicion1]=numero;
                            vector[posicion2]=numero;
                            cont++;
                            
                        }else{
                            vectorNumeros.push(numero);
                        }
                    }else{
                        vectorNumeros.push(numero);
                        
                    }
                }
            }
        }
        return vector;



    }


    /**
     * Genera un vector de numeros ubicados de manera aleatoria, por defecto está en ocho posiciones.
     */
    generarIndices = () =>{
        let indices_imagenes=[];
        let cont=0;
        //Mientras el vector de numeros generados aleatoriamente no esté lleno
        while(cont<this.imagenes.length){
            let indiceImagen=Concentrese.getRandomInt(0,7);
            if(!indices_imagenes.includes(indiceImagen)){
                indices_imagenes.push(indiceImagen);
                cont++;
            }

        }
        return indices_imagenes;

    }

    /**
     * El contador del intervalo de tiempo que el usuario tiene para descifrar la palabra
     */
    contadorDeTiempo = () => {
        clearInterval(this.idSetInterval); // por si las moscas
        this.segundosJugados = 0;
        $("#div-segundos").innerText = `Cero de ${this.tiempoLimite} segundos jugados`;

        this.idSetInterval = setInterval(() => {
            this.segundosJugados++;
            $("#div-segundos").innerText = `${this.segundosJugados} de ${this.tiempoLimite} segundos jugados`;
            if (this.segundosJugados === this.tiempoLimite) {
                this.finalizaPerdiendo();
            }
        }, 1000);
    }

    /**
     * Finaliza la ejecucion de el hijo de tiempo y pone en falso la variable que permite jugar
     */
    finalizaPerdiendo = () =>{
        this.jugando = false;
        M.toast({ html: "Se agotó el tiempo :(" });
        this.audio.play();
        $('#div-imagen').innerHTML = `<img class="responsive-img" src="${this.imagenes_extra[1]}"></img>`;
        clearInterval(this.idSetInterval);
    }

    /**
     * Devuelve un entero aleatorio entre un intervalo dado
     */
    static getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

}