window.onload = function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const brushSizeInput = document.getElementById("brushSize");
  const brushValueDisplay = document.getElementById("brushValue");
  const canvasErase = document.getElementById("eraseButton");
  let brushBaseSize = 3;
  let drawing = false;
  let brushSize = parseInt(brushSizeInput.value, 10) + brushBaseSize;
  
  // Update brush size display and variable when slider changes
  canvasErase.addEventListener("click", () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
  });

  brushSizeInput.addEventListener("input", () => {
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
    
    // Draw a rectangle of size brushSize x brushSize at the calculated coordinates
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
    .done(function( msg ) {
      $("#result").text(msg);
  })
  // Set up interval to send data every 10 seconds
};
setInterval(fun, 1000);
}