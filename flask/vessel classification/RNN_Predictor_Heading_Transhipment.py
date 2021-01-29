# Recurrent Neural Network
# Predictor for predicting missing heading data of illegal transhipment ships

# Part 1 - Data Preprocessing

# Importing the libraries
import numpy as np
import pandas as pd

# Importing the training set
dataset_train = pd.read_csv('DATASET_VALIDATION_HEAD.csv')
training_set = dataset_train.iloc[:10, 7:8].values

# Feature Scaling with Normalization
from sklearn.preprocessing import MinMaxScaler
sc = MinMaxScaler(feature_range = (0, 1))
training_set_scaled = sc.fit_transform(training_set)

# Creating a data structure with 2 timesteps and 1 output
X_train = []
y_train = []
for i in range(2, 10):
    X_train.append(training_set_scaled[i-2:i, 0])
    y_train.append(training_set_scaled[i, 0])
X_train, y_train = np.array(X_train), np.array(y_train)

# Reshaping
X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))


# Part 2 - Building the RNN

# Importing the Keras libraries and packages
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout
from keras.optimizers import Adam

# Initialising the RNN
regressor = Sequential()

# Adding the input layer, the first LSTM layer and some Dropout regularisation
regressor.add(LSTM(units = 10, return_sequences = False, input_shape = (X_train.shape[1], 1)))
regressor.add(Dropout(0.2))

# Adding the output layer
regressor.add(Dense(units = 1))

# Compiling the RNN
#learning rate = 0.001, 0.005, 0.01, 0.05, 0.1
opt = Adam(learning_rate = 0.1)
regressor.compile(optimizer = opt, loss = 'mean_squared_error')

# Fitting the RNN to the Training set
regressor.fit(X_train, y_train, epochs = 100, batch_size = 2)


# Part 3 - Making the predictions and validating the results

dataset_test = pd.read_csv('DATASET_VALIDATION_HEAD.csv')
actual_data = dataset_test.iloc[10:, 7:8].values

inputs = dataset_test.iloc[8:, 7:8].values
inputs = sc.transform(inputs)
X_test = []
for i in range(2, 12):
    X_test.append(inputs[i-2:i, 0])
X_test = np.array(X_test)
X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
predicted_heading_trans = regressor.predict(X_test)
predicted_heading_trans = sc.inverse_transform(predicted_heading_trans)

# Evaluating
import math
from sklearn.metrics import mean_squared_error
rmse = math.sqrt(mean_squared_error(actual_data, predicted_heading_trans))
mape_Heading = np.abs((actual_data - predicted_heading_trans) / actual_data).mean(axis=0) * 100
