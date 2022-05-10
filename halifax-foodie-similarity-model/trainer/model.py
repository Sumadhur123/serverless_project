import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from google.cloud import storage


def create():
    storage_client = storage.Client()

    bucket_name = "recipe-classification-data"
    input_bucket_name = "recipe-classification-input"
    output_bucket_name = "recipe-classification-output"

    data_bucket = storage_client.get_bucket(bucket_name)
    input_bucket = storage_client.get_bucket(input_bucket_name)
    output_bucket = storage_client.get_bucket(output_bucket_name)

    output_file_name = "classified-recipe"

    blobs = storage_client.list_blobs(bucket_name)
    documents = []
    file_names = []
    for blob in blobs:
        file_names.append(blob.name)
        documents.append(blob.download_as_string().decode("utf-8"))

    input_doc = ""
    input_data_blob = storage_client.list_blobs(input_bucket_name)
    for input_blob in input_data_blob:
        input_doc = input_blob.download_as_string().decode("utf-8")
        documents.append(input_doc)
        file_names.append(input_blob.name)
        input_bucket.copy_blob(input_blob, data_bucket, input_blob.name)
        input_blob.delete()

    vector = TfidfVectorizer(min_df=1, stop_words="english")
    tfidf = vector.fit_transform(documents)
    pairwise_similarity = tfidf * tfidf.T
    a = pairwise_similarity.toarray()
    np.fill_diagonal(a, np.nan)
    input_idx = documents.index(input_doc)
    result_idx = np.nanargmax(a[input_idx])

    output_blob = output_bucket.blob(output_file_name)
    output_blob.upload_from_string(file_names[result_idx])

    print(documents[result_idx])
    print(file_names[result_idx])

    return documents[result_idx]