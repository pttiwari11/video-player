var mediaSource;
var mediaSrt;

const temp = async () => {
    document.getElementById("vidUrl").addEventListener("change", (e) => {
      mediaSource = e.currentTarget.value;
      console.log(e.currentTarget.value);
      temp1();
    });

    document.getElementById("cross1").addEventListener("click", (e) => {
      document.getElementById("vidUrl").value = "";
    });

    document.getElementById("srtUrl").addEventListener("change", (e) => {
      mediaSrt = e.currentTarget.value;
      console.log(e.currentTarget.value);
    });

    document.getElementById("cross2").addEventListener("click", (e) => {
      document.getElementById("srtUrl").value = "";
    });
}

temp();

const temp1 = () => {
    var muted = false;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var videoContainer;
    var video = document.createElement("video");
    video.src = mediaSource;
    video.autoPlay = false;
    video.loop = false;
    video.muted = muted;

    // trying adding subtitles 
    var track = document.createElement("track");
    track.src = mediaSrt;
    track.kind = "subtitles";
    track.srclang = "en";
    track.lang = "English";
    video.setAttribute("track", track);

    videoContainer = {
      video: video,
      ready: false,
    };

    video.oncanplay = readyToPlayVideo;
    function readyToPlayVideo(event) {
      videoContainer.scale = Math.min(
        canvas.width / this.videoWidth,
        canvas.height / this.videoHeight
      );
      videoContainer.ready = true;
      requestAnimationFrame(updateCanvas);
    }

    function updateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (videoContainer !== undefined && videoContainer.ready) {
        video.muted = muted;
        var scale = videoContainer.scale;
        var vidH = videoContainer.video.videoHeight;
        var vidW = videoContainer.video.videoWidth;
        var top = canvas.height / 2 - (vidH / 2) * scale;
        var left = canvas.width / 2 - (vidW / 2) * scale;

        ctx.drawImage(
          videoContainer.video,
          left,
          top,
          vidW * scale,
          vidH * scale
        );

        if (videoContainer.video.paused) {
          drawPayIcon();
        }
      }

      requestAnimationFrame(updateCanvas);
    }

    function drawPayIcon() {
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#DDD";
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      var size = (canvas.height / 2) * 0.5;
      ctx.moveTo(canvas.width / 2 + size / 2, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 + size);
      ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 - size);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    masterPlay.addEventListener("click", () => {
      if (
        videoContainer.video.paused ||
        videoContainer.video.currentTime <= 0
      ) {
        videoContainer.video.play();
        masterPlay.classList.remove("fa-circle-play");
        masterPlay.classList.add("fa-circle-pause");
      } else {
        videoContainer.video.pause();
        masterPlay.classList.remove("fa-circle-pause");
        masterPlay.classList.add("fa-circle-play");
      }
    });

    document.getElementById("backward").addEventListener("click", () => {
      if (videoContainer.video.currentTime <= 0) {
        videoContainer.video.currentTime = 0;
      } else {
        videoContainer.video.currentTime -= 5;
      }
      videoContainer.video.play();
      masterPlay.classList.remove("fa-circle-play");
      masterPlay.classList.add("fa-circle-pause");
    });

    document.getElementById("forward").addEventListener("click", () => {
      if (
        videoContainer.video.currentTime + 5 <
        videoContainer.video.duration
      ) {
        videoContainer.video.currentTime += 5;
        videoContainer.video.play();
        masterPlay.classList.remove("fa-circle-play");
        masterPlay.classList.add("fa-circle-pause");
      } else {
        videoContainer.video.currentTime = videoContainer.video.duration;
        videoContainer.video.pause();
        masterPlay.classList.remove("fa-circle-pause");
        masterPlay.classList.add("fa-circle-play");
      }
      
    });

    // Listen to Events
    videoContainer.video.addEventListener("timeupdate", () => {
      // Update Seekbar
      progress = parseInt(
        (videoContainer.video.currentTime / videoContainer.video.duration) * 100
      );
      myProgressBar.value = progress;
    });

    myProgressBar.addEventListener("change", () => {
      videoContainer.video.currentTime =
        (myProgressBar.value * videoContainer.video.duration) / 100;
    });

}

