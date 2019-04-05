"use strict";


(document =>{

    document.addEventListener("DOMContentLoaded", evt =>{


        //Selector de elementos en base a su Id
        $("#prueba1").html("cualquier cosa");

        $("#prueba2").html("prueba2");

        $("#prueba3").html("prueba3");

        //Agrega al inicio:
        $("#prueba1").prepend("xxxxxx");
        
        //Agrega al final:
        $("#prueba2").append("xxxxxx");

        //Creando eventos para el DOM:
        //Recibe como parametros 1. El tipo de evento...2. Un callback con la funcion que se decea ejecutar al hacer 'click'
        $("#probar").on("click",()=>{
            $("#prueba3").fadeToggle("slow");

            $("#prueba2").css({"background-color":"red",
                                "font-size":"150%"});
        });

        $("#recargar").on("click", () =>{
            /**
             * responseTXt: Contenido de la pagina
             * status: me retorna un codigo si todo estuvo bien o si ocurrio un error
             * Objeto ajax
             */
            $("#prueba3").load("vista/html/pagina2.html",(responseTxt,statusTxt,xhr) =>{
                
                if(statusTxt=="success"){
                    alert("Pagina cargada exitosamente");
                    $("#entrada").val("hola");
                    
                }else{
                    alert("Error: "+xhr.status +":"+xhr.statusTxt);
                }

            });

        });


    });


})(document);