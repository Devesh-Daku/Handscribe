import os
import stow
import tarfile
from tqdm import tqdm
from urllib.request import urlopen
from io import BytesIO
from zipfile import ZipFile

CHUNK = 1024 * 1024

def download_and_unzip(url: str, extract_to: str = "Datasets", chunk_size: int = CHUNK):
    http_response = urlopen(url)
    total = getattr(http_response, "length", None)
    if total is None:
        # fallback: stream until EOF
        data = http_response.read()
    else:
        data = b""
        iterations = total // chunk_size + 1
        for _ in tqdm(range(iterations), desc="Downloading dataset"):
            chunk = http_response.read(chunk_size)
            if not chunk:
                break
            data += chunk

    ZipFile(BytesIO(data)).extractall(path=extract_to)

def prepare_iam_dataset() -> str:
    """Downloads + extracts IAM words to 'Datasets/IAM_Words/words/' if not present.
    Returns the absolute dataset root path.
    """
    root = stow.join("Datasets", "IAM_Words")
    if not stow.exists(root):
        os.makedirs("Datasets", exist_ok=True)
        download_and_unzip("https://git.io/J0fjL", extract_to="Datasets")
        # extract words.tgz
        tgz = stow.join(root, "words.tgz")
        with tarfile.open(tgz) as tf:
            tf.extractall(stow.join(root, "words"))
    return root
