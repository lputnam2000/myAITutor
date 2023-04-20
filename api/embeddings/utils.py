import requests
from concurrent.futures import ThreadPoolExecutor
import heapq
import json

def get_class_names(key):
    if isinstance(key, str):
        return f"Document_{key.replace('-', '_')}"
    elif isinstance(key, list):
        return [{f"Document_{s.replace('-', '_')}" for s in key}]
    else:
        raise ValueError("key must be either a string or a list of strings")

def get_context_from_single_document(args, limit=3):
    (weaviate_client, class_name, embedding) = args
    search_result = weaviate_client.query \
        .get(class_name=str(class_name), properties=["text"]) \
        .with_near_vector({"vector": embedding}) \
        .with_limit(limit)\
        .with_additional(['certainty'])\
        .do()
    return [{'text': k['text'], 'certainty': k['_additional']['certainty']} for k in search_result['data']['Get']['Document_' + class_name]]

def get_contexts_from_multiple_documents(weaviate_client, searchText, keys, limit=3):
    response = requests.post("/query_to_embedding", json={"query": searchText}, headers={"X-API-Key": "YOUR_CB_API_SECRET", "Content-Type": "application/json"})
    data = json.loads(response.text)
    embeddingString = data["embedding"]
    embeddingArray = list(map(int, embeddingString.split(",")))
    class_names = get_class_names(keys)
    tasks_to_run = [(weaviate_client, c, embeddingArray) for c in class_names]
    with ThreadPoolExecutor(max_workers=2) as executor:
        context_results = list(executor.map(get_context_from_single_document, tasks_to_run))

    top_results = []
    for sublist in context_results:
        for item in sublist:
            if len(top_results) < limit:
                heapq.heappush(top_results, (item['certainty'], item))
            elif item['certainty'] > top_results[0][0]:
                heapq.heappushpop(top_results, (item['certainty'], item))

    # Extract the sorted results from the priority queue
    sorted_results = [heapq.heappop(top_results)[1] for _ in range(len(top_results))][::-1]

    return sorted_results