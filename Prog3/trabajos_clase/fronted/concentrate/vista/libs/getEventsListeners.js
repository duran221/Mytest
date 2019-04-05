'use strict';

/**
 * Versión original de https://github.com/colxi/getEventListeners
 * Esta nueva versión de carlos.cuesta@ucaldas.edu.co tiene los siguientes cambios:
 * - modifica el método getEventListeners
 * - agrega el método getEventHandlers
 * - agrega el método getEvents 
 */

(function() {

    // save the original methods before overwriting them
    Element.prototype._addEventListener = Element.prototype.addEventListener;
    Element.prototype._removeEventListener = Element.prototype.removeEventListener;

    /**
     * [addEventListener description]
     * @param {[type]}  type       [description]
     * @param {[type]}  listener   [description]
     * @param {Boolean} useCapture [description]
     */
    Element.prototype.addEventListener = function(type, listener, useCapture = false) {
        // declare listener
        this._addEventListener(type, listener, useCapture);

        if (!this.eventListenerList) this.eventListenerList = {};
        if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

        // add listener to  event tracking list
        this.eventListenerList[type].push({ type, listener, useCapture });
    };

    /**
     * [removeEventListener description]
     * @param  {[type]}  type       [description]
     * @param  {[type]}  listener   [description]
     * @param  {Boolean} useCapture [description]
     * @return {[type]}             [description]
     */
    Element.prototype.removeEventListener = function(type, listener, useCapture = false) {
        // remove listener
        this._removeEventListener(type, listener, useCapture);

        if (!this.eventListenerList) this.eventListenerList = {};
        if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

        // Find the event in the list, If a listener is registered twice, one
        // with capture and one without, remove each one separately. Removal of
        // a capturing listener does not affect a non-capturing version of the
        // same listener, and vice versa.
        for (let i = 0; i < this.eventListenerList[type].length; i++) {
            if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
                this.eventListenerList[type].splice(i, 1);
                break;
            }
        }
        // if no more events of the removed event type are left,remove the group
        if (this.eventListenerList[type].length == 0) delete this.eventListenerList[type];
    };

    /**
     * Devuelve un objeto en el que cada atributo corresponde a un eventListener del elemento asociado.
     * Importante: este método no detecta eventos asociados de la forma <button id="btn-prueba3" onclick="fx()">Púlsame</button>
     * @param  {String} type Si se ingresa este argumento se comprueba si el elemento asociado
     *                       tiene eventListener de este tipo.
     * @return {[Object]}    Una objeto en el que cada atributo corresponde a un eventListener.
     *                       Si no hay eventListeners que correspondan al tipo dado, el objeto se devuelve vacío.
     */
    Element.prototype.getEventListeners = function(type) {
        // no hay eventos asociados
        if (!this.eventListenerList) {
            this.eventListenerList = {};
        }
        // devolver cualquier tipo de evento asociado
        if (type === undefined) {
            return this.eventListenerList;
        }
        if (this.eventListenerList[type] === undefined) {
            this.eventListenerList = {};
        }
        if (type !== undefined) {
            // clonar a eventListenerList  
            const eventListenerList = {...this.eventListenerList };
            // recorrer los listener en busca de los que no correspondan al tipo requerido para eliminarlos
            for (let key in eventListenerList) {
                if (key !== type) {
                    delete eventListenerList[key];
                }
            }
            // retornar un objeto con un único atributo que corresponde al tipo de eventListener solicitado
            return eventListenerList;
        } else {
            // retorna un objeto con todos los eventListener del elemento asociado
            return this.eventListeners;
        }
    };

    /**
     * Devuelve un objeto en el que cada atributo corresponde a un controlador de evento del elemento asociado,
     * es decir eventos asociados de la forma <elemento id="idx" onclick="fx()">Púlsame</button>
     * @param  {String} type Si se ingresa este argumento se comprueba si el elemento asociado
     *                       tiene controlador de evento de este tipo.
     * @return {[Object]}    Una objeto en el que cada atributo corresponde a un controlador de evento.
     *                       Si no hay un controlador de evento que correspondan al tipo dado, el objeto se devuelve vacío.
     */
    Element.prototype.getEventHandlers = function(type) {
        let self = this;
        let events = ['onblur', 'onchange', 'onclick', 'ondblclick', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onreset', 'onselect', 'onsubmit', 'onunload', 'onresize'];
        let handlers = {};

        if (type) {
            let handler = self.getAttributeNode(type);
            if (handler) {
                handlers[type] = handler.nodeValue;
            }
        } else {
            events.forEach(function(event) {
                let handler = self.getAttributeNode(event);
                if (handler) {
                    handlers[handler.nodeName] = handler.nodeValue;
                }
            });
        }
        return handlers;
    }

    /**
     * Devuelve un objeto en el que cada atributo corresponde a un listener o a un controlador de evento del elemento asociado
     * @param  {String} type Si se ingresa este argumento se comprueba si el elemento asociado
     *                       tiene listener o controlador de evento de este tipo.
     * @return {[Object]}    Una objeto en el que cada atributo corresponde a un listener o controlador de evento.
     *                       Si no hay un listener o controlador de evento que correspondan al tipo dado, el objeto se devuelve vacío.
     */
    Element.prototype.getEvents = function(type) {
        return Object.assign(this.getEventHandlers(type), this.getEventListeners(type));
    }

    /*
    Element.prototype.clearEventListeners = function(a){
        if(!this.eventListenerList)
            this.eventListenerList = {};
        if(a==undefined){
            for(var x in (this.getEventListeners())) this.clearEventListeners(x);
            return;
        }
        var el = this.getEventListeners(a);
        if(el==undefined)
            return;
        for(var i = el.length - 1; i >= 0; --i) {
            var ev = el[i];
            this.removeEventListener(a, ev.listener, ev.useCapture);
        }
    };
    */

})();