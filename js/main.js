const teheperinkoText = ['てへぺりんこ！', 'てへぺりんこ~'];
const teheperinkoAudio = ['teheperinko_01.mp3'];
const danmakuColors = ['red','aqua','coral','greenyellow','pink','green','blue','yellow','orange','gray'];

function getRandom(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

Array.prototype.getRandom = function () {
    return this[getRandom(0, this.length - 1)];
}

function generateDanmaku() {
    $("#danmaku").empty();
    for (let i = 0; i < 18; i++) {
        let danmaku = $("<div></div>");
        danmaku.addClass("danmaku");
        danmaku.addClass("text-"+danmakuColors.getRandom());
        danmaku.css("color", color16());
        danmaku.css("font-size", getRandom(16,64) + "px");
        danmaku.text(teheperinkoText.getRandom());
        let marquee = $("<marquee></marquee>");
        marquee.attr("behavior", "scroll");
        marquee.attr("direction", "left");
        marquee.attr("scrollamount", getRandom(8,30));
        marquee.append(danmaku);
        $("#danmaku").append(marquee);
    }
}


let a_idx = 0;

let ac = new AudioContext();

$(function (){
    generateDanmaku();
    $(window).on('resize', function() {
        generateDanmaku();
    });
    $("body").click(function(e) {
        const a = teheperinkoText;
        const $i = $("<span/>").text(a[a_idx]);
        a_idx = (a_idx + 1) % a.length;
        const x = e.pageX,
              y = e.pageY;
        $i.css({
            "z-index": 999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": color16()
        });
        $("body").append($i);
        loadSound("./audio/"+teheperinkoAudio.getRandom());
        $i.animate(
            {
                "top": y - 180,
                "opacity": 0
            },
            1500,
            function() {
                $i.remove();
            }
        );
    });
})

function color16(){
    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

function loadSound(url_data) {
    const req = new XMLHttpRequest();
    req.open('GET', url_data, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        ac.decodeAudioData(req.response, function(buffer){
            const source = ac.createBufferSource();
            source.buffer = buffer;
            source.connect(ac.destination);
            source.start(0);
        },function (e) {
            console.error('音频播放错误：\n'+e);
        });
    }
    req.send();
}