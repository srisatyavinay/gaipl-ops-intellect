__all__ = [
    "get_vectorstore",
    "get_context_chain",
    "get_convo_chain",
    "get_response",
    "get_similar_incidents",
    "setup",
]

import json
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
import os
from cryptEncryptionKey import decrypt_string

persist_directory = "data/chroma"

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

vector_store = Chroma(
    collection_name="issues_data",
    embedding_function=embeddings,
    persist_directory=persist_directory,
)

# def generate_chroma_vector_store(json_file_path, collection_name, persist_directory):
#     # Load the JSON file
#     try:
#         with open(json_file_path, "r") as f:
#             issues = json.load(f)
#     except Exception as e:
#         print(f"Error while loading the JSON file: {e}")
#         exit()

#     # Create documents from the JSON data
#     if not isinstance(issues, list):
#         raise ValueError("The JSON file must contain a list of issues.")

#     documents = []
#     for issue in issues:
#         id = issue.get("id", "")
#         title = issue.get("title", "")
#         status = issue.get("status", "")
#         priority = issue.get("priority", "")
#         description = issue.get("description", "")
#         root_cause = issue.get("root_cause", "")
#         resolution = issue.get("resolution", "")
#         prevention = issue.get("prevention", "")
#         body = f"Title:{title}\nDescription: {description}\nRoot Cause: {root_cause}\nResolution: {resolution}\n"

#         # Create a document with metadata including all fields
#         doc = Document(
#             page_content=body,
#             metadata={
#                 "id": id,
#                 "title": title,
#                 "status": status,
#                 "priority": priority,
#                 "description": description,
#                 "root_cause": root_cause,
#                 "resolution": resolution,
#                 "prevention": prevention,
#             },
#         )
#         documents.append(doc)

#     # Initialize Chroma vector store
#     vector_store = Chroma(
#         collection_name=collection_name,
#         embedding_function=embeddings,
#         persist_directory=persist_directory,
#     )

#     # Add documents to the vector store
#     vector_store.add_documents(documents)
#     vector_store.persist()

#     print("Vector store successfully created.")
#     return vector_store


# def setup(json_file_path):
#     # Generate Chroma vector store
#     vector_store = generate_chroma_vector_store(
#         json_file_path=json_file_path,
#         collection_name="issues_data",
#         persist_directory="data/chroma",
#     )
#     return vector_store


def get_context_chain(vector_store):
    retriever = vector_store.as_retriever()

    prompt = ChatPromptTemplate.from_messages(
        [
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            (
                "user",
                "Generate a search query to retrieve relevant information based on the conversation.",
            ),
        ]
    )

    retriever_chain = create_history_aware_retriever(LLM, retriever, prompt)
    return retriever_chain


def get_convo_chain(retriever_chain):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Answer the user's questions based on the context:\n\n{context}",
            ),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
        ]
    )

    stuff_chain = create_stuff_documents_chain(LLM, prompt)
    retrieval_chain = create_retrieval_chain(retriever_chain, stuff_chain)

    return retrieval_chain


def get_response(user_input, chat_history):
    retriever_chain = get_context_chain(vector_store)
    convo_chain = get_convo_chain(retriever_chain)
    # Get response from conversation chain
    response = convo_chain.invoke({"chat_history": chat_history, "input": user_input})

    # Handle cases where 'answer' may not exist
    response_text = response.get("answer", "No response generated.")

    # Append to chat history
    chat_history.append({"role": "user", "content": user_input})
    chat_history.append({"role": "assistant", "content": response_text})

    return response_text, chat_history


def get_similar_incidents(user_input):
    # Perform similarity check with Chroma DB
    top_k = 5  # Define the number of top similar documents to retrieve
    similar_docs = vector_store.similarity_search(user_input, k=top_k)

    # Retrieve top k similar incidents as objects with title and description
    similar_incidents = [
        {
            "id": doc.metadata.get("id", "N/A"),
            "body": doc.page_content,
            "metadata": doc.metadata,
        }
        for doc in similar_docs
    ]
    return similar_incidents


def summarize_root_causes(user_input):
    # Get similar incidents
    similar_incidents = get_similar_incidents(user_input)

    # Extract root causes
    root_causes = [
        incident.get("metadata", {}).get("root_cause", "No root cause provided")
        for incident in similar_incidents
    ]
    print(f"Extracted root causes: {root_causes}")  # Log the extracted root causes

    if not root_causes:
        return "No root causes found to summarize."

    # Summarize the root causes using Gemini
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "Summarize the following root causes into a concise explanation:"),
            ("user", "{input_documents}"),
        ]
    )
    summary_chain = create_stuff_documents_chain(
        LLM, prompt, document_variable_name="input_documents"
    )
    root_causes = [Document(page_content=text) for text in root_causes]

    # Ensure the input is not empty
    # summary = summary_chain.invoke({"input_documents": root_causes}).get(
    #     "answer", "No summary generated."
    # )

    summary = summary_chain.invoke({"input_documents": root_causes})

    return summary


# def chatWithGemini(vector_store):
#     chat_history = []
#     while True:
#         user_input = input("You: ")
#         if user_input.lower() in ["exit", "quit"]:
#             print("Exiting chat...")
#             break

#         response, chat_history = get_response(user_input, chat_history, vector_store)
#         print(f"Bot: {response}")


def add_new_incident(new_incident):
    # Convert the new incident into a Document
    new_document = Document(
        page_content=f"Title:{new_incident['title']}\nDescription: {new_incident['description']}\nRoot Cause: {new_incident['root_cause']}\nResolution: {new_incident['resolution']}\n",
        metadata=new_incident,
    )

    # Add the new document to the vector store and persist
    vector_store.add_documents([new_document])
    vector_store.persist()
    print("New incident added to the vector store.")


# def main():

#     if not os.path.exists(persist_directory) or not os.listdir(persist_directory):
#         print("Vector store not found. Setting up a new vector store...")
#         setup("incidents.json")

#     vector_store = Chroma(
#         collection_name="issues_data",
#         embedding_function=embeddings,
#         persist_directory=persist_directory,
#     )
#     # Example of adding a new incident to the vector store

#     # ask_similar_incidents(vector_store)
#     # user_input = input("Enter your query to summarize root causes for incidnest related to your query: ")
#     # summary = summarize_root_causes(user_input, vector_store)
#     # print(f"Summary of root causes: {summary}")
#     add_new_incident(
#         # vector_store,
#         {
#             "id": "INC-1001",
#             "title": "Intermittent DNS Resolution Failures Affecting Internal Web Applications",
#             "status": "Resolved",
#             "priority": "High",
#             "description": "Multiple users across various departments are reporting intermittent difficulties accessing internal web applications. The issue appears to be sporadic, with some users experiencing consistent failures while others are able to access the applications without any problems.  Initial troubleshooting suggests a potential issue with DNS resolution, as some users report being unable to ping internal servers by hostname, while others can. The issue began approximately 2 hours ago and is impacting productivity.",
#             "root_cause": "The primary DNS server experienced intermittent network connectivity issues due to a faulty network interface card (NIC). This resulted in inconsistent DNS resolution, causing some clients to fail to resolve internal hostnames. The secondary DNS server was not properly configured to handle failover traffic, exacerbating the issue.",
#             "resolution": "The faulty NIC on the primary DNS server was replaced.  Following the hardware replacement, network connectivity was restored, and DNS resolution stabilized.  The secondary DNS server was then correctly configured for failover, ensuring redundancy in case of future primary server failures.  All affected users were notified of the resolution and confirmed successful access to the internal web applications. Monitoring of both DNS servers has been implemented to proactively detect future connectivity problems.",
#             "prevention": "Implemented continuous monitoring of both DNS servers using a network monitoring tool.  Automated alerts will be triggered in case of connectivity issues or performance degradation.  Regular health checks of server hardware, including NICs, will be incorporated into the preventative maintenance schedule. Failover testing will be conducted quarterly to ensure the secondary DNS server can effectively handle traffic in the event of a primary server outage.",
#         },
#     )


# if __name__ == "__main__":
#     main()
