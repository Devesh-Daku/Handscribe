import tensorflow as tf
import numpy as np

# we rely on mltu's decoder if present; else do simple argmax->collapse
def _greedy_decode(y_pred, blank_idx):
    # y_pred: (B, T, C)
    seq = np.argmax(y_pred, axis=-1)  # (B, T)
    results = []
    for row in seq:
        prev = None
        out = []
        for idx in row:
            if idx != blank_idx and idx != prev:
                out.append(int(idx))
            prev = idx
        results.append(out)
    return results

def _cer(pred, gt):
    # simple Levenshtein distance / len(gt)
    import numpy as _np
    m, n = len(gt), len(pred)
    dp = [[i + j if i*j==0 else 0 for j in range(n+1)] for i in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            dp[i][j] = min(
                dp[i-1][j] + 1,
                dp[i][j-1] + 1,
                dp[i-1][j-1] + (0 if gt[i-1]==pred[j-1] else 1),
            )
    return dp[m][n] / max(1, m)

class CWERMetric(tf.keras.metrics.Metric):
    """Reports average CER; padding_token is the index used as 'blank'."""
    def __init__(self, padding_token: int, name="CER", **kwargs):
        super().__init__(name=name, **kwargs)
        self.padding_token = padding_token
        self.total = self.add_weight(name="total", initializer="zeros", dtype=tf.float32)
        self.count = self.add_weight(name="count", initializer="zeros", dtype=tf.float32)

    def update_state(self, y_true, y_pred, sample_weight=None):
        # convert tensors to numpy for decoding
        y_true = y_true.numpy() if isinstance(y_true, tf.Tensor) else y_true
        y_pred = y_pred.numpy() if isinstance(y_pred, tf.Tensor) else y_pred

        # decode preds
        try:
            from mltu.utils.text_utils import ctc_decoder
            decoded = ctc_decoder(y_pred, list(range(self.padding_token)))
        except Exception:
            decoded = _greedy_decode(y_pred, blank_idx=self.padding_token)

        # turn y_true indices back to list (remove padding)
        truths = []
        for row in y_true:
            row = [int(x) for x in row if int(x) != self.padding_token]
            truths.append(row)

        # CER per sample
        for gt, pred in zip(truths, decoded):
            cer = _cer(pred, gt)
            self.total.assign_add(float(cer))
            self.count.assign_add(1.0)

    def result(self):
        return tf.math.divide_no_nan(self.total, self.count)
