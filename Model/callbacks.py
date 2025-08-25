import os
import tensorflow as tf

def get_callbacks(configs):
    os.makedirs(configs.model_path, exist_ok=True)

    cb = [
        tf.keras.callbacks.EarlyStopping(monitor="val_CER", patience=20, verbose=1, mode="min"),
        tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(configs.model_path, "model.h5"),
            monitor="val_CER",
            save_best_only=True,
            save_weights_only=False,
            mode="min",
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_CER", factor=0.9, patience=10, min_delta=1e-10, verbose=1, mode="min"
        ),
        tf.keras.callbacks.TensorBoard(log_dir=os.path.join(configs.model_path, "logs"), update_freq="batch"),
    ]

    # optional: mltu helpers if available
    try:
        from mltu.callbacks import TrainLogger, Model2onnx
        cb.append(TrainLogger(configs.model_path))
        cb.append(Model2onnx(os.path.join(configs.model_path, "model.h5")))
    except Exception:
        pass

    return cb
