const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
let videoFile;
let processedVideoURL;

// Get references to DOM elements
const videoContainer = document.getElementById('video-container');
const videoInput = document.getElementById('video-input');
const processButton = document.getElementById('process-button');
const downloadButton = document.getElementById('download-button');
const videoPlayer = document.getElementById('video-player');
const processedVideoPlayer = document.getElementById('processed-video-player');
const customTextInput = document.getElementById('custom-text');
const fileButton = document.getElementById('file-button'); // Reference to the file input button
const loadingContainer = document.getElementById('loading-container');
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');


videoInput.addEventListener('change', handleFileUpload);
processButton.addEventListener('click', processVideo);
downloadButton.addEventListener('click', downloadVideo);
customTextInput.addEventListener('input', checkConditions);

let inputEntered = false;

function checkConditions() {
  inputEntered = customTextInput.value.trim() !== '';
  console.log(inputEntered)
  if (inputEntered && videoFile) {
    console.log("Input entered");
    document.getElementById('process-button').style.display = 'block'; // Show process button
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  videoFile = file;
  if (file) {
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.load();
    // Change the button text to "Video picked"
    fileButton.textContent = "Video picked";
    // Hide the file input bar
    videoInput.style.display = 'none';
  }
  checkConditions();
}

function toggleVideoControls() {
  const shouldShow = inputEntered && videoFile;
  videoContainer.style.display = shouldShow ? 'flex' : 'none';
}

async function processVideo() {

  if (inputEntered && videoFile) {

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const customText = capitalizeFirstLetter(customTextInput.value);

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
  // ffmpeg.FS('writeFile', 'Roboto-Regular.ttf', await fetchFile('https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/fonts/roboto/Roboto-Regular.ttf'));
  ffmpeg.FS('writeFile', 'cheltemham-300.ttf', await fetchFile('https://times-rho.vercel.app/fonts/cheltenham-300.ttf'));
  ffmpeg.FS('writeFile', 'cheltemham-800.ttf', await fetchFile('https://times-rho.vercel.app/fonts/cheltenham-800.ttf'));
  processButton.style.display = 'none';

// Show the spinner when the processing starts
document.getElementById('loading-container').style.display = 'flex';

// Monitor progress using FFmpeg logs
ffmpeg.setLogger(({ type, message }) => {
  if (type === 'ffout' && message.includes('FFMPEG_END')) {
    // Hide the spinner when the FFMPEG_END message is received
    document.getElementById('loading-container').style.display = 'none';
    console.log('Processing complete!');
  }});

  try {
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-t', '7',
      '-vf', `
       crop=w='min(iw,ih)*0.75':h='min(iw,ih)',
        scale=810:1080,
        setsar=1,
        hue=s=0,
        drawtext=fontfile=/cheltemham-800.ttf:text='THE INTERVIEW':x=(w-text_w)/2:y=68:fontsize=24:fontcolor=white:,
        drawtext=fontfile=/cheltemham-300.ttf:text='${customText}':x=(w-text_w)/2:y=114:fontsize=58:fontcolor=white:
      `,
      '-c:v', 'libx264',
      '-crf', '18',  // Higher quality
      '-preset', 'slow',  // Better compression
      '-an',  // Remove audio
      'interview.mp4'
    );

    const data = ffmpeg.FS('readFile', 'interview.mp4');
    processedVideoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    processedVideoPlayer.src = processedVideoURL;
    toggleVideoControls();
  } catch (error) {
    console.error("Error during video processing:", error);
  }
}
 else {
  alert("Please select a video and enter what your interview is about.");
 }
}

function downloadVideo() {
  const link = document.createElement('a');
  link.href = processedVideoURL;
  link.download = 'processed-video.mp4';
  link.click();
}

function capitalizeFirstLetter(text) {
  return text
    .toLowerCase() // Ensure the text is in lowercase before capitalizing
    .split(' ') // Split text into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the array back into a single string
}
