<?php

class Compra implements Persistible{

    public function idSiguienteCompra($param) {
        extract($param);

        $sql = "SELECT * FROM id_siguiente_compra()";
        $instruccion = $conexion->pdo->prepare($sql);

        if ($instruccion) {
            if ($instruccion->execute()) {
                //
                $fila = $instruccion->fetch(PDO::FETCH_ASSOC);

                $info = $conexion->errorInfo($instruccion, FALSE);
                $info['id_compra'] = $fila['id_siguiente_compra']; // agregar el nuevo ID a la info que se envía al front-end
                $info['ok'] = $fila['id_siguiente_compra'];
                echo json_encode($info);
            } else {
                echo $conexion->errorInfo($instruccion);
            }
        } else {
            //No se usa return ya que return manda los resultados sobre el mismo backend, en cambio
            //echo, manda los resultados a backend
            echo json_encode(['ok' => FALSE, 'mensaje' => 'Fallo al determinar el ID de la factura siguiente']);
        }
    }

    public function insertar($param) {
        //Convierte variables locales un array asociativo:
        extract($param);
        error_log(print_r($compra, 1));
        
        $sql = "SELECT * FROM insertar_compra(:datos_compra)";
        $instruccion = $conexion->pdo->prepare($sql);

        if ($instruccion) {
            $datosCompra = json_encode($compra);
            error_log($datosCompra);

            $instruccion->bindParam(':datos_compra', $datosCompra);

            if ($instruccion->execute()) {
                $fila = $instruccion->fetch(PDO::FETCH_ASSOC); // si la inserción fue exitosa, recuperar el ID retornado
                $info = $conexion->errorInfo($instruccion, FALSE);
                $info['id_compra'] = $fila['insertar_compra']; // agregar el nuevo ID a la info que se envía al front-end
                //Si el que retorna 'insertar_compra' es mayor a cero, lo asigna
                $info['ok'] = $fila['insertar_compra'] > 0;
                //Envia los datos a fronted
                echo json_encode($info);
            } else {
                echo $conexion->errorInfo($instruccion);
            }
        } else {
            echo json_encode(['ok' => FALSE, 'mensaje' => 'Falló en el registro de la nueva compra']);
        }
    }

    public function actualizar($param) {}

    public function eliminar($param) {}
    
    public function seleccionar($param) {}
    
    
    public function listar($param) {
            extract($param);
    
            $sql = "SELECT id_compra,fecha_compra
                        FROM compras WHERE id_proveedor=:proveedor_id
                        ORDER BY fecha_compra";
    
            // prepara la instrucción SQL para ejecutarla, luego recibir los parámetros de filtrado
            $instruccion = $conexion->pdo->prepare($sql);
            if ($instruccion) {
                $instruccion->bindParam(':proveedor_id', $data['id_proveedor']);
                
                if ($instruccion->execute()) {
                    $info = $conexion->errorInfo($instruccion, FALSE);
                    $filas['lista'] = $instruccion->fetchAll(PDO::FETCH_ASSOC); // devuelve un array que contiene todas las filas del conjunto de resultados
                    $filas['ok'] =TRUE;
                    echo json_encode($filas); // las filas resultantes son enviadas en formato JSON al frontend
                } else {
                    echo $conexion->errorInfo($instruccion);
                }
            } else {
                echo json_encode(['ok' => FALSE, 'mensaje' => 'Fallo al determinar el ID del siguiente pago de clientes']);
            }
    }
    
            /**
         * Devuelve una cadena JSON que contiene el resultado de listar todos los detalles de compra
         * Se usa PDO. Ver https://diego.com.es/tutorial-de-pdo
         */
    public function listarDetalleCompra($param) {
            extract($param);
            
            $sql = "SELECT * FROM lista_detalle_compra WHERE ID_COMPRA=:compra";
    
            $instruccion = $conexion->pdo->prepare($sql);
            if ($instruccion) {
                if ($instruccion->execute([':compra' => $compra])) {
                    $info = $conexion->errorInfo($instruccion, FALSE);
                    $filas = $instruccion->fetchAll(PDO::FETCH_ASSOC); // devuelve un array que contiene todas las filas del conjunto de resultados
                    for ($i = 0; $i < count($filas); $i++) {
                        $filas[$i]['nombre']=$filas[$i]['nombre'] . "-" . $filas[$i]['descripcion'];
                    }
                    echo json_encode($filas); // las filas resultantes son enviadas en formato JSON al frontend
                } else {
                    echo $conexion->errorInfo($instruccion);
                }
            } else {
                echo json_encode(['ok' => FALSE, 'mensaje' => 'Fallo al determinar el ID del siguiente pago de clientes']);
            }
    }
    
}