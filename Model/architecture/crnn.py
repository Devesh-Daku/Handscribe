from keras import layers
from keras.models import Model
from mltu.model_utils import residual_block

def build_crnn(input_dim, output_dim, activation="leaky_relu", dropout=0.2):
    inputs = layers.Input(shape=input_dim, name="input")
    x = layers.Lambda(lambda z: z / 255.0)(inputs)

    x = residual_block(x, 16, activation=activation, skip_conv=True,  strides=1, dropout=dropout)
    x = residual_block(x, 16, activation=activation, skip_conv=True,  strides=2, dropout=dropout)
    x = residual_block(x, 16, activation=activation, skip_conv=False, strides=1, dropout=dropout)

    x = residual_block(x, 32, activation=activation, skip_conv=True,  strides=2, dropout=dropout)
    x = residual_block(x, 32, activation=activation, skip_conv=False, strides=1, dropout=dropout)

    x = residual_block(x, 64, activation=activation, skip_conv=True,  strides=2, dropout=dropout)
    x = residual_block(x, 64, activation=activation, skip_conv=True,  strides=1, dropout=dropout)
    x = residual_block(x, 64, activation=activation, skip_conv=False, strides=1, dropout=dropout)
    x = residual_block(x, 64, activation=activation, skip_conv=False, strides=1, dropout=dropout)

    # (T, C) sequence
    x = layers.Reshape((x.shape[-3] * x.shape[-2], x.shape[-1]))(x)

    x = layers.Bidirectional(layers.LSTM(128, return_sequences=True))(x)
    x = layers.Dropout(dropout)(x)

    outputs = layers.Dense(output_dim + 1, activation="softmax", name="output")(x)
    return Model(inputs=inputs, outputs=outputs)
