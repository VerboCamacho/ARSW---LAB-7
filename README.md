
### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW
## Laboratorio Construción de un cliente 'grueso' con un API REST, HTML5, Javascript y CSS3. Parte II.

### Dependencias:
* [Laboratorio API REST para la gestión de planos.](https://github.com/ARSW-ECI-beta/REST_API-JAVA-BLUEPRINTS_PART2)
* [Laboratorio construción de un cliente ‘grueso’ con un API REST, HTML5, Javascript y CSS3. Parte I](https://github.com/ARSW-ECI-beta/REST_CLIENT-HTML5_JAVASCRIPT_CSS3_GRADLE-BLUEPRINTS_PART1)

### Descripción 
Este laboratorio tiene como fin, actualizar en Front para que se pueda comunicar con los servicios del REST API desarrollado anteriormente
### Parte I

![](img/mock2.png)

1. Agregue al canvas de la página un manejador de eventos que permita capturar los 'clicks' realizados, bien sea a través del mouse, o a través de una pantalla táctil. Para esto, tenga en cuenta [este ejemplo de uso de los eventos de tipo 'PointerEvent'](https://mobiforge.com/design-development/html5-pointer-events-api-combining-touch-mouse-and-pen) (aún no soportado por todos los navegadores) para este fin. Recuerde que a diferencia del ejemplo anterior (donde el código JS está incrustado en la vista), se espera tener la inicialización de los manejadores de eventos correctamente modularizado, tal [como se muestra en este codepen](https://codepen.io/hcadavid/pen/BwWbrw).
   ```javascript
   function makeDrawFunction() {
       if ($("#Current-blueprint").text() != "Current blueprint:") {
            //console.log($("#Current-blueprint").text())
            const elem = document.getElementById("canvas");
            const context = elem.getContext('2d');
            context.beginPath();
            return function (e) {
                const offset = $(elem).offset();
                context.moveTo(CordX, CordY);
                CordX = e.clientX - offset.left;
                CordY = e.clientY - offset.top;
                context.lineTo(CordX, CordY);
                context.stroke();
                points.push({ x: CordX, y: CordY })
            }
       }
    }
   
   ```

2. Agregue lo que haga falta en sus módulos para que cuando se capturen nuevos puntos en el canvas abierto (si no se ha seleccionado un canvas NO se debe hacer nada):
	1. Se agregue el punto al final de la secuencia de puntos del canvas actual (sólo en la memoria de la aplicación, AÚN NO EN EL API!).
	2. Se repinte el dibujo.
	
	```javascript
		drawCanva = function(puntos){
			getAuthor()
			apiclient.getBlueprintsByNameAndAuthor(puntos, name, bluep=>{
            $("#Current-blueprint").text("Current blueprint: "+bluep.name)
            blueprintname = bluep.name;
            //console.log($("#Current-blueprint").text());
            var c = document.getElementById("canvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 500, 400);
            ctx.beginPath()
            ctx.moveTo(bluep.points[0].x , bluep.points[0].y)
            for (var i = 1 ; i < bluep.points.length ; i ++){
                ctx.lineTo(bluep.points[i].x , bluep.points[i].y)
            }
            ctx.stroke();
            const puntos = bluep.points;
            event.updatepuntos(puntos)
            event.init()
        })
    }
	```

3. Agregue el botón Save/Update. Respetando la arquitectura de módulos actual del cliente, haga que al oprimirse el botón:
	1. Se haga PUT al API, con el plano actualizado, en su recurso REST correspondiente.
	2. Se haga GET al recurso /blueprints, para obtener de nuevo todos los planos realizados.
	3. Se calculen nuevamente los puntos totales del usuario.

	Para lo anterior tenga en cuenta:

	* jQuery no tiene funciones para peticiones PUT o DELETE, por lo que es necesario 'configurarlas' manualmente a través de su API para AJAX. Por ejemplo, para hacer una peticion PUT a un recurso /myrecurso:

	```javascript
    return $.ajax({
        url: "/mirecurso",
        type: 'PUT',
        data: '{"prop1":1000,"prop2":"papas"}',
        contentType: "application/json"
    });
    
	```
	Para éste note que la propiedad 'data' del objeto enviado a $.ajax debe ser un objeto jSON (en formato de texto). Si el dato que quiere enviar es un objeto JavaScript, puede convertirlo a jSON con: 
	
	```javascript
	JSON.stringify(objetojavascript),
	```
	* Como en este caso se tienen tres operaciones basadas en _callbacks_, y que las mismas requieren realizarse en un orden específico, tenga en cuenta cómo usar las promesas de JavaScript [mediante alguno de los ejemplos disponibles](http://codepen.io/hcadavid/pen/jrwdgK).

	```javascript
	function updateBlueprint() {
    console.log("Llega a update ")
            var points = event.getPoints();
            return $.ajax({
                url: "/blueprints" + "/" + name + "/" + blueprintname,
                type: 'PUT',
                data: "{\"author\": \"" + name + "\",\"points\":" + JSON.stringify(points) + ",\"name\":" + "\"" + blueprintname + "\"" + "}",
                contentType: "application/json",
                success: function (data) {
                    $.getScript("js/apiclient.js", function () {
                        apiclient.getBlueprintsByAuthor(name, getData);
                    });
                }
            });
    }
 	```
 
4. Agregue el botón 'Create new blueprint', de manera que cuando se oprima: 
	* Se borre el canvas actual.
	* Se solicite el nombre del nuevo 'blueprint' (usted decide la manera de hacerlo).
	
	Esta opción debe cambiar la manera como funciona la opción 'save/update', pues en este caso, al oprimirse la primera vez debe (igualmente, usando promesas):

	1. Hacer POST al recurso /blueprints, para crear el nuevo plano.
	2. Hacer GET a este mismo recurso, para actualizar el listado de planos y el puntaje del usuario.

	```javascript
	function saveBluePrint(){

        var bluepr = $("#newBluePrint").val();
        var points = event.getPoints();
        const promise = $.post({
                    url: "/blueprints",
                    contentType: "application/json",
                    data: "{\"author\": \"" + name + "\",\"points\":" + JSON.stringify(points) + ",\"name\":" + "\"" + bluepr + "\"" + "}",
                });
                promise.then(function (data) {
                        $.getScript("js/apiclient.js", function () {
                            $.getScript("js/apiclient.js", function () {
                                apiclient.getBlueprintsByAuthor(name, getData);
                            });
                        });
                    }, function (error) {
                        alert("No se pudo crear el blueprint")
                    }
                );
    }
 	```
 
5. Agregue el botón 'DELETE', de manera que (también con promesas):
	* Borre el canvas.
	* Haga DELETE del recurso correspondiente.
	* Haga GET de los planos ahora disponibles.

	```javascript
	function deleteBlueprint() {
            return $.ajax({
                url: "/blueprints" + "/" + name + "/" + blueprintname,
                type: 'DELETE',
                contentType: "application/json",
                success: function (data) {
                    $.getScript("js/apiclient.js", function () {
                        clearStuff();
                         apiclient.getBlueprintsByAuthor(name, getData);
                    });
                }
            });
    }
 	```
