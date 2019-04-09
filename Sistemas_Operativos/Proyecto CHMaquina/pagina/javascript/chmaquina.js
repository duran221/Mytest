
"use strict";

import Proceso from './proceso.js';

export default class ChMaquina {

    constructor(){

        this.planificacion=6; //Esta variable me permite indicar el metodo de planificacion de procesos, por defecto Round-Robin
        this.diccionarioDirecciones = {}; /*Este diccionario me permitira obtener la ubicacion de una variable en el arreglo de memoria principal*/
        this.acumulador = 0; /*La variable this.acumulador de vital importancia para la realizacion de las distintas operacionesen el chmaquina*/
        this.memoria_Principal = []; /*Se crea un vector cuya funcion sera la de almacenar las this.instrucciones de nuestro lenguaje ch*/
        this.kernelSistema; /*Variable que contendra el sistema operativo, por defecto si no se ingresa un valor en kernel este sera
                    (10*z+9) el valor minimo del kernel es de 10 posiciones*/
        this.diccionarioEtiquetas = {}; //Este diccionario permite asociar una etiqueta creada por el usuario y una posicion en memoria operativa.
        //Esta variable me permite llevar una cuenta y conocer que tanto se ha usado de la memoria
        this.contadorMemoria = 0;
        //Este vector es muy importante pues dentro almacena cada uno de los vectores que a su vez contienen cada una de las lineas de codigo
        this.vectorInstrucciones = [];

        /*Esta variable determina si el sistema se encuentra this.encendido o this.apagado--Por defecto se encuentra en OFF*/
        this.encendido = false;
        this.apagado = true;

        //Esta variable permite alternar entre ejecutar las this.instrucciones y cargar las this.instrucciones en memoria:
        this.instruccion = false;

        //Variable impreiscindible, contiene en su interior la lista de los programas en memoria(posicion donde empieza, posicion donde termina,vector de this.instrucciones)
        this.listaProgramas = [];

        //Contiene la informacion del programa que actualimente se esta ejecutando:
        this.infoPrograma = [];

        this.copiaInstrucciones = [];

        this.condi = true;
        this.proces= new Proceso();
        //El quantum es usado en métodos como el round-robin y me permite definir cada cuando se cambia de contexto:
        this.quantum=0;

    }


    //la funcion flecha enciende el sistema
    encenderSistema = error => {
        //Al encender el sistema primero obtenga el valor que corresponde al metodo de planificación seleccionado:
        let selectPlanificacion=document.querySelector('#index-select-planificacion');
        this.planificacion=selectPlanificacion.value;
        if(this.planificacion==6){
            this.quantum=prompt("Introduzca el quantum (Unidades de tiempo,por defecto se inicia en 5)");
            if(this.quantum===''){
                this.quantum=5;
            }
        }
        selectPlanificacion.disabled=true;
        
        this.encendido = true;
        this.apagado = false;
        //Habilitar los elementos de la interfaz para su posterior uso
        document.getElementById("btnOn").disabled = true;
        document.getElementById("btnSiguiente").disabled = true;
        document.getElementById("btnEjecutarP").disabled = true;
        document.getElementById("btnOff").disabled = false;
        document.getElementById("txtMemoria").readOnly = true;
        document.getElementById("txtKernel").readOnly = true;
        document.getElementById("txtComandos").readOnly = false;
        document.getElementById("btnCargar").disabled = false;
        document.getElementById("btnCargarMemoria").disabled = false;
        //Valida si en los campos de memoria y kernel se han escrito parametros, de lo contrario asigna valores por defecto
        if (document.getElementById("txtMemoria").value == "") {
            this.crear_Memoria_Principal(100, undefined, error);
            document.getElementById("txtMemoria").value = this.memoria_Principal.length;
            document.getElementById("txtKernel").value = this.kernelSistema;
        } else {
            var memoria = parseInt(document.getElementById("txtMemoria").value);
            var kernel = parseInt(document.getElementById("txtKernel").value);
            this.crear_Memoria_Principal(memoria, kernel, error);
        }
        this.generarTabla(true);

        return this.encendido;

    };




    apagarSistema = () => {
        this.apagado = true;
        this.encendido = false;

        document.getElementById("btnSiguiente").disabled = true;
        document.getElementById("btnEjecutarP").disabled = true;
        document.getElementById("btnOn").disabled = false;
        document.querySelector('#index-select-planificacion').disabled=false;
        document.getElementById("btnOff").disabled = true;
        document.getElementById("txtMemoria").readOnly = false;
        document.getElementById("txtKernel").readOnly = false;
        document.getElementById("txtComandos").readOnly = true;
        document.getElementById("btnCargar").disabled = true;
        document.getElementById("lblAvisoModo").textContent = "Modo Kernel";
        document.getElementById("btnEjecutar").disabled = true;
        document.getElementById("btnCargarMemoria").disabled = true;


        //Borra de la interfaz las modificaciones hechas
        this.limpiarInterfaz();
        this.eliminarTabla();
        //limpia las variables principales del sistema, entre ellas el vector de memoria principal
        this.limpiarSistema();
        return this.apagado;

   
    };


/*Esta funcion recibe los parametros del tamano inicial del vector de memoria
principal,valida si cumplen con las condiciones y asigna los paremetros kernel a la memoria ppal.*/
    crear_Memoria_Principal = (tamanoMemoria, kernel, error) => {
        if (this.encendido == true && this.apagado == false) {
            if (tamanoMemoria < 40) {
                document.getElementById("texto_monitor").innerHTML = "el valor ingresado es demaciado bajo, por favor ingrese un valor igual o superior a 50 posiciones para evitar" +
                    "desbordamientos de memoria";
            } else if (kernel == undefined) {
                this.memoria_Principal = new Array(tamanoMemoria);
                this.kernelSistema = Math.pow(10, 1) + 9;  //Donde Math.pow() es el metodo que nos permite elevar a una potencia*/
                this.cargar_SistemaOperativo(this.kernelSistema);
                this.memoria_Principal[0] = this.acumulador;
                console.log(this.memoria_Principal, "hola1 ", this.kernelSistema);
                if (error != "error") {
                    document.getElementById("texto_monitor").innerText = "Hola, el sistema se ha iniciado correctamente";
                }
            } else if (kernel < 10) {
                console.log("El tamano inicial del sistema Operativo debe ser mayor a 10");
            } else {
                this.memoria_Principal = new Array(tamanoMemoria);
                this.kernelSistema = kernel;
                this.cargar_SistemaOperativo(this.kernelSistema);
                this.memoria_Principal[0] = this.acumulador;
                if (error != "error") {
                    console.log(this.memoria_Principal, "Hola, el sistema ha sido iniciado de manera correcta", this.kernelSistema);
                    document.getElementById("texto_monitor").value = "Hola, el sistema se ha iniciado correctamente";
                }
            }
        }

    };

/*Esta funcion carga el sistema operativo en el vector memoria principal*/

    cargar_SistemaOperativo = function (kernel) {

        for (var i = 1; i <= kernel; i++) {
            this.memoria_Principal[i] = "SO";
        }

    };

/*Esta funcion recibe el vector ya descompuesto en palabras y lo alista
para ser enviado a su ejecucion
*@param:this.instruccion: booleano que me indica si solo se carga el programa en memoria o si se ejecuta*/
    analizadorLexico(vectorPalabras) {
        //Limpia las cajas de texto con el fin de que nuestro programa vuelva a realizar las operaciones correspondientes
        document.getElementById("texto_monitor").value = "";
        document.getElementById("txtVariables").value = "";
        //esta variable determina si el programa finaliza o no
        if (this.encendido == true && this.apagado == false) {
            for (var k = 0; k < 2; k++) {
                this.iniciarEjecucion(vectorPalabras, k);
                this.eliminarTabla();
                this.generarTabla(false);

            }
        }
    }

    iniciarEjecucion = (vectorPalabras, k) => {
        let aux = [];
        let finalizar = undefined;
        for (var i = 0; i < vectorPalabras.length; i++) {
            if (vectorPalabras[i] != "" && vectorPalabras[i] != "/") { /*Valida que no halla espacios ni saltos de linea con el fin de almacenar solamente
                    las this.instrucciones*/
                aux.push(vectorPalabras[i]); //Este comando almacena nuestra linea de this.instrucciones
                if (i == vectorPalabras.length - 1) {
                    if (k == 0) {
                        this.vectorInstrucciones.push(aux);
                    }
                    //si la this.instruccion finalizar es diferente de undefined es porque el programa retorno un valor y por lo tanto ha finalizado
                    finalizar = this.ejecutarInstrucciones(aux, k);
                    aux = [];
                    if (finalizar != undefined && finalizar != "$" && finalizar != "") {
                        break;
                    } else if (finalizar == "") {
                        k = 2;
                        this.limpiarSistema();
                        this.encenderSistema("error");
                        break;

                    } else if (finalizar == undefined) {
                        document.getElementById("btnEjecutar").disabled = false;
                    }
                }

            } else if (vectorPalabras[i] == "/" && aux.length != 0) {
                if (k == 0) {
                    this.vectorInstrucciones.push(aux);
                }
                finalizar = this.ejecutarInstrucciones(aux, k);
                aux = [];
                if (finalizar != undefined && finalizar != "$" && finalizar != "") {
                    break;
                    //si finalizar retorna un "" significa que se encontro un error en la ejecucion,por lo tanto se debe parar la ejecucion
                } else if (finalizar == "") {
                    k = 2;
                    this.limpiarSistema();
                    this.encenderSistema("error");
                    break;
                } else if (finalizar == undefined) {
                    document.getElementById("btnEjecutar").disabled = false;
                }
                /*Reinicia nuestro vector auxiliar con el fin de que este quede listo para recibir la proxima linea de this.instrucciones*/
            } else if (aux.length != 0 && vectorPalabras[i] != "") {
                //si k es igual a cero es porque se va a realizar el primer checkeo de sintaxis, entonces almacene las this.instrucciones en el vector
                if (k == 0) {
                    this.vectorInstrucciones.push(aux);
                }
                finalizar = this.ejecutarInstrucciones(aux, k);
                aux = [];
                //Esta condicion valida si se llego al final de las this.instrucciones
                if (finalizar != undefined && finalizar != "$" && finalizar != "") {
                    break;
                } else if (finalizar == "") {
                    k = 2;
                    this.limpiarSistema();
                    this.encenderSistema("error");
                    break;
                } else if (finalizar == undefined) {
                    document.getElementById("btnEjecutar").disabled = false;
                }

                this.eliminarTabla();
                this.generarTabla(false);
            }
        }
    }



    ejecutarInstrucciones(vectorFrase, k) {
        var comando = vectorFrase[0];
        /*Se extrae el comando de la frase para ser analizado, se entiende que una frase, es una linea de codigo completa*/
        switch (comando) {
            /*Crea una nueva variable cuyo nombre es el especificado en el primer operando, en el
            nueva
            segundo operando definirá el tipo de variable (C Cadena/alfanumérico, I Entero, R
            Real/decimal, L lógico o booleano (1 Verdadero o 0 Falso ), un tercer operando
            establecerá un valor de inicialización; a cada variable se le asignará automáticamente
            una posición en la memoria. Las variables deberán estar definidas antes de ser utilizadas.
            Las variables no inicializadas tendrán por defecto el valor cero para reales y enteros,
            espacio para cadenas, 0 para lógicos. El separador de decimales es el punto.*/
            case "nueva":
                /*En este punto se asume que la this.instruccion sera crear una variable, se debe tener en cuenta que las variables
                deben inicializar con una letra y no debe contener mas de 255 caracteres
                */
                //si k es igual a cero crea la variable una sola vez
                if (k != 0) {
                    if (!this.instruccion) {
                        if (vectorFrase.length < 3 || vectorFrase.length > 4) {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada:estructura incorrecta para declaracion de variables \n";
                            return "";
                        } else {
                            /*Esta extensa condicion valida si el nombre de la variable empieza por una letra y es menor a 255 caracteres*/
                            if (((vectorFrase[1].substring(0, 1) == "a") || (vectorFrase[1].substring(0, 1) == "A") || (vectorFrase[1].substring(0, 1) == "b") || (vectorFrase[1].substring(0, 1) == "B")
                                || (vectorFrase[1].substring(0, 1) == "c") || (vectorFrase[1].substring(0, 1) == "C") || (vectorFrase[1].substring(0, 1) == "d") || (vectorFrase[1].substring(0, 1) == "D")
                                || (vectorFrase[1].substring(0, 1) == "e") || (vectorFrase[1].substring(0, 1) == "E") || (vectorFrase[1].substring(0, 1) == "f") || (vectorFrase[1].substring(0, 1) == "F")
                                || (vectorFrase[1].substring(0, 1) == "g") || (vectorFrase[1].substring(0, 1) == "G") || (vectorFrase[1].substring(0, 1) == "h") || (vectorFrase[1].substring(0, 1) == "H")
                                || (vectorFrase[1].substring(0, 1) == "i") || (vectorFrase[1].substring(0, 1) == "I") || (vectorFrase[1].substring(0, 1) == "j") || (vectorFrase[1].substring(0, 1) == "J")
                                || (vectorFrase[1].substring(0, 1) == "k") || (vectorFrase[1].substring(0, 1) == "K") || (vectorFrase[1].substring(0, 1) == "l") || (vectorFrase[1].substring(0, 1) == "L")
                                || (vectorFrase[1].substring(0, 1) == "m") || (vectorFrase[1].substring(0, 1) == "M") || (vectorFrase[1].substring(0, 1) == "n") || (vectorFrase[1].substring(0, 1) == "N")
                                || (vectorFrase[1].substring(0, 1) == "o") || (vectorFrase[1].substring(0, 1) == "O") || (vectorFrase[1].substring(0, 1) == "p") || (vectorFrase[1].substring(0, 1) == "P")
                                || (vectorFrase[1].substring(0, 1) == "q") || (vectorFrase[1].substring(0, 1) == "Q") || (vectorFrase[1].substring(0, 1) == "r") || (vectorFrase[1].substring(0, 1) == "R")
                                || (vectorFrase[1].substring(0, 1) == "s") || (vectorFrase[1].substring(0, 1) == "S") || (vectorFrase[1].substring(0, 1) == "t") || (vectorFrase[1].substring(0, 1) == "T")
                                || (vectorFrase[1].substring(0, 1) == "u") || (vectorFrase[1].substring(0, 1) == "U") || (vectorFrase[1].substring(0, 1) == "v") || (vectorFrase[1].substring(0, 1) == "V")
                                || (vectorFrase[1].substring(0, 1) == "x") || (vectorFrase[1].substring(0, 1) == "X") || (vectorFrase[1].substring(0, 1) == "y") || (vectorFrase[1].substring(0, 1) == "Y")
                                || (vectorFrase[1].substring(0, 1) == "z") || (vectorFrase[1].substring(0, 1) == "Z")) && ((vectorFrase[1].length) <= 255)) {

                                switch (vectorFrase[2]) {
                                    case "I":
                                        if (vectorFrase.length == 4) {
                                            if (Number.isInteger(parseInt(vectorFrase[3]))) { //valida si es un entero.de lo contrario no ingresa en la condicion
                                                var entero = parseInt(vectorFrase[3]);
                                                var posEnMemoria = this.almacenarVariableMemoriaPrincipal(entero);
                                                /*Almacena el dato en memoria principal y retorna
                                                                                la posicion donde fue almacenado*/
                                                this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                                /*Agrega al diccionario el nombre de la variable y la posicion
                                                                            donde se almaceno el dato en memoria principal*/
                                                document.getElementById("txtVariables").value += vectorFrase[1] + ":" + entero + "\n";

                                            } else {
                                                document.getElementById("texto_monitor").value = "";
                                                document.getElementById("texto_monitor").value += "error encontrada, la variable no se reconoce como un tipo de variable entera \n";
                                                return "";
                                            }
                                        } else {
                                            var entero = 0;
                                            var posEnMemoria = this.almacenarVariableMemoriaPrincipal(entero);
                                            /*Almacena el dato en memoria principal y retorna
                                                                            la posicion donde fue almacenado*/
                                            this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                            /*Agrega al diccionario el nombre de la variable y la posicion
                                                                        donde se almaceno el dato en memoria principal*/
                                            document.getElementById("txtVariables").value += vectorFrase[1] + ":" + entero + "\n";

                                        }

                                        break;

                                    case "R":
                                        if (vectorFrase.length == 4) {
                                            var flotante = parseFloat(vectorFrase[3]); //convierte la variable del vector en flotante
                                            if (!isNaN(flotante)) { //valida si es un numero
                                                flotante = vectorFrase[3];
                                                var posEnMemoria = this.almacenarVariableMemoriaPrincipal(flotante);
                                                this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                                /*Agrega al diccionario el nombre de la variable y la posicion
                                                                            donde se almaceno el dato en memoria principal*/
                                                document.getElementById("txtVariables").value += vectorFrase[1] + ":" + flotante + "\n";
                                            } else {
                                                document.getElementById("texto_monitor").value = "";
                                                document.getElementById("texto_monitor").value += "error encontrada, la variable no se reconoce como un tipo de variable flotante \n";
                                                return "";
                                            }
                                        } else {
                                            var flotante = 0; //convierte la variable del vector en flotante
                                            var posEnMemoria = this.almacenarVariableMemoriaPrincipal(flotante);
                                            this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                            /*Agrega al diccionario el nombre de la variable y la posicion
                                            donde se almaceno el dato en memoria principal*/
                                            document.getElementById("txtVariables").value += vectorFrase[1] + ":" + flotante + "\n";
                                        }
                                        break;
                                    case "C":
                                        if (vectorFrase.length == 4) {
                                            var cadena = vectorFrase[3];
                                            var posEnMemoria = this.almacenarVariableMemoriaPrincipal(cadena);
                                            this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                            /*Agrega al diccionario el nombre de la variable y la posicion
                                                                    donde se almaceno el dato en memoria principal*/
                                            document.getElementById("txtVariables").value += vectorFrase[1] + ":" + cadena + "\n";
                                        } else {
                                            var cadena = "";
                                            var posEnMemoria = this.almacenarVariableMemoriaPrincipal(cadena);
                                            this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                            /*Agrega al diccionario el nombre de la variable y la posicion
                                            donde se almaceno el dato en memoria principal*/
                                            document.getElementById("txtVariables").value += vectorFrase[1] + ":" + cadena + "\n";
                                        }
                                        break;

                                    case "L":
                                        if (vectorFrase.length == 4) {
                                            if (vectorFrase[3] == "0" || vectorFrase[3] == "1") {
                                                var logica = vectorFrase[3];
                                                var posEnMemoria = this.almacenarVariableMemoriaPrincipal(logica);
                                                this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                                /*Agrega al diccionario el nombre de la variable y la posicion
                                                                            donde se almaceno el dato en memoria principal*/
                                                document.getElementById("txtVariables").value += vectorFrase[1] + ":" + logica + "\n";

                                            }
                                            else {
                                                document.getElementById("texto_monitor").value = "";
                                                document.getElementById("texto_monitor").value += "error encontrada, la variable no se reconoce como un tipo de variable logica \n";
                                                return "";
                                            }
                                        } else {
                                            var logica = "0";
                                            var posEnMemoria = this.almacenarVariableMemoriaPrincipal(logica);
                                            this.infoPrograma[4][vectorFrase[1]] = posEnMemoria;
                                            /*Agrega al diccionario el nombre de la variable y la posicion
                                            donde se almaceno el dato en memoria principal*/
                                            document.getElementById("txtVariables").value += vectorFrase[1] + ":" + logica + "\n";
                                        }
                                        break;

                                    default:
                                        document.getElementById("texto_monitor").value = "";
                                        document.getElementById("texto_monitor").value += "se ha reconocido un error:no se reconoce el tipo de variable a usar \n";
                                        return "";
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "se ha reconocido un error:el nombre de una variable debe iniciar por una letra o" +
                                    " la cantidad maxima de caracteres ha sido excedida (maximo 255) \n";
                                return "";
                            }
                        }
                    }
                }

                break;


            /*Lee por teclado el valor a ser asignado a la variable indicado por el operando*/
            case "lea":
                if (k != 0) {
                    if ((vectorFrase.length) != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value = "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if (this.infoPrograma[4][vectorFrase[1]] != undefined) { /*Esta condicion valida si dentro del diccionario existe una referencia
                                        al vector memoria principal para la variable que se va a cargar en this.acumulador*/

                            //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta
                            if (this.instruccion) {
                                var dato = prompt("Ingrese un dato", "");
                                if (!Number.isNaN(this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                    if (!Number.isNaN(parseInt(dato))) {
                                        this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] = parseFloat(dato);
                                    } else {
                                        document.getElementById("texto_monitor").value = "No se ha reconocido el dato ingresado como un tipo de dato numerico";
                                        return "";
                                    }
                                } else {

                                    this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] = dato;

                                }

                            }


                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }
                break;
            /*Cárguese/copie en el this.acumulador el valor almacenado en la variable indicada por el operando.*/
            case "cargue":
                if (k != 0) {
                    if ((vectorFrase.length) != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value = "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if (this.infoPrograma[4][vectorFrase[1]] != undefined) { /*Esta condicion valida si dentro del diccionario existe una referencia
                                    al vector memoria principal para la variable que se va a cargar en this.acumulador*/

                            //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta
                            if (this.instruccion) {
                                this.acumulador = this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];
                                this.memoria_Principal[0] = this.acumulador;
                                document.getElementById("txtAcumulador").value = this.acumulador;
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }

                break;
            /*Guarde/copie el valor que hay en el this.acumulador a la variable indicada por el operando.*/
            case "almacene":
                if (k != 0) {
                    /*Este condicional valida si el vector contiene la estructura correcta*/
                    if ((vectorFrase.length) != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if (this.infoPrograma[4][vectorFrase[1]] != undefined) {/*Esta condicion valida si dentro del diccionario existe la variable invocada*/
                            /*Dentro de memoria principal almacene el dato que se encuentra en el this.acumulador*/

                            //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                            if (this.instruccion) {
                                if (Number.isInteger(this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {

                                    /*Si el valor a guardar es un entero, convierte el numero a entero y lo almacena*/
                                    this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] = parseInt(this.acumulador);
                                    document.getElementById("txtVariables").value += vectorFrase[1] + ": " + this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] + "\n";

                                } else {
                                    this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] = this.acumulador;
                                    document.getElementById("texto_monitor").value = "";
                                    document.getElementById("txtVariables").value += vectorFrase[1] + ": " + this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] + "\n";
                                }
                            }


                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }

                    }
                }
                break;
            /*Incremente el valor del this.acumulador en el valor indicado por la variable señalada por el operando*/
            case "sume":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion suma se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                            if (!Number.isNaN(this.acumulador - this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                                if (this.instruccion) {
                                    this.acumulador = this.acumulador + this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "Excepcion encontrada, operacion no permitida o tipo de datos no compatible \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }

                break;
            /*Decremente el this.acumulador en el valor indicado por la variable que señala el operando.*/
            case "reste":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion suma se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                            if (!Number.isNaN(this.acumulador - this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                    
                                if (this.instruccion) {
                                    this.acumulador = this.acumulador - this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "Excepcion encontrada, operacion no permitida o tipo de datos no compatible \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }
                break;
            /*Multiplique el valor del this.acumulador por el valor indicado por la variable señalada por el operando*/
            case "multiplique":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion suma se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                            if (!Number.isNaN(this.acumulador * this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta
                                if (this.instruccion) {
                                    this.acumulador = this.acumulador * this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "Excepcion encontrada, operacion no permitida o tipo de datos no compatible \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }

                break;
            /*Divida el valor del this.acumulador por el valor indicado por la variable señalada por el operando.
            El divisor deberá ser una cantidad diferente de cero.*/

            case "divida":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value = "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        if (this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] != 0) {
                            /*La condicion valida si la variable invocada para realizar la operacion suma se encuentra ya declarada*/
                            console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                            if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                                if (!Number.isNaN(this.acumulador / this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                    //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                                    if (this.instruccion) {
                                        this.acumulador = this.acumulador / this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];
                                        this.memoria_Principal[0] = this.acumulador;
                                        document.getElementById("txtAcumulador").value = this.acumulador;
                                    }
                                } else {
                                    document.getElementById("texto_monitor").value = "Excepcion encontrada, operacion no permitida o tipo de datos no compatible \n";
                                    return "";
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "Excepcion encontrada:No se puede realizar divisiones por cero \n";
                            return "";
                        }
                    }
                }
                break;
            /*Eleve el this.acumulador a la potencia señalada por el operando(los exponentes pueden ser valores enteros, positivos o negativos)*/
            case "potencia":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value = +"Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion suma se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                            if (!Number.isNaN(this.acumulador % this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                                if (this.instruccion) {
                                    this.acumulador = Math.pow(this.acumulador, this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]]);
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "Excepcion encontrada, operacion no permitida o tipo de datos no compatible \n";
                                return "";

                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }
                break;

            /*Obtenga el modulo al dividir el valor del this.acumulador por el valor indicado por la variable señalada por el operando.*/
            case "modulo":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion modulo se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                            if (!Number.isNaN(this.acumulador % this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]])) {
                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                    
                                if (this.instruccion) {
                                    this.acumulador = this.acumulador % this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "Excepcion encontrada, operacion no permitida o tipo de datos no compatible \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }
                break;
            /*Genere una cadena que una la cadena dada por el operando a la cadena que hay en el this.acumulador (Operando alfanumérico)*/
            case "concatene":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion concatene se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                            //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                            if (this.instruccion) {
                                this.acumulador = String(this.acumulador + "" + this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]]);
                                this.memoria_Principal[0] = this.acumulador;
                                document.getElementById("txtAcumulador").value = this.acumulador;
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                            return "";
                        }
                    }
                }
                break;
            /*Genere una subcadena que elimine cualquier aparición del conjunto de caracteres dados
            por el operando de la cadena que se encuentra en el this.acumulador (operando alfanumérico))*/
            case "elimine":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion concatene se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if (this.acumulador != undefined) {
                            if (this.acumulador.indexOf(vectorFrase[1]) != -1) {
                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                                if (this.instruccion) {
                                    /*La funcion replace recibe dos parametros, el primero el fragmento de la cadena a reemplazar, el segundo es el valor a reemplazar*/
                                    this.acumulador = String(this.acumulador.replace(vectorFrase[1], ""));
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: la cadena " + vectorFrase[1] + " no se encuentra en la " +
                                    "cadena solicitada \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: el this.acumulador se encuentra vacio \n";
                            return "";

                        }
                    }
                }
                break;
            /*Genere una subcadena que extraiga los primeros caracteres (dados por el valor numérico operando)
            de la cadena que se encuentra en el this.acumulador (operando numérico)
            */
            case "extraiga":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        /*La condicion valida si la variable invocada para realizar la operacion extraiga se encuentra ya declarada*/
                        console.log("aqui ", this.infoPrograma[4][vectorFrase[1]]);
                        if (this.acumulador != undefined) {
                            /*Valida si es un numero, el parametro ingresado y si ese numero no excede la longitud de la cadena que hay en this.acumulador*/
                            if (Number.isInteger(parseInt(vectorFrase[1])) && parseInt(vectorFrase[1]) <= this.acumulador.length) {

                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                    
                                if (this.instruccion) {
                                    /*La funcion replace recibe dos parametros, el primero el fragmento de la cadena a reemplazar, el segundo es el valor a reemplazar*/
                                    this.acumulador = this.acumulador.substring(0, vectorFrase[1]);
                                    this.memoria_Principal[0] = this.acumulador;
                                    document.getElementById("txtAcumulador").value = this.acumulador;
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: la cadena " + vectorFrase[1] + " no se encuentra en la " +
                                    "cadena solicitada \n";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: el this.acumulador se encuentra vacio \n";
                            return "";

                        }
                    }
                }
                break;
            /*Produce una operación lógica Y (AND) entre el primer operando y el segundo operando
            que son variables lógicas y la almacena en el tercer operando.
            */
            case "Y":
                if (k != 0) {
                    /*Este condicional valida si el vector contiene la estructura correcta*/
                    if ((vectorFrase.length) != 4) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if ((this.infoPrograma[4][vectorFrase[1]] != undefined) && (this.infoPrograma[4][vectorFrase[2]] != undefined)
                            && (this.infoPrograma[4][vectorFrase[3]] != undefined)) {/*Esta condicion valida si dentro del diccionario existe la variable invocada*/

                            //Pregunta si las variables invocadas son booleanas, de lo contrario arroje una excepcion
                            if ((this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] == "1") &&
                                (this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] == "1") &&
                                (this.memoria_Principal[this.infoPrograma[4][vectorFrase[3]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[3]]] == "1")) {

                                if (this.instruccion) {
                                    //Asigne a la tercer variable el resultado de la operacion entre las variables 1 y dos
                                    this.memoria_Principal[this.infoPrograma[4][vectorFrase[3]]] = this.operacionAnd(this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]],
                                        this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]]);

                                    //Escriba en la caja de texto de variables el valor de la variable
                                }

                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: solo se permite realizar operaciones entre variables booleanas\n";
                                return "";
                            }

                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: Revise que las variables hallan sido previamente declaradas\n";
                            return "";
                        }

                    }
                }

                break;
            /*Produce una operación lógica O (OR) entre el primer operando y el segundo operando
            que son variables lógicas y la almacena en el tercer operando.
            */
            case "O":
                if (k != 0) {
                    /*Este condicional valida si el vector contiene la estructura correcta*/
                    if ((vectorFrase.length) != 4) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if ((this.infoPrograma[4][vectorFrase[1]] != undefined) && (this.infoPrograma[4][vectorFrase[2]] != undefined)
                            && (this.infoPrograma[4][vectorFrase[3]] != undefined)) {/*Esta condicion valida si dentro del diccionario existe la variable invocada*/

                            //Pregunta si las variables invocadas son booleanas, de lo contrario arroje una excepcion
                            if ((this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] == "1") &&
                                (this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] == "1") &&
                                (this.memoria_Principal[this.infoPrograma[4][vectorFrase[3]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[3]]] == "1")) {

                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                    
                                if (this.instruccion) {
                                    //Asigne a la tercer variable el resultado de la operacion entre las variables 1 y dos
                                    this.memoria_Principal[this.infoPrograma[4][vectorFrase[3]]] = this.operacionOr(this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]],
                                        this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]]);
                                }

                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: solo se permite realizar operaciones entre variables booleanas\n";
                                return "";
                            }

                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: Revise que las variables hallan sido previamente declaradas\n";
                            return "";
                        }

                    }
                }

                break;

            /*Produce una operación de negación lógica para el primer operando que es una variable lógica
            y el resultado se almacena en el segundo operando.*/
            case "NO":
                if (k != 0) {
                    /*Este condicional valida si el vector contiene la estructura correcta*/
                    if ((vectorFrase.length) != 3) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if ((this.infoPrograma[4][vectorFrase[1]] != undefined) && (this.infoPrograma[4][vectorFrase[2]] != undefined)) {/*Esta condicion valida si dentro del diccionario existe la variable invocada*/

                            //Pregunta si las variables invocadas son booleanas, de lo contrario arroje una excepcion
                            if ((this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] == "1")
                                && (this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] == "0" || this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] == "1")) {

                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                    
                                if (this.instruccion) {
                                    //Asigne a la tercer variable el resultado de la operacion entre las variables 1 y dos
                                    this.memoria_Principal[this.infoPrograma[4][vectorFrase[2]]] = this.operacionNot(this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]]);
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: solo se permite realizar operaciones entre variables booleanas\n";
                                return "";
                            }

                        } else {
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada: Revise que las variables hallan sido previamente declaradas\n";
                            return "";
                        }

                    }
                }

                break;
            /*Presente por pantalla el valor que hay en la variable indicada por el operando, si el
            * operando es this.acumulador muestre el valor del this.acumulador.*/
            case "muestre":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";

                    } else {
                        if (vectorFrase[1] == "this.acumulador") {

                            if (this.instruccion) {

                                if (this.acumulador == undefined) {
                                    document.getElementById("texto_monitor").value += "actualmente el this.acumulador se encuentra vacio \n";
                                    return "";
                                } else {

                                    document.getElementById("texto_monitor").value += this.acumulador;
                                }
                            }
                        } else {
                            if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {

                                if (this.instruccion) {
                                    document.getElementById("texto_monitor").value += this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] + "\n";
                                }

                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                                return "";
                            }
                        }
                    }
                }

                break;
            /*Lo mismo que el anterior pero presentándolo en la impresora.*/
            case "imprima":
                if (k != 0) {
                    /*Limpie la caja de texto de impresion*/
                    document.getElementById("texto_impresion").value = "";
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                        return "";
                    } else {
                        if (vectorFrase[1] == "this.acumulador") {
                            //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta                                
                            if (this.instruccion) {
                                if (this.acumulador == undefined) {
                                    document.getElementById("texto_impresion").value += "actualmente el this.acumulador se encuentra vacio \n";
                                    return "";
                                } else {
                                    document.getElementById("texto_impresion").value += this.acumulador + "\n";
                                }
                            }
                        } else {
                            if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {

                                //Preguntando si this.instruccion es positivo, de lo contrario no se ejecuta
                                if (this.instruccion) {
                                    document.getElementById("texto_impresion").value += this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]] + "\n";
                                }
                            } else {
                                document.getElementById("texto_monitor").value = "";
                                document.getElementById("texto_monitor").value += "excepcion encontrada: variable " + vectorFrase[1] + " No existe \n";
                                return "";
                            }
                        }

                    }
                }
                break;
            /*La etiqueta es un nombre que opcionalmente se le puede asignar a una instrucción en el
            programa para evitar trabajar con las posiciones en memoria de las this.instrucciones y poder
            utilizar un nombre simbólico independiente de su ubicación.
            Crea una nueva etiqueta cuyo nombre es el especificado en el primer operando y a la
            cual le asignará automáticamente la posición indicada en el segundo operando (esta será
            la posición relativa de la instrucción a la que se le asigna este nombre con respecto a la
            primera instrucción del programa). Las this.instrucciones que definen etiquetas podrán
            definirse en cualquier posición del programa, pero en todo caso antes de la instrucción retorne.
            */
            case "etiqueta":
                if (vectorFrase.length != 3) {
                    document.getElementById("texto_monitor").value = "";
                    document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta \n";
                    return "";

                } else {

                    if (((vectorFrase[1].substring(0, 1) == "a") || (vectorFrase[1].substring(0, 1) == "A") || (vectorFrase[1].substring(0, 1) == "b") || (vectorFrase[1].substring(0, 1) == "B")
                        || (vectorFrase[1].substring(0, 1) == "c") || (vectorFrase[1].substring(0, 1) == "C") || (vectorFrase[1].substring(0, 1) == "d") || (vectorFrase[1].substring(0, 1) == "D")
                        || (vectorFrase[1].substring(0, 1) == "e") || (vectorFrase[1].substring(0, 1) == "E") || (vectorFrase[1].substring(0, 1) == "f") || (vectorFrase[1].substring(0, 1) == "F")
                        || (vectorFrase[1].substring(0, 1) == "g") || (vectorFrase[1].substring(0, 1) == "G") || (vectorFrase[1].substring(0, 1) == "h") || (vectorFrase[1].substring(0, 1) == "H")
                        || (vectorFrase[1].substring(0, 1) == "i") || (vectorFrase[1].substring(0, 1) == "I") || (vectorFrase[1].substring(0, 1) == "j") || (vectorFrase[1].substring(0, 1) == "J")
                        || (vectorFrase[1].substring(0, 1) == "k") || (vectorFrase[1].substring(0, 1) == "K") || (vectorFrase[1].substring(0, 1) == "l") || (vectorFrase[1].substring(0, 1) == "L")
                        || (vectorFrase[1].substring(0, 1) == "m") || (vectorFrase[1].substring(0, 1) == "M") || (vectorFrase[1].substring(0, 1) == "n") || (vectorFrase[1].substring(0, 1) == "N")
                        || (vectorFrase[1].substring(0, 1) == "o") || (vectorFrase[1].substring(0, 1) == "O") || (vectorFrase[1].substring(0, 1) == "p") || (vectorFrase[1].substring(0, 1) == "P")
                        || (vectorFrase[1].substring(0, 1) == "q") || (vectorFrase[1].substring(0, 1) == "Q") || (vectorFrase[1].substring(0, 1) == "r") || (vectorFrase[1].substring(0, 1) == "R")
                        || (vectorFrase[1].substring(0, 1) == "s") || (vectorFrase[1].substring(0, 1) == "S") || (vectorFrase[1].substring(0, 1) == "t") || (vectorFrase[1].substring(0, 1) == "T")
                        || (vectorFrase[1].substring(0, 1) == "u") || (vectorFrase[1].substring(0, 1) == "U") || (vectorFrase[1].substring(0, 1) == "v") || (vectorFrase[1].substring(0, 1) == "V")
                        || (vectorFrase[1].substring(0, 1) == "x") || (vectorFrase[1].substring(0, 1) == "X") || (vectorFrase[1].substring(0, 1) == "y") || (vectorFrase[1].substring(0, 1) == "Y")
                        || (vectorFrase[1].substring(0, 1) == "z") || (vectorFrase[1].substring(0, 1) == "Z")) && ((vectorFrase[1].length) <= 255)) {

                        if (!Number.isNaN(vectorFrase[2]) || vectorFrase[2] == "0") {
                            if (parseFloat(vectorFrase[2]) % 1 == 0) {
                                //Preguntado si la posicion indicada a la etiqueta es mayor a cero o no es mayor al rango del programa:
                                if (vectorFrase[2] > (this.infoPrograma[1]) || vectorFrase[2] < 0) {
                                    document.getElementById("texto_monitor").value = "la posicion asignada esta prohibida";
                                    return "";
                                } else {
                                    /*En un diccionario de etiquetas asigna a el nombre la direccion en memoria que se ha asignado*/
                                    this.infoPrograma[5][vectorFrase[1]] = parseInt(vectorFrase[2]);
                                    /*Escribir en la tabla el nombre de la etiqueta asociando la ubicacion*/
                                }


                            } else {
                                document.getElementById("texto_monitor").value = "la posicion asignada a la etiqueta no es un numero entero";
                                return "";
                            }
                        } else {
                            document.getElementById("texto_monitor").value = "la posicion asignada a la etiqueta se ha reconocido como un numero valido";
                            return "";
                        }


                    } else {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "se ha reconocido un error:el nombre de una etiqueta debe iniciar por una letra o" +
                            " la cantidad maxima de caracteres para el nombre ha sido excedida (maximo 255) \n";
                        return "";
                    }
                }

                break;


                break;
            /*Salte a la instrucción que corresponde a la etiqueta indicada por el operando y siga la ejecución a partir de allí.*/
            case "vaya":
                if (k != 0) {
                    if (vectorFrase.length != 2) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta estructura vaya \n";
                        return "";

                    } else {

                        //Si el operando se encuentra en el diccionario de etiquetas
                        if (vectorFrase[1] in this.infoPrograma[5] || k == 0) {
                            if (this.instruccion) {
                                //Si el operando asignado a la etiqueta es menor que la variable kernel lance una excepcion indicando que no es posible ir a esa posicion de memoria
                                var posicion = this.buscarFrase(vectorFrase[1]);

                                if (posicion != undefined) {

                                    return this.IraInstruccion(posicion);
                                } else if (k == 0) {
                                    break;
                                } else {
                                    document.getElementById("texto_monitor").value = "";
                                    document.getElementById("texto_monitor").value += "Excepcion encontrada,etiqueta " + vectorFrase[1] + " No existe \n";
                                    return "";

                                }
                            }
                        } else {
                            //Si tras haber realizado el segundo chequeo no se encuentra la etiqueta, despliegue una excepcion indicando que la etiqueta no existe
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada:etiqueta " + vectorFrase[1] + " No existe \n";
                            return "";
                        }

                    }
                }
                break;
            /*Salte:
                Si el valor del this.acumulador es mayor a de cero a la instrucción que corresponde a la etiqueta indicada por el primer operando.
                Si el valor del this.acumulador es menor a cero a la instrucción que corresponde a la etiqueta indicada por el segundo operando
                o Si el this.acumulador es cero a la siguiente instrucción adyacente a la instrucción vayasi y siga la ejecución a partir de allí.
            */
            case "vayasi":

                if (k != 0) {
                    if (vectorFrase.length != 3) {
                        document.getElementById("texto_monitor").value = "";
                        document.getElementById("texto_monitor").value += "Excepcion encontrada, estructura incorrecta estructura vaya \n";
                        return "";

                    } else {

                        //Si el operando se encuentra en el diccionario de etiquetas
                        if (vectorFrase[1] in this.infoPrograma[5] || k == 0) {
                            //Si el operando asignado a la etiqueta es menor que la variable kernel lance una excepcion indicando que no es posible ir a esa posicion de memoria

                            //Busca en que posicion de memoria principal se encuentra cargada la linea solicitada:
                            var posicion = this.buscarFrase(vectorFrase[1]);
                            //la posicion 2 almacena el indice de la segunda etiqueta indicada por la this.instruccion vayasi*
                            var posicion2 = this.buscarFrase(vectorFrase[2]);
                            if (this.instruccion) {
                                if (posicion != undefined) {
                                    if (this.acumulador > 0) {
                                        //El metodo iraInstruccion() es quien realiza el proceso de SALTAR a la linea marcada por la etiqueta:
                                        var condicion = this.IraInstruccion(posicion);
                                        //si la condicion es diferente de undefined es porque el this.acumulador llego a cero y se termino el ciclo
                                        if (condicion != undefined) {
                                            return condicion;
                                        }
                                    } else if (this.acumulador < 0) {
                                        var condicion = this.IraInstruccion(posicion2);
                                        return condicion;
                                    } else if (this.acumulador == 0) {
                                        //si el this.acumulador llego a cero retorna un simbolo especial
                                        return "$";
                                    }

                                } else if (k == 0) {
                                    break;
                                } else {
                                    document.getElementById("texto_monitor").value = "";
                                    document.getElementById("texto_monitor").value += "Excepcion encontrada,etiqueta " + vectorFrase[1] + " No existe \n";
                                    return "";

                                }
                            }
                            /*if(this.diccionarioEtiquetas[vectorFrase[1]]<=this.kernelSistema+1){
                                document.getElementById("texto_monitor").value="";
                                document.getElementById("texto_monitor").value+="Excepcion encontrada,no es posible ir a la posicion en memoria, acceso denegado \n";
                            }else{

                            }*/
                            /* }else if(k==0){
                                //Si k es igual a cero es porque se esta realizando el primer checkeo de sintaxis,aun no se toma la excepcion ya que en el segundo checkeo es posible
                                //que mas abajo se encuentre la etiqueta solicitada
                                break;
            */
                        } else {
                            //Si tras haber realizado el segundo chequeo no se encuentra la etiqueta, despliegue una excepcion indicando que la etiqueta no existe
                            document.getElementById("texto_monitor").value = "";
                            document.getElementById("texto_monitor").value += "excepcion encontrada:etiqueta " + vectorFrase[1] + " No existe \n";
                            return "";
                        }

                    }
                }
                break

            /*El programa termina; debe ser la última instrucción del programa y tiene opcionalmente un operando numérico entero*/
            case "retorne":
                if (k != 0) {
                    if (vectorFrase.length == 2) {
                        if (this.instruccion) {
                            if (vectorFrase[1] == "this.acumulador") {
                                if (this.acumulador == undefined) {
                                    document.getElementById("texto_monitor").value += "actualmente el this.acumulador se encuentra vacio \n";
                                    return "";
                                } else {
                                    return this.acumulador;
                                }
                            } else if ((this.infoPrograma[4][vectorFrase[1]]) != undefined) {
                                return this.memoria_Principal[this.infoPrograma[4][vectorFrase[1]]];

                            } else {
                                if (Number.isInteger(parseInt(vectorFrase[1]))) {
                                    return vectorFrase[1]

                                } else {
                                    document.getElementById("texto_monitor").value = "excepcion encontrada: Valor retornado " + vectorFrase[1] + " No se reconoce como un tipo de entero";
                                    return "";
                                }
                            }

                        }
                    } else {
                        var bandera = true;
                    }

                }
                break;

            default:
                //si el vector empieza por un // es porque se trata de un comentario, ignorelo
                if (vectorFrase[0].substring(0, 2) == "//") {
                    break;
                } else {
                    document.getElementById("texto_monitor").value = "";
                    document.getElementById("texto_monitor").value = "Instruccion u operador " + comando + " no ha sido reconocido \n";
                    return "";
                }

        }
    }





    pasoAPaso = () => {
        //Activando el boton siguiente:
        document.getElementById("btnSiguiente").disabled = false;
        //Formatea el vector y retorna un nuevo vector con las this.instrucciones separadas correctamente.
        let vectorFormateado = [];
        if (this.condi) {
            this.infoPrograma = this.listaProgramas.shift();
            this.copiaInstrucciones = this.infoPrograma[2].slice();
            document.getElementById("btnEjecutar").disabled = true;
            this.copiaInstrucciones = this.formatearCadena(this.copiaInstrucciones);
        }
        let comando = this.quitarEspacios(this.copiaInstrucciones);
        if (comando.length != 0) {
            this.instruccion = true;
            this.ejecutarInstrucciones(comando, 1);
            this.eliminarTabla();
            this.generarTabla(false);
            alert(`Se ha ejecutado la this.instruccion: ${comando}`);
        } else {
            let confirmacion = confirm("El programa ha terminado su ejecucion. ¿Decea continuar?");
            if (!confirmacion) {
                btnPasoPaso.disabled = true;
            }
            this.condi = true;

        }
    };


/**
 * 
 * @param {*} vectorFormateado 
 */
    quitarEspacios = (vectorFormateado) => {
        let frase = [];
        for (let i in vectorFormateado) {
            if (vectorFormateado[0] == "/") {
                //Elimine UN ELEMENTO en la posicion especificada '0'
                vectorFormateado.splice(0, 1);
                break;
            } else if (vectorFormateado[0] != "") {
                frase.push(vectorFormateado.shift());
            } else {
                vectorFormateado.splice(0, 1);
            }
        }
        this.copiaInstrucciones = vectorFormateado.slice();
        return frase;
    }



//La funcion recibe dos parametros y realiza una operacion And entre ambos
    operacionOr(variable1, variable2) {
        if (variable1 == "0" && variable2 == "0") {
            return "0";
        } else {
            return "1";
        }
    }

//La funcion recibe dos parametros y realiza una operacion And entre ambos
    operacionAnd(variable1, variable2) {
        if (variable1 == "1" && variable2 == "1") {
            return "1";
        } else {
            return "0";
        }
    }

//La funcion recibe un parametro y produce su respectiva negacion
    operacionNot(variable1) {
        if (variable1 == "0") {
            return "1";
        } else {
            return "0";
        }
    }

/**
 * Cuando se ingresa en una this.instruccion vayasi, el metodo se encarga de saltar a la linea especificada en la condicion
 * @param {*} posicion : posicion en memoria principal donde se encuentra la linea solicitada
 */
    IraInstruccion(posicion) {
        for (var i = posicion; i < this.vectorInstrucciones.length; i++) {
            var condicion = this.ejecutarInstrucciones(this.vectorInstrucciones[i], 1);
            if (condicion != undefined) {
                return condicion;
            }
        }
    }

    buscarFrase(etiqueta) {
        //obtenga la posicion en memoria donde se encuentra la linea de codigo solicitada
        var posicion = this.infoPrograma[5][etiqueta];
        if (posicion != undefined && posicion != 0) {
            var frase = this.vectorInstrucciones[posicion - 1];
            //elimina los espacios de la linea de codigo
            // var lineaCodigo=frase.split(" ");
            //elimina el primer elemento de array el cual es un ""
            //lineaCodigo.shift();
            //obtenga la siguiente linea de codigo en memoria principal necesaria para hacer la busqueda
            var siguienteLinea = this.vectorInstrucciones[posicion];

            for (var i = 0; i < this.vectorInstrucciones.length; i++) {
                //si la linea de codigo solicitada se encuentra en el vector que contiene todas las this.instrucciones del programa
                if ((frase[0] == this.vectorInstrucciones[i][0]) && frase[1] == this.vectorInstrucciones[i][1]) {
                    if (siguienteLinea == undefined) {
                        return i;
                    } else if ((siguienteLinea[0] == this.vectorInstrucciones[i + 1][0]) && siguienteLinea[1] == this.vectorInstrucciones[i + 1][1]) {
                        return i;
                    }
                    break;
                }
            }
        } else {
            return undefined;
        }
    }

/*Esta funcion genera una tabla con el contenido almacenado en memoria principal*/
    generarTabla = () => {
        //Obtener la referencia del elemento body
        let mapaMemoria = document.querySelector("#mapa_memoria");
        //Invocamos el elemento table
        let tabla = document.getElementById("tablaMemoria");
        let tblbody = document.createElement("tbody");
        //Crea las celdas
        for (var i = 0; i < this.memoria_Principal.length; i++) {
            let hilera = document.createElement("tr");

            for (var j = 0; j < 3; j++) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                var celda = document.createElement("td");
                if (j == 0) {
                    //pregunta si la celda se encuentra vacia
                    if (this.memoria_Principal[i] == undefined) {
                        var textoCelda = document.createTextNode("vacio");
                    } else {
                        var textoCelda = document.createTextNode(this.memoria_Principal[i]);
                    }
                } else if (j == 1) {
                    var textoCelda = document.createTextNode("0" + i);
                } else {
                    var textoCelda = document.createTextNode("");
                }

                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            }
            hilera.style.width = "50px";

            // agrega la hilera al final de la tabla (al final del elemento tblbody)
            tblbody.appendChild(hilera);
        }

        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblbody);
        tabla.style.width = "400px";
        // appends <table> into <body>
        mapaMemoria.appendChild(tabla);
        // modifica el atributo "border" de la tabla y lo fija a "2";
        //ubica las etiquetas en la tabla
        if (this.infoPrograma[5] != undefined) {
            var nombres = Object.keys(this.infoPrograma[5]);
            for (var i = 0; i < nombres.length; i++) {
                var cad = nombres[i];
                //La siguiente linea escribe el nombre de la etiqueta en la posicion asignada, para ello calcula en que posicion del programa
                //se ha asignado la etiqueta:
                document.getElementById("tablaMemoria").rows[parseInt(this.infoPrograma[0] + this.infoPrograma[5][cad])].cells[2].innerText = cad;
            }

        }

    }

//Elimina las filas de la tabla con el fin de refrescar nuestra nueva tabla
    eliminarTabla = () => {
        var aux = 1;
        var cont = document.getElementById("tablaMemoria").rows.length;
        for (var i = 1; i < cont; i++) {
            document.getElementById("tablaMemoria").deleteRow(aux);
        }
    }

/*Esta funcion almacena nuestras variables en memoria principal y las deja listas para su uso*/
    almacenarVariableMemoriaPrincipal(variable) {
        if (!this.instruccion) {
            //Asignando la variable en memoria:
            this.memoria_Principal[this.infoPrograma[1]] = variable;
            //Como se ha creado una nueva variable debe incrementarse en uno el (limite) del programa:
            this.infoPrograma[1] += 1;
            this.infoPrograma[3] += 1;
            //Retornando la posicion de la variable:Se resta uno para retornar la posicion a la que pertenece nuestra variable:
            return (this.infoPrograma[1] - 1);
        }
    }
/*Esta funcion recibe el arreglo de palabras separadas y las junta formando una frase limpia la cual sera guardada
dentro un un arreglo listo para ser introducido en memoria principal*/
    preparar_Frase(arreglo) {
        let vector_Frases = [];
        let frase = "";
        for (var i = 0; i < arreglo.length; i++) {
            if (arreglo[i] != "") {
                if (arreglo[i] != "/") {
                    frase = frase + " " + arreglo[i];
                    if (i == arreglo.length - 1) {
                        vector_Frases.push(frase);
                        frase = "";
                    }
                } else {
                    vector_Frases.push(frase);
                    frase = "";
                }
            } else if (i == arreglo.length - 1 && frase != "") {
                vector_Frases.push(frase);
                frase = "";
            }
        }
        return vector_Frases;
}

/*Esta funcion toma toda la cadena que se ingresa en el textarea y la descompone ingresandola en un array*/
    descomponer_Frase(frase) {
        if (this.encendido == true && this.apagado == false) {
            //Si el booleano es falso significa que no se ha enviado la orden de ejecucion,por tanto cargue simplemente las this.instrucciones en memoria:
            if (!this.instruccion) {
                var cadenaPalabras = frase.replace(/\n/g, " / "); /*Esta maravilla reemplazo un salto de linea por espacios*/
                var vectorPalabras = cadenaPalabras.split(" "); /*Esta linea elimina los posibles espacios*/
                console.log("las palabras son:", vectorPalabras);
                var vectorFrases = this.preparar_Frase(vectorPalabras); /*Junta las palabras obteniendo un vector que almacena las lines de comandos*/
                this.guardarFrasesMemoria(vectorFrases); /*Esta funcion almacena las this.instrucciones en memoria principal*/
                console.log("las frases son las siguientes: ", vectorFrases);
                this.analizadorLexico(vectorPalabras); /*Se envia el vector que contiene los comandos ya separados para su analisis de estructura*/

            } else {
                let vectorPalabras = this.formatearCadena(frase);
                this.analizadorLexico(vectorPalabras); /*Se envia el vector que contiene los comandos ya separados para su analisis de estructura*/
            }
        }
}


/**
 * 
 * @param {*} frase 
 */
    formatearCadena = (frase) => {
        //Como el parametro frase viene en un formato distinto, es necesario convertirlo a un string, de la siguiente manera:
        let texto = "";
        while (frase.length > 0) {
            texto += frase.shift() + " / ";
        }
        this.condi = false;
        return texto.split(" "); /*Esta linea elimina los posibles espacios*/
    }


    guardarFrasesMemoria(frases) {  /*Esta funcion almacena las this.instrucciones en memoria principal*/
        let cont = 0;
        //este vector almacena en su interior los datos de posicion inicial,final de cada programa y un array con los comandos respectivos

        //El for se encarga de ir hasta la ultima posicion de memoria ocupada,el contador es quien me indica cual es la posicion disponible:
        for (var i = this.kernelSistema + 1; i < this.memoria_Principal.length; i++) {
            //Si la posicion es diferente de undefined significa que ya esta ocupada:
            if (this.memoria_Principal[i] == undefined) {
                //iguale el contador  a 'i' para conocer cual es la ultima posicion disponible:
                cont = i;
                break;
            }

        }
        //Si se excede la capacidad de memoria principal:
        if ((cont + frases.length) + 1 > this.memoria_Principal.length) {
            document.getElementById("texto_monitor").innerText = "No hay espacio suficiente para cargar el programa";
        } else {
            //La variable me indica hasta que punto se debe iterar en el almacenamiento de variables:
            let limite = cont + frases.length;

            //Se reinicia la lista para evitar problemas de sobreescritura:
            this.infoPrograma = [];
            //Donde inicia el programa que se almacenara en memoria:(push):agrega un nuevo item a el array
            this.infoPrograma.push(cont);
            //Donde termina el programa(No se incluyen las variables ya que la ubicacion de estas se determina en ejecucion)
            this.infoPrograma.push(limite);
            //Slice me retorna una copia exacta del array frases, pero este no se ve afectado ya que esta copia no usa referencia:
            let copiaFrases = frases.slice();
            //Agregando las this.instrucciones del programa(No se incluyen variables unicamente los comandos introducidos):
            this.infoPrograma.push(copiaFrases);
            //El siguiente dato que se almacena corresponde a un contador para determinar en donde se almacenan las variables al final del programa:
            this.infoPrograma.push(0);

            //El diccionario de direcciones es impreiscindible para encontrar en donde se almacena una variable:
            this.infoPrograma.push(this.diccionarioDirecciones);

            //El diccionario de etiquetas para cada programa me asocia el nombre de la etiqueta y la posicion de la this.instruccion asociada:
            this.infoPrograma.push(this.diccionarioEtiquetas);

            //Si la opción seleccionada fué la 3 (Prioridad), pregunte que prioridad decea asignar a el proceso y asignesela al final:
            if(document.querySelector("#index-select-planificacion").value=="2"){
                let prioridad= prompt("Introduzca una prioridad para el proceso");
                if(prioridad>100 || prioridad<0){
                    alert("Numero de prioridad introducido es invalido.");
                    return;
                }else{

                    this.infoPrograma.push(prioridad);

                }
            }
            for (let i = cont; i < limite; i++) {
                //El metodo shift extrae el primer elemento del array:
                this.memoria_Principal[i] = frases.shift();
            }

            console.log("vector memoria principal:", this.memoria_Principal);
        }

    }


/*Recoje el los comandos ingresados en la caja de texto y los manda al metodo para que la frase sea descompuesta
La variable this.instruccion me indica si se envio la this.instruccion ejecutar o la this.instruccion cargar en Memoria:*/
    enviarTexto = () => {

        if (this.encendido == true && this.apagado == false) {
            var n = document.getElementById('txtComandos').value
            console.log(n);
            document.getElementById("lblAvisoModo").textContent = "Modo usuario";
            //Como el primero que entra es el primero en ser atendido se extrae el programa que primero ingreso
            //Si lista de programas es mayor a cero es porque hay ya un programa cargado en memoria:
            if (this.instruccion == true && this.listaProgramas.length > 0) {
                switch(this.planificacion){

                    case "1":
                        this.fcfs();
                        break;
                    
                    case "2":
                        this.ejecucionPrioridadNoExpropiativo(this.listaProgramas);

                    case "3":
                        break;

                    case "4":
                        this.ejercutarMasCorto(this.listaProgramas);
                        break;

                    case "5":
                        break;
                    case "6":
                        this.ejecutarRoundRobin(this.listaProgramas);                        

                        break;

                    default:
                        break;
                }

            } else {
                this.descomponer_Frase(n);
            }
        }

    };

    fcfs = () => {

        //Extraigame el primer programa que se haya ingresado a la lista:   
        this.infoPrograma = this.listaProgramas.shift();
        this.vectorInstrucciones = [];
        //Ejecute el metodo descomponer frase pero enviando como parametros la frase almacenada
        this.descomponer_Frase(this.infoPrograma[2]);


    }




/*El metodo carga todo el programa en memoria principal, para ello envia una variable en false
para indicar al compilador que no ejecute la this.instruccion, solo verifique sintaxis:*/
    cargarEnMemoria = () => {
        document.getElementById("btnEjecutarP").disabled = false;
        //Validando que el campo de comandos no este vacio:
        if (document.getElementById("txtComandos").value == 0) {
            document.getElementById("texto_monitor").innerText = "Por favor ingrese un comando";
        } else {
            this.instruccion = false;
            document.getElementById("btnEjecutar").disabled = true;
            this.enviarTexto();
            //Limpiando los diccionarios de direcciones para evitar conflictos al ejecutar un nuevo programa:
            this.diccionarioDirecciones = {};
            this.diccionarioEtiquetas = {};

            //Guarde en la lista el programa que se ha cargado en memoria:
            this.listaProgramas.push(this.infoPrograma);
        }
    };


//Funcion que limpia de la interfaz los elementos modificados mientras el chmaquina se encontraba en funcionamiento
    limpiarInterfaz() {
        document.getElementById("txtComandos").value = "";
        document.getElementById("texto_monitor").value = "";
        document.getElementById("txtKernel").value = "";
        document.getElementById("txtMemoria").value = "";
        document.getElementById("texto_impresion").value = "";
        document.getElementById("txtAcumulador").value = "";
        document.getElementById("txtVariables").value = "";

    }
//La funcion borra la memoria principal al igual que el sistema operativo de memoria y las variables principales del sistema
    limpiarSistema() {
        this.acumulador = 0;
        this.memoria_Principal = [];
        this.kernelSistema = 0;
        this.diccionarioDirecciones = {};
        this.diccionarioEtiquetas = {};
        this.vectorInstrucciones = [];
        this.contadorMemoria = 0;
        console.log(this.memoria_Principal);
    }

    /**
     * Realiza una ejecución corrida de la lista de programas usando prioridad no expropiativa
     * @param:{listaProgramas}: lista circular que contiene cada proceso almacenado en memoria.
     */
    ejecucionPrioridadNoExpropiativo=(listaProgramas)=>{
        this.infoPrograma=[];
        this.acumulador=0;
        //Obteniendo la prioridad del programa:
        let mayor=listaProgramas[0][6];
        let programaElegido=listaProgramas[0];

        for(let prog of listaProgramas){
            if(prog[6]>=mayor){
                programaElegido=prog;
                mayor=prog[6];
            }

        }
        
        //Obteniendo la posición del programa elegido:
        let posicion=listaProgramas.indexOf(programaElegido);
        //Se extrae el proceso con mayor prioridad:
        this.infoPrograma= listaProgramas.slice(posicion)[0];
        this.vectorInstrucciones=this.infoPrograma[2];
        //El metodo formatea los comandos en array entendibles para ser ejecutados
        this.convertirVectorInstrucciones();
        listaProgramas.splice(posicion,1);
                
        this.instruccion=true;

        this.copiaInstrucciones = this.infoPrograma[2].slice();
        let contador=this.copiaInstrucciones.length;
        this.copiaInstrucciones = this.formatearCadena(this.copiaInstrucciones);
     
        this.limpiarInterfaz();
        for(let i=0;i<contador; i++){
            let comando = this.quitarEspacios(this.copiaInstrucciones);
            this.ejecutarInstrucciones(comando, 1);

        }
        
        this.eliminarTabla();
        this.generarTabla(false);
        
    };

    /**
     * Realiza una ejecución corrida de la lista de programas usando SJF
     * @param:{listaProgramas}: lista circular que contiene cada proceso almacenado en memoria.
     */
    ejercutarMasCorto(listaProgramas){
        this.infoPrograma=[];
        this.acumulador=0;
        //Obteniendo la longitud del programa:
        let menor=listaProgramas[0][2].length;
        let programaElegido=listaProgramas[0];

        for(let prog of listaProgramas){
            if(prog[2].length<=menor){
                programaElegido=prog;
                menor=prog[2].length;
            }

        }
        
        //Obteniendo la posición del programa elegido:
        let posicion=listaProgramas.indexOf(programaElegido);
        //Se extrae el proceso con menor linea de instrucciones:
        this.infoPrograma= listaProgramas.slice(posicion)[0];
        this.vectorInstrucciones=this.infoPrograma[2];
        //El metodo formatea los comandos en array entendibles para ser ejecutados
        this.convertirVectorInstrucciones();
        listaProgramas.splice(posicion,1);
                
        this.instruccion=true;

        this.copiaInstrucciones = this.infoPrograma[2].slice();
        let contador=this.copiaInstrucciones.length;
        this.copiaInstrucciones = this.formatearCadena(this.copiaInstrucciones);
     
        this.limpiarInterfaz();
        for(let i=0;i<contador; i++){
            let comando = this.quitarEspacios(this.copiaInstrucciones);
            this.ejecutarInstrucciones(comando, 1);

        }
        
        this.eliminarTabla();
        this.generarTabla(false);

    }

    ejecutarRoundRobin=(listaProgramas)=>{
        //La lista Round robin contiene el estado de los procesos en cola.
        this.listaRoundRobin=[];
        this.acumulador=0;

        //Extraiga el primer procesito:
        let procesoElegido=new Proceso(listaProgramas.shift());

        this.vectorInstrucciones=procesoElegido.infoPrograma[2];
        //El metodo formatea los comandos en array entendibles para ser ejecutados
        this.convertirVectorInstrucciones();

        this.instruccion=true;

        //Asigna a el objeto proceso una copia de los comandos:
        procesoElegido.copiaInstrucciones = this.infoPrograma[2].slice();
        //Cantidad de lineas de instrucción que contiene el proceso:
        procesoElegido.longitudPrograma=procesoElegido.copiaInstrucciones.length;
        this.copiaInstrucciones=procesoElegido.copiaInstrucciones;
        //Obtiene un array formateado listo para ser ejecutado:
        this.copiaInstrucciones=this.formatearCadena(this.copiaInstrucciones);
        procesoElegido.arrayFormateado=this.copiaInstrucciones.slice();
        this.listaRoundRobin.push(procesoElegido);
        let contador=procesoElegido.arrayFormateado.length;
        this.limpiarInterfaz();
        for(let i=0;i<contador-1; i++){
            let comando = this.quitarEspacios(this.copiaInstrucciones);
            if(comando!=''){
                this.ejecutarInstrucciones(comando, 1);

            }

        }
        
        this.eliminarTabla();
        this.generarTabla(false);


    }

    cambiarContexto= () =>{

    }



    /**
     * Retorna un array con los comandos formateados y listos para ser ejecutados por el 'vayasi'
     */
    convertirVectorInstrucciones = () =>{
        //Tomamos una copia del vector para realizar las operaciones:
        let copia=this.vectorInstrucciones.slice();
        this.vectorInstrucciones=[];
        //El ciclo recorre uno a uno los elementos de la copia que hemos solicitado:
        for(let i of copia){
            //Creando un nuevo array con cada comando separado por espacios
            let auxiliar=i.split(' ');
            //Como la división anterior crea una cadena vacia al principio del array, se elimina esa posición
            auxiliar.shift();
            this.vectorInstrucciones.push(auxiliar);
        }

    }



/*Permite cargar un archivo desde cualquier ubicacion local del sistema a nuestro ch siempre y cuando este se encuentre this.encendido*/
    subirArchivo = () => {
        if (this.encendido == true && this.apagado == false) {
            var i = document.getElementById('btnCargar');

            if (window.FileReader) {
                for (var j = 0; j < i.files.length; j++) {//como mi input file es múltiple, recorro sus elementos (archivos) que pueden ser varios
                    var lector = new FileReader();//instanciamos FileReader
                    lector.onloadend = (function (f) {//creamos la función que recogerá los datos
                        return function (e) {
                            var contenido = e.target.result.split(",", 2)[1]; //obtenemos el contenido del archivo, estará codificado en Base64
                            contenido = window.atob(contenido); //decodifica el archibo Base64
                            //console.log(f.name,window.atob(contenido));
                            document.getElementById("txtComandos").value = contenido;
                            /*enviarArchivo(f.name,content);/*le paso a una función el nombre del archivo y su contenido.
                            Esta función puede pasar el contenido por ajax u otro medio al servidor*/
                        }
                    })(i.files[j]);
                    lector.readAsDataURL(i.files[j]);//
                }
            }
        }
    };


    acercaDe = () => {
        if (this.encendido == true && this.apagado == false) {
            var cadena = "Proyecto elaborado con fines educativos " +
                "Para la asignatura Sistemas Operativos dictada por el " +
                "doctor Carlos Hernan Gómez Gómez elaborado por " +
                "el estudiante Cristian Fernando Duran L. Crefitos imagenes:\n" +
                "es.pngtree.com\n" +
                "publicdomainvectors.org \n" +
                "bytelearning.blogspot.com"
            document.getElementById("texto_monitor").value = cadena;
        }
    };

}