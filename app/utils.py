# imports
import torch
import torch.nn as nn
from torchvision import transforms
import numpy as np
from PIL import Image
import os

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# model
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.feature_extractor = nn.Sequential(  
            #0
            #1x28x28
            # 1
            nn.Conv2d(1, 32, kernel_size=3, padding=1), 
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),   #32x14x14
            # 2
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),     #64x14x14
            # 3
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),    #128x7x7
            #4
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU()    #128x7x7
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128*7*7, 512),
            nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(256, 35)
        )
        
    def forward(self, x):
        x = x.view(-1, 1, 28, 28)  # Reshape input to (batch_size, 1, 28, 28)
        x = 1.0 - x
        x = self.feature_extractor(x)
        x = self.classifier(x)
        x = x.squeeze()
        return x
    
# this function gets rid of very light pixels, and darkens the dark grey ones, used to make the input more machine-friendly
def sharpen_image(tensor, upper_treshold=0.75, lower_treshold=0.25):
    # Ustawiamy piksele < 0.5 na 0
    tensor[tensor > upper_treshold] = 1
    tensor[tensor < lower_treshold] = 0
    return tensor

# transforming 128x128 PIL image to 28x28 tensor
# ( just reshaping seemed to loose a lot of quality )
user_transforms=transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x.to(device)),
    transforms.Lambda(lambda x: 1-x),
    nn.MaxPool2d(kernel_size=2),
    transforms.Lambda(lambda x: sharpen_image(x, 0.7, 0.4)),
    #nn.MaxPool2d(kernel_size=2),
    transforms.Resize((28,28)),
    transforms.Lambda(lambda x: 1-x),
    transforms.Lambda(lambda x: sharpen_image(x, 0.6, 0.4)),
])

labels = []
with open("labels.txt", "r") as file:
    labels = file.read().splitlines()

idx_to_class = {}
for k, v in enumerate(labels):
    idx_to_class[k] = v


def string_to_index(model, string_image):
    array_image = np.zeros(len(string_image))
    for i in range(len(string_image)):
        array_image[i] = string_image[i] * 255
    array_image = array_image.reshape(128,128)
    array_image = Image.fromarray(array_image)
    array_image = user_transforms(array_image)
    
    softmax = nn.Softmax(dim=0)
    output = model(array_image)
    output_numpy = softmax(output).detach().cpu().numpy().squeeze()
    index_predicted = np.argmax(output_numpy)
    probability = max(output_numpy)*100
    
    if probability < 60:
        return '...'
    
    return idx_to_class[index_predicted]