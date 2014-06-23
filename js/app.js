
var x, y, i;
var startDraggingX, stopDraggingX, directionX;
var startDraggingY, stopDraggingY, directionY;

var slides = $('#slider .first-line').children().length;
    sliderWidth = $('#slider').width(),
    sliderHeight = $('#slider').height(),
    heightMin = 40,
    stringCounter = $("#slider ul > div").length,
    heightMax = -((stringCounter - 1) * sliderHeight + 40),
    widthMin = 40,
    widthMax = -((slides - 1) * sliderWidth + 40);

var rightNavigation = [],
    bottomNavigation = [];

init();

$("#slider ul").draggable({
    start: function (event, ui) {
        x = event.pageX;
        y = event.pageY;

        startDraggingX = ui.position.left; //Start of draging
        startDraggingY = ui.position.top;
    },
    drag: function (event, ui) {
        if (x && y) {
            var axis = Math.abs(event.pageX - x) > Math.abs(event.pageY - y) ? 'x' : 'y'; //check dragging axis
            $(this).draggable('option', 'axis', axis);
            x = y = null;
        }

        //Border check of slider
        if (ui.position.left > widthMin) {
            ui.position.left = widthMin;

        } else if (ui.position.left < widthMax){
            ui.position.left = widthMax;
        }
        if (ui.position.top > heightMin) {
            ui.position.top = heightMin;
        }
        else if (ui.position.top < heightMax) {
            ui.position.top = heightMax;

        }

        stopDraggingX = ui.position.left; //Finish of draging
        stopDraggingY = ui.position.top; //Finish of draging

        directionX = ((startDraggingX < stopDraggingX) ? 'right' : 'left'); // If startDragging is lower than stopDragging than direction if right
        directionY = ((startDraggingY < stopDraggingY) ? 'down' : 'up');
        insert(directionX, directionY);
    },
    stop: function (event, ui) {
        //move the page if it is not equal to the border
        x = y = null;
        $(this).animate({'left': (ui.position.left).roundTo(sliderWidth)}, "fast");
        $(this).animate({'top': (ui.position.top).roundTo(sliderHeight)}, "fast");
    }
});

function insert(directionX, directionY) {
    var elementUp = getPage().parent().prev().children().eq(getPage().prevAll().length),  //take the element above visible page
        elementDown = getPage().parent().next().children().eq(getPage().prevAll().length),//take the element under visible page
        elementNext = getPage().next(), //take next element of visible element
        elementPrev = getPage().prev(), //take prev element of visible element
        elementNextAll = getPage().nextAll(),
        elementPrevAll = getPage().prevAll(),
        elementParent = getPage().parent();

    if (directionX == "right") {
        addPage(elementPrev);
        removePage(elementNextAll, elementParent);
    } else if (directionX == "left") {
        addPage(elementNext);
        removePage(elementPrevAll, elementParent);
    }

    if (directionY == "down") {
        addPage(elementUp);
    } else if (directionY == "up") {
        addPage(elementDown);
    }
}

function addPage(currentPage) {
    if ($(currentPage).length) {
        currentPage.css({
            backgroundImage: "url(images/" + currentPage.attr("id") + ".jpg)"
        });
    }
}

function removePage(removeCurrentPage, removeCurrentParent) {
    if ($(removeCurrentPage).length) {
        removeCurrentPage.css({
            backgroundImage: "none"
        });
        removeCurrentParent.next().children().css({
            backgroundImage: "none"
        });
        removeCurrentParent.prev().children().css({
            backgroundImage: "none"
        });
    }

}

function getPage(e) {
    e = e || window.event;
    var event = window.event.srcElement || e.target;
    return $(event);
}


Number.prototype.roundTo = function (nTo) {
    nTo = nTo || 10;
    return Math.round(this * (1 / nTo)) * nTo;
}

function init(){
    for (i = 0; i < stringCounter; i++) {
        rightNavigation.push("<li class='right-marker-" + i + "'></li>")
    }
    $(".right-navigation").append(rightNavigation);

    for (i = 0; i < slides; i++) {
        bottomNavigation.push("<li class='bottom-marker-" + i + "'></li>")
    }
    $(".bottom-navigation").append(bottomNavigation);

    $("#slider").height($("body").height());
}
