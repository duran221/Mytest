/*
 * Ahorcado.js
 * Un simple demostración de programación modular orientada a objetos. 
 */
'use strict';


export default class Ahorcado {

    constructor() {
        this.palabras = [
            ["ARGENTINA", "BOLIVIA", "BRASIL", "CHILE", "COLOMBIA", "CUBA", "ECUADOR", "SALVADOR",
                "GRANADA", "GUATEMALA", "GUYANA", "HAITI", "HONDURAS", "JAMAICA", "MEXICO", "NICARAGUA",
                "PARAGUAY", "PANAMA", "PERU", "SURINAM", "URUGUAY", "VENEZUELA"
            ],
            ["WINDOWS", "MAC", "LINUX", "UNIX", "SOLARIS", "CHROME", "DEBIAN", "UBUNTU", "MANDRIVA",
                "SABAYON", "FEDORA", "REACTOS", "ANDROID", "IOS", "SYMBIAN", "BADA"
            ],
            ["ARANDANO", "FRAMBUESA", "FRESA", "MANDARINA", "NARANJA", "POMELO", "KIWI", "AGUACATE",
                "CHIRIMOYA", "COCO", "MANGO", "PAPAYA", "PIÑA", "ALBARICOQUE", "CEREZA", "CIRUELA",
                "MANZANA", "MELOCOTON", "NISPERO", "PERA", "UVA", "ALMENDRA", "AVELLANA", "CACAHUETE",
                "NUEZ", "PISTACHO"
            ],
            ["ARPA", "BAJO", "BALALAICA", "CASCABELES", "CASTAÑUELAS", "CHARANGO", "CITARA", "CLARINETE",
                "CLABEZIN", "CLAVICORDIO", "CONTRABAJO", "CORNO", "FAGOT", "FLAUTA", "GAITA", "GONG",
                "GUITARRA", "LAUD", "LIRA", "MARACAS", "OBOE", "OCARINA", "ORGANO", "PIANO", "PLATILLOS",
                "QUENA", "SAXOFON", "SITAR", "SONAJAS", "TRIANGULO", "TROMBON", "TROMPETA", "VIOLIN",
                "VIOLA", "VIOLONCELO", "XILOFONO"
            ]
        ]

        this.palabraOculta; // la palabra que hay que buscar
        this.espaciosPalabra; // los espacios que ocupa una palabra representados por "_"
        this.intentosFallidos; // contador de intentos fallidos
        this.maxIntentos; // el máximo de intentos fallidos que se permiten
        this.tiempoLimite = 120; // segundos
        this.idSetInterval; // Un número, que representa el ID del temporizador setInterval. Se usa con el clearInterval(), para activar o desactivar el conteo
        this.segundosJugados;
        this.imagenes; // un array de imágenes a utilizar en el juego
        this.jugando = false; // true cuando hay un juego activo
        this.audio;
    }

    /**
     * Inicializa gestores de eventos para: 1) capturar teclas pulsadas y 2) celdas de la tabla con letras.
     * Llena una tabla con las letras del abecedario y carga los nombres de las imágenes del juego.
     */
    inicializarAplicacion = () => {
        // permitir captura un pulsación de tecla en cualquier parte del documento
        document.addEventListener('keydown', (event) => {
            const letra = event.key.toUpperCase();
            this.verificarIntento(letra);
        });

        $('#btn-inicio-juego').addEventListener('click', event => {
            this.iniciarJuego();
            console.log(this.palabraOculta);
        });

        this.crearTablaAlfabeto('#div-tabla-letras', 'tabla-letras', 'highlight');

        this.imagenes = [];
        for (let i = 0; i < 9; i++) {
            this.imagenes.push(`./vista/images/hangman${i}.jpg`);
        }
        $('#div-imagen').innerHTML = `<img class="responsive-img" src="${this.imagenes[0]}"></img>`;

        this.audio = new Audio('./vista/media/perder.mp3');
    }

    /**
     * Reinicia los componentes globales del juego
     */
    iniciarJuego = () => {
        this.jugando = true;
        this.maxIntentos = parseInt($("#index-intentos").value);
        // carga la imagen inicial
        $('#div-imagen').innerHTML = `<img class="responsive-img" src="${this.imagenes[0]}"></img>`;
        // selección aleatoria de la palabra, según la categoría seleccionada
        let indiceCategoria = $("#index-categorias").selectedIndex;
        let indice = Ahorcado.getRandomInt(0, this.palabras[indiceCategoria].length - 1);
        this.palabraOculta = this.palabras[indiceCategoria][indice];
        // muestra un caracter "-" por cada letra de la palabra a descifrar
        this.espaciosPalabra = '-'.repeat(this.palabraOculta.length);
        $('#index-palabra').innerHTML = this.espaciosPalabra;
        // reinicia los contadores del juego 
        this.intentosFallidos = 0;
        $("#div-intentos").innerHTML = `Intentos = ${this.intentosFallidos}`;
        this.contadorDeTiempo();
    }

    /**
     * Verifica si la letra seleccionada por el usuario es parte de la palabra. Si lo es, la muestra en las 
     * posiciones que se encuentra en "espaciosPalabra", si no, penaliza al usuario 
     */
    verificarIntento = (letra) => {
        if (!this.jugando) {
            return;
        }

        // si la letra seleccionada ya fue encontrada, perdonársela al usuaro
        if (this.espaciosPalabra.includes(letra)) {
            return;
        }

        // buscar si la letra elegida tiene coincidencias en la palabra buscada, si sí, mostrarla en la(s) posición(es) respectiva(s)
        let acierto = false;
        for (let i = 0; i < this.palabraOculta.length; i++) {
            let k = this.palabraOculta.indexOf(letra, i);
            if (k > -1) {
                acierto = true;
                this.espaciosPalabra = this.espaciosPalabra.substring(0, k) + letra + this.espaciosPalabra.substring(k + 1, this.espaciosPalabra.length);
            }
        }
        $('#index-palabra').innerHTML = this.espaciosPalabra;

        if (acierto) {
            if (this.palabraOculta === this.espaciosPalabra) {
                this.finalizarJuego(`Fin del juego Ganaste!`, this.imagenes[0]);
            }
        } else {
            this.intentosFallidos++;
            $("#div-intentos").innerHTML = `Intentos = ${this.intentosFallidos}`;

            if (this.intentosFallidos === this.maxIntentos) {
                this.finalizarJuego(`Fin del juego Perdiste!`, this.imagenes[8]);
                this.audio.play();
            } else {
                let imagen = this.imagenes[this.intentosFallidos];
                console.log(this.intentosFallidos, imagen);
                $('#div-imagen').innerHTML = `<img class="responsive-img" src="${imagen}"></img>`;
            }
        }
    }

    /**
     * Muestra el estado final del juego y desactiva la posibilidad de continuar verificando intentos
     */
    finalizarJuego = (estado, imagen) => {
        this.jugando = false;
        M.toast({ html: estado });
        $('#index-palabra').innerHTML = this.palabraOculta;
        $('#div-imagen').innerHTML = `<img class="responsive-img" src="${imagen}"></img>`;
        clearInterval(this.idSetInterval);
    }

    /**
     * Genera una matriz de 3x9 con las letras del alfabeto español. 
     * Hubiera sido más breve con String.fromCharCode(codigoCaracter); si la Ñ no se atravesara
     */
    getMatrizAlfabeto = () => {
        let aux = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ];
        let letras = [];
        let k = 0;
        for (let i = 0; i < 3; i++) {
            letras[i] = [];
            for (let j = 0; j < 9; j++) {
                letras[i].push(aux[k]);
                k++;
            }
        }
        return letras;
    }

    /**
     * Crear una tabla en un elemento del DOM a partir de un array de letras
     * @param {String} idContenedor El ID del elemento que contendrá la tabla
     * @param {String} idTabla El ID con el que se creará la tabla
     * @param {String} estilo Nombre opcional de una clase CSS para aplicar a la tabla
     */
    crearTablaAlfabeto = (idContenedor, idTabla, estilo = 'highlight') => {
        let $this = this;
        let tabla = $(idTabla);

        if (!tabla) {
            tabla = document.createElement('table');
            tabla.setAttribute('id', idTabla);
            $(idContenedor).appendChild(tabla); // agregar la tabla al idContenedor
        } else {
            tabla.innerHTML = "";
        }

        $this.getMatrizAlfabeto().forEach(fila => {
            let tr = tabla.insertRow(); // crear una nueva fila

            fila.forEach(columna => {
                let td = tr.insertCell(); // crear una celda en una fila
                td.innerText = columna; // También se puede usar innerHTML
                // agrega oyentes de eventos clic a cada celda creada
                td.addEventListener("click", function() {
                    $this.verificarIntento(td.innerHTML);
                });

            });
        });

        if (estilo) { // si se proporciona el última argumento, agregar el estilo
            tabla.classList.add(estilo);
        }
        return tabla;
    };

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
     * Devuelve un entero aleatorio entre un intervalo dado
     */
    static getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

}