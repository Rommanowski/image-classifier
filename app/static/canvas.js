
window.onload = function() {
  //canvas and canvas controls releted vars
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const brushSizeInput = document.getElementById("brushSize");
  const brushValueDisplay = document.getElementById("brushValue");
  const canvasErase = document.getElementById("eraseButton");
  const skip_button = document.getElementById("skip_button");
  let brushBaseSize = 3;
  let drawing = false;
  let brushSize = parseInt(brushSizeInput.value, 10) + brushBaseSize;
  
  //points releted vars
  let points = 0;
  let pointsDisplay = document.getElementById("points-display");

  //sounds vars (should be modified in the future)
  const correctGuess = document.getElementById("cheer");
  const click = document.getElementById("click");

  //timer and timing releted vars
  let timeLimit = 46;
  let timeLeft = 0;
  let timerId = null;
  const timerDisplay = document.getElementById('timer');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');

  function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  }

  function startTimer() {
      if (timerId) return;
      playBtn.disabled = true;
      timerDisplay.classList.remove('completed');
      show_next_image();
      timeLeft = timeLimit;
      timerId = setInterval(() => {
          timeLeft--;
          timerDisplay.textContent = formatTime(timeLeft);

          if (timeLeft <= 0) {
              clearInterval(timerId);
              timerId = null;
              timerDisplay.classList.add('completed', 'animate__animated', 'animate__bounce');
              playBtn.disabled = false;
          }
      }, 1000);
  }

  function resetTimer() {
      clearInterval(timerId);
      timerId = null;
      timeLeft = timeLimit;
      timerDisplay.textContent = formatTime(timeLeft);
      timerDisplay.classList.remove('completed', 'animate__animated', 'animate__bounce');
      playBtn.disabled = false;
  }

  playBtn.addEventListener('click', startTimer);
  resetBtn.addEventListener('click', resetTimer);

  skip_button.addEventListener("click", clear_board);
  skip_button.addEventListener("click", () =>{
    clear_board();
    set_target();
  });
  
  function clear_board(){
    click.play()
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
  }

  function add_points(){
    if(timeLeft != 0)
      points += 1;
    return `${points}`;
  }

  function show_next_image(){
    set_target();
    clear_board();
    $('#result').text('...');
    $('#to_draw');
    $('#points-display').text(add_points());
  }

  canvasErase.addEventListener("click", () => {
    clear_board();
  });

  brushSizeInput.addEventListener("input", () => {
    click.play()
    brushSize = parseInt(brushSizeInput.value, 10) + brushBaseSize;
    brushValueDisplay.textContent = brushSize - brushBaseSize;
  });
  // Initialize canvas to white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black"; // Set drawing color to black
  
  // Mouse event listeners for drawing
  canvas.addEventListener("mousedown", (event) => {
    drawing = true;
    draw(event); // Draw immediately on click
  });
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mouseleave", () => drawing = false);
  canvas.addEventListener("mousemove", draw);
  
  
  function draw(event) {
    if (!drawing) return;
    
    // Calculate correct canvas coordinates based on scaling
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    
    ctx.fillRect(x, y, brushSize, brushSize);
  }
  
  // Function to convert the canvas to a binary string (1 = black, 0 = white)
  function canvasToBinaryString() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let binaryString = "";
    for (let i = 0; i < imageData.length; i += 4) {
      // Check if pixel is black (RGB all 0)
      const isBlack = imageData[i] === 0 && imageData[i + 1] === 0 && imageData[i + 2] === 0;
      binaryString += isBlack ? "0" : "1";
    }
    return binaryString;
  }
  
  // Function to send the binary string to the server every 10 seconds
  function fun() {
    let binaryString = canvasToBinaryString();
    $.ajax({
      method: "POST",
      url: "/compute/",
      data: {value: binaryString},
    })
    .done(function( prediction ) {
      $("#result").text( prediction.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase()) );
      if(compare_results()){
        $('#to_draw').text('good!');
        ctx.fillStyle = 'rgba(255,255,255, 0)';
        correctGuess.play()
        confetti({particleCount: 150});
        setTimeout(show_next_image, 1000);
      }
      if(timeLeft == 0){
        points = 0;
        $('#points-display').text(`${points}`);
      }
  })
  // Set up interval to send data every 10 seconds
};
setInterval(fun, 100);
}