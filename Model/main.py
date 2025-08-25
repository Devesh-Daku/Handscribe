import os
import argparse
import random
import cv2
import numpy as np
import pandas as pd
from tqdm import tqdm

from data.download import prepare_iam_dataset
from data.preprocess import preprocess_dataset
from config import ModelConfigs
from train import train as train_fn

# TRY to use mltu pipeline (what your tutorial uses)
def _build_providers_with_mltu(pairs, configs, split=0.1):
    from mltu.tensorflow.dataProvider import DataProvider
    from mltu.transformers import ImageReader, ImageResizer
    from mltu.tensorflow.transformers import LabelIndexer, LabelPadding
    from mltu.augmentors import RandomBrightness, RandomRotate, RandomErodeDilate

    random.shuffle(pairs)
    n_val = int(len(pairs) * split)
    val_pairs = pairs[:n_val]
    train_pairs = pairs[n_val:]

    # transformers
    transformers = [
        ImageReader(),
        ImageResizer((configs.width, configs.height), keep_aspect_ratio=True),
        LabelIndexer(configs.vocab),
        LabelPadding(max_word_length=configs.max_text_length, padding_value=len(configs.vocab)),
    ]

    train_augs = [RandomBrightness(), RandomRotate(), RandomErodeDilate()]
    val_augs = []

    train_dp = DataProvider(
        data=train_pairs,
        transformers=transformers,
        augmentors=train_augs,
        batch_size=configs.batch_size,
        shuffle=True,
    )
    val_dp = DataProvider(
        data=val_pairs,
        transformers=transformers,
        augmentors=val_augs,
        batch_size=configs.batch_size,
        shuffle=False,
    )
    return train_dp, val_dp

def cmd_prepare(args):
    dataset_root = prepare_iam_dataset()
    dataset, vocab, max_len = preprocess_dataset(dataset_root)

    cfg = ModelConfigs()
    cfg.vocab = vocab
    cfg.max_text_length = max_len
    cfg.save()
    print(f"[OK] Prepared. vocab size={len(vocab)}, max_len={max_len}")
    print(f"[OK] Configs saved to: {cfg.model_path}")

def cmd_train(args):
    dataset_root = prepare_iam_dataset()
    dataset, vocab, max_len = preprocess_dataset(dataset_root)

    cfg = ModelConfigs()
    cfg.vocab = vocab
    cfg.max_text_length = max_len
    cfg.save()

    # try mltu providers, else fall back
    try:
        train_dp, val_dp = _build_providers_with_mltu(dataset, cfg, split=0.1)
    except Exception as e:
        raise RuntimeError(
            "mltu pipeline not available. Install mltu==0.1.5 and ensure 'mltu.tensorflow' is importable."
        ) from e

    train_fn(cfg, train_dp, val_dp)

def cmd_infer(args):
    from inference import ImageToWordModel
    from mltu.configs import BaseModelConfigs

    cfg_path = args.config or None
    if cfg_path is None:
        # default: latest timestamp folder under saved_models/crnn
        root = os.path.join("saved_models", "crnn")
        if not os.path.isdir(root) or not os.listdir(root):
            raise FileNotFoundError("No saved models found. Run 'python -m model.main train' first.")
        latest = sorted(os.listdir(root))[-1]
        cfg_path = os.path.join(root, latest, "configs.yaml")

    configs = BaseModelConfigs.load(cfg_path)
    model = ImageToWordModel(model_path=configs.model_path, char_list=configs.vocab)

    image = cv2.imread(args.image)
    if image is None:
        raise FileNotFoundError(f"Image not found: {args.image}")
    text = model.predict(image)
    print(f"[PRED] {args.image} -> {text}")

def cmd_eval(args):
    from inference import ImageToWordModel
    from mltu.configs import BaseModelConfigs
    from mltu.utils.text_utils import get_cer

    cfg_path = args.config or None
    if cfg_path is None:
        root = os.path.join("saved_models", "crnn")
        latest = sorted(os.listdir(root))[-1]
        cfg_path = os.path.join(root, latest, "configs.yaml")

    configs = BaseModelConfigs.load(cfg_path)
    model = ImageToWordModel(model_path=configs.model_path, char_list=configs.vocab)

    val_csv = os.path.join(configs.model_path, "val.csv")
    df = pd.read_csv(val_csv).values.tolist()

    acc = []
    for image_path, label in tqdm(df, desc="Evaluating"):
        image = cv2.imread(image_path)
        pred = model.predict(image)
        cer = get_cer(pred, label)
        acc.append(cer)
        if args.verbose:
            print(f"GT: {label} | PRED: {pred} | CER: {cer:.3f}")
    print(f"[EVAL] Avg CER: {np.mean(acc):.4f}")

def build_cli():
    p = argparse.ArgumentParser(prog="handwritten words recognition")
    sub = p.add_subparsers(dest="cmd")

    sub.add_parser("prepare", help="download & index dataset")

    tr = sub.add_parser("train", help="train model")
    tr.add_argument("--epochs", type=int, default=None, help="override epochs")

    inf = sub.add_parser("infer", help="infer on one image")
    inf.add_argument("--image", required=True, help="path to image")
    inf.add_argument("--config", default=None, help="path to configs.yaml")

    ev = sub.add_parser("eval", help="evaluate on validation CSV")
    ev.add_argument("--config", default=None, help="path to configs.yaml")
    ev.add_argument("--verbose", action="store_true")

    return p

if __name__ == "__main__":
    parser = build_cli()
    args = parser.parse_args()

    if args.cmd == "prepare":
        cmd_prepare(args)
    elif args.cmd == "train":
        if args.epochs:
            # quick override without editing config class
            from config import ModelConfigs
            cfg = ModelConfigs()
            cfg.train_epochs = args.epochs
            cfg.save()
        cmd_train(args)
    elif args.cmd == "infer":
        cmd_infer(args)
    elif args.cmd == "eval":
        cmd_eval(args)
    else:
        parser.print_help()
