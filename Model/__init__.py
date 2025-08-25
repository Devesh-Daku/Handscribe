from .config import ModelConfigs
from .train import train
from .inference import ImageToWordModel
# kept so older imports still work
from .architecture.crnn import build_crnn as train_model
