import os
import tensorflow as tf
from .architecture.crnn import build_crnn
from .utils.losses import CTCLoss
from .utils.metrics import CWERMetric
from .callbacks import get_callbacks

def train(configs, train_data_provider, val_data_provider):
    os.makedirs(configs.model_path, exist_ok=True)

    model = build_crnn(
        input_dim=(configs.height, configs.width, 3),
        output_dim=len(configs.vocab),
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=configs.learning_rate),
        loss=CTCLoss(),
        metrics=[CWERMetric(padding_token=len(configs.vocab))],
        run_eagerly=False,
    )
    model.summary(line_length=110)

    model.fit(
        train_data_provider,
        validation_data=val_data_provider,
        epochs=configs.train_epochs,
        callbacks=get_callbacks(configs),
        workers=configs.train_workers,
        use_multiprocessing=configs.train_workers > 0,
    )

    # optional: if your provider has to_csv
    try:
        import stow
        train_data_provider.to_csv(stow.join(configs.model_path, "train.csv"))
        val_data_provider.to_csv(stow.join(configs.model_path, "val.csv"))
    except Exception:
        pass

    return model
