from huggingface_hub import HfApi
api = HfApi()
datasets = api.list_datasets(search="myscheme")
for d in datasets:
    print(f"Dataset: {d.id}, Downloads: {d.downloads}")

datasets2 = api.list_datasets(search="indian government schemes")
for d in datasets2:
    print(f"Dataset: {d.id}, Downloads: {d.downloads}")
