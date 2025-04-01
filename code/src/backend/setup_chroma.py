import os
import json
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from cryptEncryptionKey import decrypt_string

# Uncomment these lines in linux. Chroma requires sqlite3 >= 3.35.0. But python >= 3.10 may not give this package.
# https://docs.trychroma.com/troubleshooting#sqlite
# Install pysqlite3 package and use it instead of the built-in sqlite3 module.

# __import__('pysqlite3')
# import sys
# sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

with open("creds.json") as f:
    creds = json.load(f)

api_key = decrypt_string(creds.get("api_key"))
os.environ["GOOGLE_API_KEY"] = api_key

if api_key is None:
    raise ValueError("GOOGLE_API_KEY environment variable is not set.")

LLM = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
)
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
persist_directory = "data/chroma"

def generate_chroma_vector_store(json_file_path, collection_name, persist_directory):
    # Load the JSON file
    try:
        with open(json_file_path, "r") as f:
            issues = json.load(f)
    except Exception as e:
        print(f"Error while loading the JSON file: {e}")
        exit()

    # Create documents from the JSON data
    if not isinstance(issues, list):
        raise ValueError("The JSON file must contain a list of issues.")

    documents = []
    for issue in issues:
        id = issue.get("id", "")
        title = issue.get("title", "")
        status = issue.get("status", "")
        priority = issue.get("priority", "")
        description = issue.get("description", "")
        root_cause = issue.get("root_cause", "")
        resolution = issue.get("resolution", "")
        prevention = issue.get("prevention", "")
        body = f"Title:{title}\nDescription: {description}\nRoot Cause: {root_cause}\nResolution: {resolution}\n"

        # Create a document with metadata including all fields
        doc = Document(
            page_content=body,
            metadata={
                "id": id,
                "title": title,
                "status": status,
                "priority": priority,
                "description": description,
                "root_cause": root_cause,
                "resolution": resolution,
                "prevention": prevention,
            },
        )
        documents.append(doc)

    # Initialize Chroma vector store
    vector_store = Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=persist_directory,
    )

    # Add documents to the vector store
    vector_store.add_documents(documents)
    vector_store.persist()

    print("Vector store successfully created.")
    return vector_store


def setup(json_file_path):
    # Generate Chroma vector store
    vector_store = generate_chroma_vector_store(
        json_file_path=json_file_path,
        collection_name="issues_data",
        persist_directory="data/chroma",
    )
    return vector_store


if not os.path.exists(persist_directory) or not os.listdir(persist_directory):
    print("Vector store not found. Setting up a new vector store...")
    setup("incidents.json")
else:
    print("found")
