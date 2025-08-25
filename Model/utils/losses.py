import tensorflow as tf
from tensorflow.keras import backend as K

class CTCLoss(tf.keras.losses.Loss):
    def call(self, y_true, y_pred):
        # y_true: dense padded indices (B, max_len)
        # y_pred: softmax (B, T, C)
        batch_size = tf.shape(y_pred)[0]
        time_steps = tf.shape(y_pred)[1]
        label_len = tf.shape(y_true)[1]

        input_length = tf.fill([batch_size, 1], time_steps)
        label_length = tf.fill([batch_size, 1], label_len)

        return tf.reduce_mean(
            K.ctc_batch_cost(y_true, y_pred, input_length, label_length)
        )
