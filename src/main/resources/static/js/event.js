const event = (function () {
    let CordX;
    let CordY;
    let inicio = 0;
    let points;
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

    function init(){
        $("#canvas").click(makeDrawFunction());
    }
    function updatepuntos(poins) {
            points = poins;
            CordX = points[points.length - 1].x
            CordY = points[points.length - 1].y
        }

    return {
        makeDrawFunction: makeDrawFunction,
        init: init,
        updatepuntos: updatepuntos
    }

})();