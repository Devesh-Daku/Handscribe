import os
import time
from mltu.configs import BaseModelConfigs

class ModelConfigs(BaseModelConfigs):
    def __init__(self):
        super().__init__()
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        self.model_path = os.path.join("saved_models", "crnn", timestamp)

        # image geometry (HxW)
        self.height = 32
        self.width = 128

        # training
        self.learning_rate = 1e-3
        self.train_epochs = 100
        self.train_workers = 4
        self.batch_size = 32

        # will be set from preprocessing
        self.vocab = ""
        self.max_text_length = 0
