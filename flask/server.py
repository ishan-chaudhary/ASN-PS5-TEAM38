# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

# load Flask 
import flask
from math import sin, cos, sqrt, atan2, radians
from keras.models import model_from_json
from keras import optimizers
from keras import backend

# User Inputs
GET_LATEST_FILE = False      # if true will get the the latest model from the models folder
model_name_json = './models/danish_model_linear_30ep_2018-08-14-15-15.json'        # if false, specify filename here
model_name_h5 = './models/danish_model_linear_30ep_2018-08-14-15-15.h5'          # if false, specify filename here


json_file = open(model_name_json, 'r')

loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)


loaded_model.load_weights(model_name_h5)
print("Loaded model based on user input: \n", model_name_h5)

# Function Definitions
def rmse(y_true, y_pred):
    return backend.sqrt(backend.mean(backend.square(y_pred - y_true), axis=-1))


# Get distance between pairs of lat-lon points (in meters)
def distance(lat1, lon1, lat2, lon2):
    r = 6373.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    dist = r*c*1000

    return dist


# Custom adam optimizer
adam = optimizers.Adam(lr=0.0005, beta_1=0.9, beta_2=0.999, epsilon=None, decay=0.0, amsgrad=False)

# evaluate loaded model on test data
loaded_model.compile(loss='mse',
                     optimizer=adam,
                     metrics=[rmse])


app = flask.Flask(__name__)# define a predict function as an endpoint 
@app.route("/predict", methods=["GET","POST"])
def predict():
    data = {"success": False}    # get the request parameters
    params = flask.request.json
    if (params == None):
        params = flask.request.args    # if parameters are found, echo the msg parameter 
    if (params != None):
        data["response"] = params.get("msg")
        data["success"] = True    # return a response in json format 
    return flask.jsonify(data)# start the flask app, allow remote connections
app.run(host='0.0.0.0')