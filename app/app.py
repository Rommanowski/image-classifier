from flask import Flask, redirect, url_for, render_template, request, jsonify
from utils import *

app = Flask(__name__)

# model = Net().to(device)
# model.load_state_dict(torch.load("model_extended_final_dict.pth", weights_only=True))
# model.eval()

model = torch.load("model_extended_final.pth", weights_only=False, map_location=torch.device('cpu'))
model.eval()


@app.route('/')
def main():
    return render_template('canvas_freeplay.html')

@app.route('/PlayGame')
def game():
    return render_template('canvas_game.html')

@app.route('/home')
def home():
    return render_template('home.html', val=labels)

@app.route('/About')
def about():
    return render_template('about.html')

@app.route('/get_labels')
def getlabels():
    return jsonify(labels)

    
@app.route('/compute/', methods=['POST'] )
def compute():
    if request.method == 'POST':
        value = request.form['value']
        if value=="":
            value="1"*128*128
        try:
            output = string_to_index(model, value)
            return output
        except:
            return f"some error with passing the value through the model"


if __name__ == "__main__":
    app.run(debug=True)
