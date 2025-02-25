from flask import Flask, redirect, url_for, render_template, request
from utils import *

app = Flask(__name__)

# model = Net().to(device)
# model.load_state_dict(torch.load("model_extended_final_dict.pth", weights_only=True))
# model.eval()

model = torch.load("model_extended_final.pth", weights_only=False)
torch.save(model.state_dict(), "model_extended_final_dict.pth")
model.eval()


@app.route('/')
def home():
    return render_template('canvas.html')

    
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
