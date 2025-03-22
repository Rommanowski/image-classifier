# 🎨 Doodle Recognition AI
A web-based image recognition project that identifies doodles using a deep learning model. This project utilizes Flask, PyTorch, HTML/CSS (Bootstrap), and JavaScript to create an interactive platform where users can draw and get real-time predictions from an AI model.

### 🎥 Video demonstration: [Doodle Recognition AI VIDEO](https://youtu.be/LELwg6EjEug?si=gUnC7-vZIqSrNgJ0)

<img src="https://github.com/user-attachments/assets/262a330b-1d8b-4da3-8d4c-14d2aa473b54" width=50% height=50%>


## 🚀 Features

+ Deep Learning Model: Uses a Convolutional Neural Network (CNN) trained to recognize doodles.

+ Real-time Predictions: Draw in the browser, and the AI guesses your doodle instantly.

+ Game Mode: A timed challenge where users try to draw as many recognized doodles as possible.

+ User-Friendly Interface: Intuitive UI with brush controls, an eraser, and feedback on AI predictions.

+ Flask Backend: Serves the web interface and processes images for AI predictions.

## 📜 Requirements
Make sure you have Python 3.8+ and pip installed.

Install dependencies using:
```sh
pip install utils
pip install flask
pip install torch
pip install torchvision
pip install pillow
```
## 🛠️ Setup & Usage
1️⃣ Clone the repository
```sh
git clone https://github.com/Rommanowski/image-classifier.git
cd image-classifier/app
```
2️⃣ Run the Flask Server
```sh
python3 app.py
```
3️⃣ Open the Web App
+ Go to http://127.0.0.1:5000/ in your browser.
+ Start drawing on the canvas and let the AI predict your doodle!

## 🎮 Game Mode
Want to make it more fun? Click on Play Game to start a timed doodle challenge.
+ Try to draw the given object.
+ AI will try to recognize your drawing.
+ Earn points for correct guesses before the timer runs out!

## 🏗️ How It Works
1. **The AI Model (PyTorch CNN)**
+ The AI model is a Convolutional Neural Network (CNN) trained on a dataset of doodles.
+ It takes an input 28x28 grayscale image and predicts one of 92 possible classes.
```python
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.feature_extractor = nn.Sequential(  
            nn.Conv2d(1, 32, kernel_size=3, padding=1), 
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
            # More layers...
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128*7*7, 512),
            nn.ReLU(),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Linear(256, 92)
        )
```
+ It processes the drawn image and outputs the most likely doodle class.

2. **Flask Backend (app.py) Handles the following**:

    ✅ Rendering pages (/, /PlayGame, /About)
   
    ✅ Serving AI predictions (/compute/)
   
    ✅ Providing category labels (/get_labels)
3. **Frontend (JavaScript & HTML)**
+ Canvas Drawing: Users draw using JavaScript canvas.
+ AI Integration: Canvas data is sent to the Flask server via AJAX.
+ Game Mode: A timer-based game using JavaScript to track points and progress.
```js
function canvasToBinaryString() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let binaryString = "";
    for (let i = 0; i < imageData.length; i += 4) {
        const isBlack = imageData[i] === 0;
        binaryString += isBlack ? "0" : "1";
    }
    return binaryString;
}
```
+ This function converts the drawn image into a format readable by the AI.
4. **Bootstrap Usage in the Project**
+ This project utilizes Bootstrap to enhance the design and responsiveness of the website.
+ The use of Bootstrap ensures responsiveness, aesthetic appeal, and improved usability across different screen sizes.
## 📜 License

This project is licensed under the **MIT License**.
## 🤝 Contributing

Pull requests are welcome! If you'd like to contribute, fork the repo and submit a PR.
