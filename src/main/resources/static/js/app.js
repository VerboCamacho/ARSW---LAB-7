var app = (function(){
    var name = "";
    var blueprints = [];
    var archivo = apiclient;

    getAuthor = function(){
        name = $("#name").val()
        $("#authorTitle").text(name +"'s Blueprints")
        //console.log(name)
    }
    

    changeName = function(newName){
        name = newName
    }

    getNameAuthorBlueprints = function() {
            getAuthor();
            if (name !== "") {
                archivo.getBlueprintsByAuthor(name, getData);
            } else {
                alert("Debe ingresar algún nombre, vuelva a intentarlo")
            }
    }

    getData = function(resp){
        $("#tableBlueprints tbody").empty();

        if(resp !== undefined){
            getAuthor()
            var data = resp.map((info) => {
                return {
                    name: info.name,
                    lengthPoints: info.points.length ,
                    points: info.points
                }
            })
            data.map((info) => {
                $("#tableBlueprints > tbody:last").append($("<tr><td>" + info.name +
                                                            "</td><td>" + info.lengthPoints.toString() +
                                                            "</td><td>" + `<button type="button" class="btn btn-success" id="openBoton" onclick="app.drawCanva('${info.name}')">Open</button>` +
                                                            "</td></tr>"))
            })

            var total = data.reduce((value, {lengthPoints}) =>
                value + lengthPoints , 0
            )
            
            $("#userPoints").text(total)
        } else {
            alert("No existe el autor, escriba un nombre correcto.")
        }
    }

    drawCanva = function(puntos){
        getAuthor()
        archivo.getBlueprintsByNameAndAuthor(puntos, name, bluep=>{ 
            var c = document.getElementById("canvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 500, 400);
            ctx.beginPath()
            ctx.moveTo(bluep.points[0].x , bluep.points[0].y)
            for (var i = 1 ; i < bluep.points.length ; i ++){
                ctx.lineTo(bluep.points[i].x , bluep.points[i].y)
            }
            ctx.stroke();
        })
    }

    printWorking = function(){
        console.log("Sirver Perra")
    }


    return{
        getAuthor : getAuthor,
        changeName: changeName,
        getNameAuthorBlueprints: getNameAuthorBlueprints ,
        printWorking : printWorking,
        drawCanva : drawCanva
    }



})();