//<!--emma   diblo  -->


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
      "RTNB chaine 1",
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
      "Radio black FM",
     "Ijwi Ry'Amerika",
      "Umuco Fm",
      "Izere FM",
      "Iteka FM",
      "Radio Peace FM",
      "ATOCO Media",
      "Bdusa Media",
      "Radio B.A.A MEDIA FM",
      "Hero Radio (burundi)",
      " Menya Live",
      "Radio Inkinzo",
     "EAGLE SPORTS FM",
     "Radio voix d'Espoir",
      "REMA FM",
    ],
    trackNames = [
      "RTNB chaine 1",
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
      "Radio black FM",
        "Ijwi Ry'Amerika",
        "Umuco Fm",
        "Izere FM",
        "Iteka FM",
        "Radio Peace FM",
        "ATOCO Media",
        "Bdusa Media",
        "Radio B.A.A MEDIA FM",
         "Hero Radio (burundi)",
        " Menya Live",
        "Radio Inkinzo",
        "EAGLE SPORTS FM",
        "Radio voix d'Espoir",
      "Rema FM",
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5","_6","_7","_8","_9","_10","_11","_12","_13","_14","_15","_16","_17","_18","_19","_20","_21","_22","_23","_24"],
    trackUrl = [ 
      "https://isanganiro.ice.infomaniak.ch/isanganiro-64.mp3",
      "https://cast6.asurahosting.com/proxy/radioaga/stream",
      "https://isanganiro.ice.infomaniak.ch/isanganiro-64.mp3?_=1",
      "http://dreamsiteradiocp2.com:8082/stream",
      "http://a9.asurahosting.com:8950/radio.mp3",
                "https://eu10.fastcast4u.com/nderagakura/;",
      
"http://5.189.189.39:8000/zabujadotcom.mp3",
     
"https://stream.zeno.fm/nxdpssc3tchvv",
      
"https://italiavera.radioca.st/stream",
      
"https://stream.zeno.fm/5wjpe2wxzdeuv",
      
"https://stream.zeno.fm/f4btyyc18vzuv",
"https://liveonlineradio.net/radio-black-fm-949",
"https://n12.radiojar.com/hzcgfqas92quv?rj-ttl=5&rj-tok=AAABknESC5kA4XbvQBp4nhRAHQ",
"http://s2.free-shoutcast.com:18208/stream",
"http://5.189.189.39:8000/stream",
"https://streams.radio.co/sd1bcd1376/listen",
"https://stream.zeno.fm/s0244utefg8uv",
"https://stream.zeno.fm/g4x4bb7uxd0uv",
"https://stream.zeno.fm/0fpegrf70fctv",
"https://stream.zeno.fm/ud15nzqn0c9uv",
"https://a2.asurahosting.com:6790/burundi.mp3",
"https://stream.zeno.fm/fq6c2xsn0c9uv",
"https://stream.zeno.fm/x3ktdppgx98uv",
"https://audio.bfmtv.com/rmcradio_128.mp3",
"https://stream4.rcast.net/65428",
"https://stream.zeno.fm/hefiobzkki3uv?cto-uid=effb7b7d-db17-45b9-8735-cf9795ea8c9a-6718c3ec-5553&an-uid=2783029727828633261&dot-uid=0b25220400579aa9c57f63d9&triton-uid=cookie%3Ae96dfb54-23e9-478d-b5b9-15b9bd9fc7e5&amb-uid=8565960447303429953&dbm-uid=CAESEAsb2HQtqK3tuh4vyqr5e5o&dyn-uid=3824077489020677364&ttd-uid=bfe6f3e4-16c7-40fb-9db6-cf49ce8371d1&adtonosListenerId=01JAZXZ9V9X7PS2HBRKWC3D214&aw_0_req_lsid=09a7b928689b76e3dfdfbdcca6a03431",
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
          // Vérifiez si le temps actuel est 0 ou si le buffering est en cours
          if (nTime === 0 || (bTime - nTime > 1000)) {
              albumArt.addClass("buffering");
  
          } else {
              albumArt.removeClass("buffering");
          }
     
  

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

  
      const currAlbum = albums[currIndex];
      const currTrackName = trackNames[currIndex];
      const currArtwork = albumArtworks[currIndex];
      audio.src = trackUrl[currIndex];

// Récupérer les éléments du DOM
const volumeRange = document.getElementById('volumeRange');
const volumeValue = document.getElementById('volumeValue');


volumeValue.textContent = (audio.volume * 100) + '%'; // Affiche le volume actuel
volumeRange.value = audio.volume * 100; // Initialiser la valeur du range

// Initialiser le volume affiché
const storedVolume = localStorage.getItem('audioVolume');
if (storedVolume) {
    audio.volume = parseFloat(storedVolume); // Récupérer le volume
} else {
    audio.volume = 0.5; // Volume initial à 50%
  
}

// Fonction pour changer de piste
function changeTrack(index) {


}

// Écouter les changements sur le contrôle de volume
volumeRange.addEventListener('input', function() {
  const value = this.value;
  volumeValue.textContent = value + '%'; // Met à jour l'affichage du volume
  audio.volume = value / 100; // Ajuste le volume de l'élément audio

  // Stocker le volume dans localStorage
  localStorage.setItem('audioVolume', audio.volume);
});


changeTrack(0); // Initialisation avec la première piste

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



});









