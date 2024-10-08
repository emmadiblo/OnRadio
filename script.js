//<!--names are 34 - 49 artists are 52 - 67 music urls are at 71 - 93  -->
$(function () {
  var playerTrack = $("#player-track"),
    bgArtwork = $("#bg-artwork"),
    bgArtworkUrl,
    albumName = $("#album-name"),
    trackName = $("#track-name"),
    albumArt = $("#album-art"),
    sArea = $("#s-area"),
    seekBar = $("#seek-bar"),
    trackTime = $("#track-time"),
    insTime = $("#ins-time"),
    sHover = $("#s-hover"),
    playPauseButton = $("#play-pause-button"),
    i = playPauseButton.find("i"),
    tProgress = $("#current-time"),
    tTime = $("#track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [ 
      "Radio Agakiza",
      "Radio Isanganiro",
      "Radio Maria Burundi",
      "Radio Bonesha",
      "Radio scolaire Nderagakura",
      "Radio Shima Fm",
      "TzGospel Burundi",
      "Antenna web Gitega",
      "Irebe FM",
      "Radio Intwali FM",
      "Gods Country", 
      "Save Me",
      "Numb",
      "Im Fine",
      "Energy",
      "Hey There Delilah",
      "7 Years",
      "Wrecked",
      "Heroes", 
      "Lose Yourself",
      "World's Smallest Violin",
      "Do It All For You",
      "When I'm Gone",
      "I Love The Sound Of Silence"
    ],
    trackNames = [
      "Agakiza",
      "Isanganiro",
      "Radio Maria Burundi",
      "Radio Bonesha",
      "Radio scolaire Nderagakura",
      "Radio Shima Fm",
      "TzGospel Burundi",
      "Antenna web Gitega",
      "Irebe FM",
      "Radio Intwali FM",
      "Blake Shelton",
      "Jelly Roll",
      "Ryan Oakes",
      "Ryan Oakes",
      "Ryan Oakes",
      "Plain White T's",
      "Lukas Graham",
      "Imagine Dragons",
      "Marshmello & Alan Walker",
      "Eminem",
      "AJR",
      "Alan Walker ft. Trevor Guthrie",
      "Eminem",
      "Eminem & Disturbed"
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5","_6","_7","_8","_9","_10","_11","_12","_13","_14","_15","_16","_17","_18","_19","_20","_21","_22","_23","_24"],
    trackUrl = [ "https://cast6.asurahosting.com/proxy/radioaga/stream",
      "https://isanganiro.ice.infomaniak.ch/isanganiro-64.mp3?_=1",
      "http://dreamsiteradiocp2.com:8082/stream",
      "http://a9.asurahosting.com:8950/radio.mp3",
                "https://eu10.fastcast4u.com/nderagakura/;",
      
"http://5.189.189.39:8000/zabujadotcom.mp3",
     
"https://stream.zeno.fm/nxdpssc3tchvv",
      
"https://italiavera.radioca.st/stream",
      
"https://stream.zeno.fm/5wjpe2wxzdeuv",
      
"https://stream.zeno.fm/f4btyyc18vzuv",
],
    playPreviousTrackButton = $("#play-previous"),
    playNextTrackButton = $("#play-next"),
    currIndex = -1;
   

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
       
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
    else insTime.text(ctMinutes + ":" + ctSeconds);

    insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
    else tProgress.text(curMinutes + ":" + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
    else tTime.text(durMinutes + ":" + durSeconds);

    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    )
      trackTime.removeClass("active");
    else trackTime.addClass("active");

    seekBar.width(playProgress + "%");

    if (playProgress == 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering").removeClass("active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");

      bTime = new Date();
      bTime = bTime.getTime();
    }, 100);
  }

  function selectTrack(flag) {
    if (flag == 0 || flag == 1) ++currIndex;
    else --currIndex;

    if (currIndex > -1 && currIndex < albumArtworks.length) {
      if (flag == 0) i.attr("class", "fa fa-play");
      else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }

      seekBar.width(0);
      trackTime.removeClass("active");
      tProgress.text("00:00");
      tTime.text("00:00");

      currAlbum = albums[currIndex];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];
      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if (flag != 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find("img.active").removeClass("active");
      $("#" + currArtwork).addClass("active");

      bgArtworkUrl = $("#" + currArtwork).attr("src");

      bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
    } else {
      if (flag == 0 || flag == 1) --currIndex;
      else ++currIndex;
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);
    audio.loop = false;

    playPauseButton.on("click", playPause);
    sArea.mousemove(function (event) {
        showHover(event);
    });
    sArea.mouseout(hideHover);
    sArea.on("click", playFromClickedPos);
    $(audio).on("timeupdate", updateCurrTime);

    playPreviousTrackButton.on("click", function () {
        selectTrack(-1);
    
    });
    playNextTrackButton.on("click", function () {
        selectTrack(1);
     
    });



  // Écouteur d'événements pour les touches du clavier
$(document).keydown(function (event) {
  switch (event.key) {
      case "ArrowLeft": // Flèche gauche
          playPreviousTrackButton.click();
          playPreviousTrackButton.addClass("pressed");
          break;
      case " ": // Espace
          playPauseButton.click();
          playPauseButton.addClass("pressed");
          event.preventDefault(); // Pour éviter le défilement de la page
          break;
      case "ArrowRight": // Flèche droite
          playNextTrackButton.click();
          playNextTrackButton.addClass("pressed");
          break;
  }
});

// Écouteur d'événements pour relâcher les touches
$(document).keyup(function (event) {
  switch (event.key) {
      case "ArrowLeft": // Flèche gauche
          playPreviousTrackButton.removeClass("pressed");
          break;
      case " ": // Espace
          playPauseButton.removeClass("pressed");
          break;
      case "ArrowRight": // Flèche droite
          playNextTrackButton.removeClass("pressed");
          break;
  }
});
}

initPlayer();


var URL =
"https://s3-us-west-2.amazonaws.com/s.cdpn.io/222579/Kevin_MacLeod_-_Camille_Saint-Sans_Danse_Macabre_-_Finale.mp3";
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analizador = audioCtx.createAnalyser();
analizador.fftSize = 1024; // [32, 64, 128, 256, 512, 1024, 2048]
var dataArray = new Uint8Array(analizador.frequencyBinCount);
var audioBuffer, fuenteDeReproduccion;
var stop = true;
var tiempo = 0,
progreso = 0;
var progreso = 0;

//canvas vars
var canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
var cw = (canvas.width = window.innerWidth),
cx = cw / 2;
var ch = (canvas.height = window.innerHeight),
cy = ch / 2;
var R = 150;
var r = 80;
var da = 2; // delta angle
var cos = Math.cos(da * Math.PI / 180);
var sin = Math.sin(da * Math.PI / 180);
var requestId = null;

// A U D I O

function solicitarAudio(url) {
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";
request.onload = function() {
  boton.style.display = "block";
  audioCtx.decodeAudioData(request.response, function(buffer) {
    audioBuffer = buffer;
  });
};
request.send();
}

function reproducirAudio() {
fuenteDeReproduccion = audioCtx.createBufferSource();
fuenteDeReproduccion.buffer = audioBuffer;
fuenteDeReproduccion.connect(analizador);
analizador.connect(audioCtx.destination);
fuenteDeReproduccion.start(audioCtx.currentTime, progreso);
}

function detenerAudio() {
fuenteDeReproduccion.stop();
}

function audio() {
if (stop) {
  // si el audio está parado
  tiempo = audioCtx.currentTime - progreso;

  stop = false;
  boton.innerHTML = "Stop";
  reproducirAudio(progreso);
} else {
  // de lo contrario
  stop = true;
  boton.innerHTML = "Click";
  detenerAudio();
}
}

solicitarAudio(URL);

// Utiliza el evento click para iniciar o detener la reproducción
boton.addEventListener("click", audio, false);

// C A N V A S

function Barr(a) {
this.a = a * Math.PI / 180; // angulo

this.dr = 0;

this.cos = Math.cos(this.a);
this.sin = Math.sin(this.a);

this.draw = function(R, color) {
  this.x0 = (R + this.dr) * this.cos;
  this.y0 = (R + this.dr) * this.sin;
  this.x1 = this.x0 * cos - this.y0 * sin;
  this.y1 = this.x0 * sin + this.y0 * cos;
  this.x3 = (R - this.dr) * this.cos;
  this.y3 = (R - this.dr) * this.sin;
  this.x2 = this.x3 * cos - this.y3 * sin;
  this.y2 = this.x3 * sin + this.y3 * cos;

  ctx.fillStyle = lGrd(this.x1, this.y1, this.x2, this.y2, color);

  ctx.beginPath();
  ctx.moveTo(this.x0, this.y0);
  ctx.lineTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.lineTo(this.x3, this.y3);
  ctx.closePath();
  ctx.fill();
};
}

function update(Ry, R, divisor, n, color) {
for (var i = 0; i < Ry.length; i++) {
  var dr = dataArray[i * n];
  Ry[i].dr = dr * dr * dr / divisor;
  Ry[i].draw(R, color);
}
}

// los arrays de barras
var Ry = [];
var Ry1 = [];

for (var i = 0; i < 180; i += 2 * da) {
var b = new Barr(i);
Ry.push(b);
}
// la parte reflejada
for (var i = -2 * da; i > -(180 + 2 * da); i -= 2 * da) {
var b = new Barr(i);
Ry1.push(b);
}

//ctx.translate(cx, cy);
//ctx.rotate(-Math.PI / 2);

function Animacion() {
requestId = window.requestAnimationFrame(Animacion);
analizador.getByteFrequencyData(dataArray);
ctx.clearRect(-cw, -ch, 2 * cw, 2 * ch);
var n = ~~(analizador.frequencyBinCount / Ry.length);

update(Ry, R, 25000, n, "hsla(178,96%,10%,1)");
update(Ry1, R, 25000, n, "hsla(178,96%,10%,1)");

update(Ry, r, 200000, n, "#039691");
update(Ry1, r, 200000, n, "#039691");
}

function init() {
if (requestId) {
  window.cancelAnimationFrame(requestId);
  requestId = null;
}
(cw = canvas.width = window.innerWidth), (cx = cw / 2);
(ch = canvas.height = window.innerHeight), (cy = ch / 2);

ctx.translate(cx, cy);
ctx.rotate(-Math.PI / 2);
// llama la función fotograma para iniciar la animación
Animacion();
}

function lGrd(x, y, x1, y1, color) {
var grd = ctx.createLinearGradient(x, y, x1, y1);
grd.addColorStop(0, "black");
grd.addColorStop(0.5, color);
grd.addColorStop(1, "black");
return grd;
}

window.setInterval(function() {
init();

window.addEventListener("resize", init, false);

// si el audio se está reproduciendo
if (stop == false) {
  // calcula el progreso del audio en segundos
  progreso = audioCtx.currentTime - tiempo;
}

if (audioBuffer && audioCtx.currentTime - tiempo >= audioBuffer.duration) {
  stop = true;
  boton.innerHTML = "Click";
  progreso = 0;
}
}, 1000 / 30);


});



