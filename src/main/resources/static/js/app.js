var app = (function(){
    var name = "";
    var blueprints = [];
    var blueprintname= "";
    var createBluePrint = false;


    getAuthor = function(){
        name = $("#name").val()
        $("#authorTitle").text(name +"'s Blueprints")
        //console.log(name)
    }
    

    changeName = function(newName){
        name = newName
    }


    getNameAuthorBlueprints = function() {
            clearStuff();
            getAuthor();
            if (name !== "") {
                apiclient.getBlueprintsByAuthor(name, getData);
            } else {
                alert("Debe ingresar algún nombre, vuelva a intentarlo")
            }
    }

    function clearStuff() {
            $("#Current-blueprint").text("Current blueprint:");
            event.clearDraw();
            const canvaB = document.getElementById("canvas");
            const canvaContext = canvaB.getContext('2d');
            canvaContext.clearRect(0, 0, canvaB.width, canvaB.height);
            canvaContext.restore();
            canvaContext.beginPath();
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

    function saveAndUpdate(){
        if(createBluePrint){
            saveBluePrint();
            createBluePrint = !createBluePrint;
        }else {
            updateBlueprint();
        }
    }

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

    function createNew(){
        clearStuff();
        createBluePrint = true;
    }

    function newInfo(){
        let bluepr = $("#newBluePrint").val();
                $("#Current-blueprint").text("Current blueprint: " + bluepr);
                let pointsList = [];
                pointsList.push({x: 0, y: 0});
                event.updatepuntos(pointsList)
                event.init()
    }

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


    printWorking = function(){
        console.log("Sirver Perra")
    }

    return{
        getAuthor : getAuthor,
        changeName: changeName,
        getNameAuthorBlueprints: getNameAuthorBlueprints ,
        printWorking : printWorking,
        drawCanva : drawCanva,
        updateBlueprint : updateBlueprint,
        newInfo : newInfo,
        createNew : createNew,
        saveAndUpdate : saveAndUpdate,
        deleteBlueprint : deleteBlueprint

    }



})();