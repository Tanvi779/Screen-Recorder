
# 🖥️ Screen Recorder Web App

A simple and modern browser-based screen recorder using JavaScript and the `MediaRecorder` API. It allows users to record their screen, pause/resume during the recording, and download the captured video in `.webm` format.

## 🚀 Features

* ✅ Start, pause/resume, and stop screen recording
* ✅ Live status updates
* ✅ Preview the recorded video
* ✅ Download the video in `webm` format
* ✅ Automatically handles MIME type detection
* ✅ Clean UI logic with smart state-based button handling

## Screenshot

![Screen Recorder App](images/recorder.png)


## 🧪 Demo

> You must run this in a secure context (`https://` or `localhost`) due to browser security restrictions for screen capturing.

## 📁 Project Structure

* `index.html` – UI layout and buttons
* `styles.css` – Optional styles (not included in this repo)
* `app.js` – Core JavaScript logic (code you provided)
* `README.md` – This file

## 🛠 How It Works

This app uses the `MediaRecorder` API to record the screen via `navigator.mediaDevices.getDisplayMedia()`. Here's a quick breakdown:

1. **Start Recording**:

   * Prompts the user to select a screen/window/tab to capture.
   * Begins recording using the best supported MIME type (`vp9`, `vp8`, or fallback `webm`).

2. **Pause/Resume**:

   * Toggle between paused and recording states using the same button.

3. **Stop**:

   * Stops recording and stops all active tracks from the media stream.

4. **Preview & Download**:

   * Once recording is stopped, a video preview is shown.
   * The video can be downloaded in `.webm` format.

## 📜 License

This project is provided as-is, without any warranty.  
Use it at your own risk.

See the [LICENSE.md] file for details.
---
