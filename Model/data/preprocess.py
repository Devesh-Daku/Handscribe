import stow
from tqdm import tqdm

def preprocess_dataset(dataset_path: str):
    """Reads words.txt and builds (image_path, label) pairs, vocab string, and max label length."""
    dataset, vocab, max_len = [], set(), 0

    words_txt = stow.join(dataset_path, "words.txt")
    with open(words_txt, "r") as f:
        lines = f.readlines()

    for line in tqdm(lines, desc="Indexing IAM words"):
        if line.startswith("#"):
            continue
        parts = line.strip().split(" ")
        if len(parts) < 2:
            continue
        if parts[1] == "err":
            continue

        word_id = parts[0]
        folder1 = word_id[:3]
        folder2 = word_id[:8]
        file_name = word_id + ".png"
        label = parts[-1]

        rel_path = stow.join(dataset_path, "words", folder1, folder2, file_name)
        if not stow.exists(rel_path):
            continue

        dataset.append([rel_path, label])
        vocab.update(list(label))
        max_len = max(max_len, len(label))

    vocab = "".join(sorted(vocab))
    return dataset, vocab, max_len
