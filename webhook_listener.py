#!/usr/bin/env python3
"""
Flask webhook listener for Clerk registration events.
This script listens for webhook requests from Clerk and prints the entire payload.
"""

from flask import Flask, request, jsonify
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/webhook/clerk', methods=['POST'])
def clerk_webhook():
    """
    Handle Clerk webhook requests for registration events.
    Prints the entire webhook payload for debugging and monitoring.
    """
    try:
        # Get the raw request data
        raw_data = request.get_data()
        
        # Get headers
        headers = dict(request.headers)
        
        # Get JSON payload if available
        json_data = None
        if request.is_json:
            json_data = request.get_json()
        
        # Get form data if available
        form_data = None
        if request.form:
            form_data = dict(request.form)
        
        # Print comprehensive webhook information
        print("\n" + "="*80)
        print(f"WEBHOOK RECEIVED AT: {datetime.now().isoformat()}")
        print("="*80)
        
        print("\n--- HEADERS ---")
        for key, value in headers.items():
            print(f"{key}: {value}")
        
        print("\n--- RAW REQUEST DATA ---")
        print(f"Content-Type: {request.content_type}")
        print(f"Content-Length: {len(raw_data)}")
        print(f"Raw Data: {raw_data.decode('utf-8', errors='ignore')}")
        
        if json_data:
            print("\n--- JSON PAYLOAD ---")
            print(json.dumps(json_data, indent=2, ensure_ascii=False))
        
        if form_data:
            print("\n--- FORM DATA ---")
            for key, value in form_data.items():
                print(f"{key}: {value}")
        
        print("\n--- REQUEST INFO ---")
        print(f"Method: {request.method}")
        print(f"URL: {request.url}")
        print(f"Remote Address: {request.remote_addr}")
        print(f"User Agent: {request.headers.get('User-Agent', 'N/A')}")
        
        # Log the event type if it's a Clerk webhook
        if json_data and 'type' in json_data:
            event_type = json_data.get('type')
            print(f"\n--- CLERK EVENT TYPE ---")
            print(f"Event Type: {event_type}")
            
            # Check if it's a registration-related event
            registration_events = [
                'user.created',
                'user.updated',
                'user.deleted',
                'session.created',
                'session.ended',
                'session.removed',
                'session.updated'
            ]
            
            if event_type in registration_events:
                print(f"✓ This is a registration-related event: {event_type}")
            else:
                print(f"ℹ This is a {event_type} event (not specifically registration)")
        
        print("="*80)
        print()
        
        # Log to file as well
        logger.info(f"Webhook received: {request.method} {request.url}")
        if json_data and 'type' in json_data:
            logger.info(f"Event type: {json_data.get('type')}")
        
        # Return success response
        return jsonify({
            'status': 'success',
            'message': 'Webhook received and processed',
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        print(f"\nERROR PROCESSING WEBHOOK: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Error processing webhook',
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Clerk Webhook Listener'
    }), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with basic information."""
    return jsonify({
        'message': 'Clerk Webhook Listener',
        'endpoints': {
            'webhook': '/webhook/clerk (POST)',
            'health': '/health (GET)',
            'home': '/ (GET)'
        },
        'instructions': 'Send Clerk webhooks to /webhook/clerk endpoint'
    }), 200

if __name__ == '__main__':
    print("Starting Clerk Webhook Listener...")
    print("Webhook endpoint: http://localhost:5000/webhook/clerk")
    print("Health check: http://localhost:5000/health")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',  # Listen on all interfaces
        port=5001,
        debug=True,  # Enable debug mode for development
        threaded=True  # Enable threading for better performance
    )
