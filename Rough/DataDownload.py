from datasets import load_dataset

# Load the IAM dataset
iam_dataset = load_dataset("Teklia/IAM-line")

# You can now access different splits, like the training set
train_split = iam_dataset["train"]

# Let's see the first example
print(train_split[0])