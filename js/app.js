;(function ($) {

    var carousel = new Carousel("info/carousel.json");

    var x, y,
        startDraggingX,
        startDraggingY,
        slides,
        sliderWidth,
        sliderHeight,
        heightMin,
        heightMax,
        widthMin,
        widthMax;

    var uiStartPositionLeft,
        uiFinishPositionLeft;
    var uiStartPositionTop,
        uiFinishPositionTop;

    var stringCounter;
    var counter;

    function Carousel(infoFile) {
        $.getJSON(infoFile, function (data) {
            for (counter in data) {
                addPage(data[counter]);
                stringCounter = $(" #slider  ul ").length;
                slides = $(" #slider " + "." + data[counter].className + " li ").length,
                sliderWidth = $('#slider').width();
                sliderHeight = $('#slider').height();
                heightMin = 40;
                heightMax = -((stringCounter - 1) * sliderHeight + 40);
                widthMin = 40;
                widthMax = -((slides - 1) * sliderWidth + 40);

                $("#slider ul").draggable({
                    axis: "x",
                    start: function (event, ui) {
                        x = event.pageX;
                        y = event.pageY;
                        startDraggingX = ui.position.left; //Start of draging
                        startDraggingY = ui.position.top;
                        uiStartPositionLeft = roundTo(ui.position.left, sliderWidth);
                    },
                    drag: function (event, ui) {
                        if (x && y) {
                            var axis = Math.abs(event.pageX - x) > Math.abs(event.pageY - y) ? 'x' : 'y'; //check dragging axis
                            if (axis == "x") {
                                $(this).draggable({axis: "x"});
                                $("#slider").draggable({disabled: true});
                                if (ui.position.left > widthMin) {
                                    ui.position.left = widthMin;
                                } else if (ui.position.left < widthMax) {
                                    ui.position.left = widthMax;
                                }
                            } else if (axis == "y") {
                                $(this).draggable({disabled: true});
                                $("#slider").draggable({
                                    axis: "y",
                                    start: function (event, ui) {
                                        uiStartPositionTop = roundTo(ui.position.top, sliderHeight);
                                    },
                                    drag: function (event, ui) {
                                        $(this).draggable({axis: "y"});
                                        if (ui.position.top > heightMin) {
                                            ui.position.top = heightMin;
                                        }
                                        else if (ui.position.top < heightMax) {
                                            ui.position.top = heightMax;
                                        }
                                    },
                                    stop: function (event, ui) {
                                        $(this).animate({'top': roundTo(ui.position.top, sliderHeight)}, "fast", function () {
                                            uiFinishPositionTop = roundTo(ui.position.top, sliderHeight);
                                            getPages(uiStartPositionTop, uiFinishPositionTop, "marker-right");
                                        });
                                        $("#slider ul").draggable({disabled: false});
                                    }
                                });
                            }
                        }
                    },
                    stop: function (event, ui) {
                        $(this).animate({'left': roundTo(ui.position.left, sliderWidth)}, "fast", function () {
                            uiFinishPositionLeft = roundTo(ui.position.left, sliderWidth);
                            getPages(uiStartPositionLeft, uiFinishPositionLeft, "marker-bottom");
                        });
                        $("#slider").draggable({disabled: false});
                    }
                });
            }
            getPage(stringCounter);
        });

    }

    function roundTo(object, size) {
        size = size || 10;
        return Math.round(object * (1 / (size))) * size;
    }

    function addPage(data) {
        $("#slider").append("<ul class= " + data.className + ">" + data.content + "</ul>");
    }

    function getPages(start, finish, marker) {
        if (start > finish) {
            $("." + marker).removeClass(marker).next().addClass(marker);
        } else if (start < finish) {
            $("." + marker).removeClass(marker).prev().addClass(marker);
        }
    }

    function getPage(width) {
        var i
        var rightNavigation = []
        for (i = 0; i < width; i++) {
            rightNavigation.push("<li></li>");
        }
        $(".right-navigation ul").append(rightNavigation);
        $(".right-navigation li:eq(0)").addClass("marker-right");
    }


    $(window).resize(function () {
        $('#wrapper').css({
            position: 'absolute',
            left: ($(document).width() - $('#wrapper').outerWidth()) / 2,
            top: ($(document).height() - $('#wrapper').outerHeight()) / 2
        });
    });
    $(window).resize();

})(jQuery);

