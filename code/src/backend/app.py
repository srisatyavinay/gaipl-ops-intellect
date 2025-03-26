from flask import Flask, request, jsonify, render_template, session, url_for
from flask_session import Session
from backend import get_response as bk_get_response, get_similar_incidents as get_similar_incidents, summarize_root_causes as summarize_root_causes
from flask_cors import CORS
from health_check import run_health_check, load_mock_data

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app)
Session(app)

@app.route('/chatbot_text' , methods=['GET' , 'POST'])
def tchat():
    
    if request.method == 'POST':
        data = request.get_json()
        user_message = data.get('user_message')  # Get message from AJAX requestc
        chatbot_response = session.get('chatbot_response', ["Hello! I am a chatbot assistant. Ask me anything!"])  # Fetch existing session responses
        print(f"User message: {user_message}")
        print("50")
        try:
            # Process the user message using backend logic
            response, chatbot_response = bk_get_response(user_message, chatbot_response)
            session['chatbot_response'] = chatbot_response  # Update session with new responses
            # Send response back to frontend
            return jsonify({'bot_response': response})
        except Exception as e:
            print(f"Error while generating a response: {e}")
            return jsonify({'bot_response': "Error while generating a response."})

@app.route('/get_related_incidents', methods=['POST'])
def fetch_related_incidents():
    data = request.get_json()
    # print(data)
    related_incidents = get_similar_incidents(data)
    
    return jsonify({"related_incidents": related_incidents})

@app.route('/summarize_rca', methods=['POST'])
def summarize_rca():
    data = request.get_json()
    # description = data.get("description", "")
    summary = summarize_root_causes(data)

    return jsonify({"summary": summary})

@app.route('/run_health_check', methods=['GET'])
def health_check():
    health_data = load_mock_data("health_logs.json")
    health_report = run_health_check(health_data)
    return jsonify(health_report)

if __name__ == '__main__':
    app.run(debug=True)

