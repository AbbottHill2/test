var graph = null;
var paper = null;
var rect = null;
var rect2 = null;
var link = null;
var paperSmall = null;
var background = null;
var paperScroller = null;

function init() {
    $("#zoomIn").unbind().bind('click', function () {
        paperScroller.zoom(0.05, { max: 2 });
    });
    $("#zoomOut").unbind().bind('click', function () {
        paperScroller.zoom(-0.05, { min: 0.4 });
    });
    $("#scaleIn").unbind().bind('click', function () {
        paper.scale(paper.scale().sx + 0.05);
    });
    $("#scaleOut").unbind().bind('click', function () {
        paper.scale(paper.scale().sx - 0.05);
    });
    $("#scaleNone").unbind().bind('click', function () {
        paper.scale(1);
    });

    $("#fitContent").unbind().bind('click', function () {
        paperScroller.addPadding(0,0,0,0);
        paper.fitToContent();
        paper.scale(1, 1);
    });


    graph = new joint.dia.Graph;

    paper = new joint.dia.Paper({
        el: $('#myholder'),
        width: 1920,
        height: 1080,
        model: graph,
        gridSize: 1
    });

    rect = new joint.shapes.basic.Rect({
        position: {x: 260, y: 160},
        size: {width: 100, height: 30},
        attrs: {rect: {fill: 'blue'}, text: {text: 'my box', fill: 'white'}}
    });

    rect.attr({
        rect: {fill: '#2C3E50', rx: 5, ry: 5, 'stroke-width': 2, stroke: 'black'},
        text: {
            text: 'my label', fill: '#3498DB',
            'font-size': 18, 'font-weight': 'bold', 'font-variant': 'small-caps', 'text-transform': 'capitalize'
        }
    });

    rect2 = new joint.shapes.basic.myRect({
        position: {x: 260, y: 160},
        size: {width: 100, height: 30},
        attrs: {rect: {fill: 'blue'}, text: {text: 'my box', fill: 'white'}}
    });
    rect2.translate(300);

    link = new joint.dia.Link({
        source: {id: rect.id},
        target: {id: rect2.id}
    });

    //小窗口
    // paperSmall = new joint.dia.Paper({
    //     el: $('#myholder-small'),
    //     width: 600,
    //     height: 200,
    //     model: graph,
    //     gridSize: 1
    // });
    // paperSmall.scale(.3);
    // paperSmall.$el.css('pointer-events', 'none');

    // 画布主体overflow样式，添加滚动条
    paperScroller = new joint.ui.PaperScroller({
        el: $('.paper-container'),
        paper: paper,
        autoResizePaper: false,
        padding: 0,
        cursor: 'grab'
    });

    paper.on('blank:pointerdown', paperScroller.startPanning);
    // paperScroller.$el.css({ width:$(window).width()-300, height:$(window).height()-3}).appendTo('.paper-container');

    //添加缩略图导航
    var nav = new joint.ui.Navigator({
        paperScroller: paperScroller,
        width: 150,
        height: 150,
        padding: 10,
        currentViewControl: false,
        autoResizePaper: false,
        zoomOptions: {max: 2, min: 0.2}
    });
    nav.$el.appendTo('.navigator-container');
    nav.render();

    // add cell
    graph.addCells([rect, rect2, link]);

    //background
    background = V('<image/>');
    // background = V('<image width="1920px" height="1080px"/>');
    background.attr({
        // 'xlink:href': 'https://file.isolarcloud.com/stpic/100004/file18220171110191652063.jpg', height: 780, width:1000
        'xlink:href': '/resources/images/lianhua.png'
        // 'xlink:href': '/resources/images/933.png'
    });
    V(paper.viewport).prepend(background);

    $(window).resize();
}

function bindEvent() {
//event
    // graph.on('all', function(eventName, cell) {
    //     console.log(arguments);
    // });

    rect.on('change:position', function (element) {
        console.log(element.id, ':', element.get('position'));
    });
}


joint.shapes.basic.myRect = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
    defaults: joint.util.deepSupplement({
        type: 'basic.myRect',
        attrs: {
            'rect': {fill: 'white', stroke: 'black', 'follow-scale': true, width: 80, height: 40},
            'text': {
                'font-size': 14,
                'ref-x': .5,
                'ref-y': .5,
                ref: 'rect',
                'y-alignment': 'middle',
                'x-alignment': 'middle'
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

$(window).resize(function(){
    $(".joint-paper-scroller").height($(window).height()-165);//智能分析去除滚动条  原来高度为 $(window).height()-65
    $(".joint-paper-scroller").width($(window).width()-225);//智能分析去除滚动条  原来高度为 $(window).height()-65
});

init();
bindEvent();

