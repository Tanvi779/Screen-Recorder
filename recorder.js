const s = (s) => document.querySelector(s);
const i = (i) => document.getElementById(i);

const el = {
  startBtn: i("startBtn"),
  pauseBtn: i("pauseBtn"),
  stopBtn: i("stopBtn"),
  download: i("download"),
  preview: i("preview"),
  textEl: s(".status-text")
};

let mediaRecorder, mediaStream, videoURL;
let recordedChunks = [];

// supported MIME type for recording
function getSupportedMimeType() {
  const types = [
    "video/webm; codecs=vp9",
    "video/webm; codecs=vp8",
    "video/webm"
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  throw new Error("No supported MIME type found for MediaRecorder");
}

// button states based on recording status
function updateButtonStates(state) {
  const { startBtn, pauseBtn, stopBtn, download } = el;
  switch (state) {
    case "idle":
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      download.disabled = true;
      break;

    case "recording":
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      pauseBtn.textContent = "Pause";
      stopBtn.disabled = false;
      download.disabled = true;
      break;

    case "paused":
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      pauseBtn.textContent = "Resume";
      stopBtn.disabled = false;
      download.disabled = true;
      break;

    case "stopped":
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      download.disabled = false;
      pauseBtn.textContent = "Pause";
      break;
  }
}

// Remove old preview videos and revoke URLs
function cleanupOldElements(selector = '.recorded-output') {
  document.querySelectorAll(selector).forEach(el => el.remove());
  if (videoURL) {
    URL.revokeObjectURL(videoURL);
    videoURL = null;
  }
}

// Start screen recording
async function startRec() {
  cleanupOldElements();
  recordedChunks = [];
  el.textEl.textContent = "Requesting screen share permission...";

  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });

    const mimeType = getSupportedMimeType();
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType });

    const handlers = {
      dataavailable: e => e.data?.size && recordedChunks.push(e.data),
      start: () => {
        el.textEl.textContent = "Recording started!";
        updateButtonStates("recording");
      },
      pause: () => {
        el.textEl.textContent = "Recording paused.";
        updateButtonStates("paused");
      },
      resume: () => {
        el.textEl.textContent = "Recording resumed.";
        updateButtonStates("recording");
      },
      stop: () => {
        el.textEl.textContent = "Recording stopped!";
        prepareDownload();
        updateButtonStates("stopped");
      }
    };

    Object.entries(handlers).forEach(([event, fn]) => {
      mediaRecorder[`on${event}`] = fn;
    });

    mediaRecorder.start();
  } catch (err) {
    console.error("Error starting recording:", err);
    el.textEl.textContent = "Error: " + err.message;
    updateButtonStates("idle");
  }
}

// Prepare video for preview and download
function prepareDownload() {
  cleanupOldElements();

  const blob = new Blob(recordedChunks, { type: "video/webm" });
  videoURL = URL.createObjectURL(blob);

  Object.assign(el.preview, {
    controls: true,
    src: videoURL
  });

  el.preview.classList.add("recorded-output");
  el.textEl.textContent = "Recording ready! Click download to save.";
}

// Download recorded video
function triggerDownload() {
  if (!videoURL) {
    el.textEl.textContent = "No recording available to download.";
    return;
  }

  const a = document.createElement("a");
  a.href = videoURL;
  a.download = "recording.webm";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Pause or resume recording
function togglePauseRec() {
  if (!mediaRecorder) return;
  if (mediaRecorder.state === "recording") {
    mediaRecorder.pause();
  } else if (mediaRecorder.state === "paused") {
    mediaRecorder.resume();
  }
}

// Stop recording
function stopRec() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  el.textEl.textContent = "Recording stopped!";
  updateButtonStates("stopped");
}

// Assign button events
const buttonActions = {
  startBtn: startRec,
  pauseBtn: togglePauseRec,
  stopBtn: stopRec,
  download: triggerDownload,
};

Object.entries(buttonActions).forEach(([key, handler]) => {
  if (el[key] && typeof handler === 'function') {
    el[key].addEventListener("click", handler, { passive: true });
  }
});

// Initialize
updateButtonStates("idle");
