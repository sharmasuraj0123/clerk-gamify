# Clerk Webhook Listener

A Flask-based webhook listener that receives and logs Clerk registration events and other webhook data.

## Features

- Listens for Clerk webhook events on `/webhook/clerk` endpoint
- Prints comprehensive webhook information including:
  - Headers
  - Raw request data
  - JSON payload (if available)
  - Form data (if available)
  - Request metadata
- Identifies registration-related events
- Health check endpoint
- Error handling and logging

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the webhook listener:**
   ```bash
   python webhook_listener.py
   ```

3. **The server will start on:**
   - Webhook endpoint: `http://localhost:5000/webhook/clerk`
   - Health check: `http://localhost:5000/health`
   - Home: `http://localhost:5000/`

## Usage

### Testing with curl

You can test the webhook listener with curl:

```bash
# Test with JSON payload
curl -X POST http://localhost:5000/webhook/clerk \
  -H "Content-Type: application/json" \
  -d '{"type": "user.created", "data": {"id": "user_123", "email": "test@example.com"}}'

# Test with form data
curl -X POST http://localhost:5000/webhook/clerk \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "type=user.created&data=test"
```

### Clerk Webhook Configuration

1. In your Clerk dashboard, go to Webhooks
2. Create a new webhook endpoint
3. Set the endpoint URL to: `https://your-domain.com/webhook/clerk`
4. Select the events you want to listen for (e.g., `user.created`, `user.updated`, etc.)

## Supported Events

The listener will identify and highlight registration-related events:
- `user.created` - New user registration
- `user.updated` - User profile updates
- `user.deleted` - User account deletion
- `session.created` - User session creation
- `session.ended` - User session ended
- `session.removed` - User session removed
- `session.updated` - User session updated

## Output

The webhook listener will print detailed information for each received webhook:

```
================================================================================
WEBHOOK RECEIVED AT: 2024-01-15T10:30:45.123456
================================================================================

--- HEADERS ---
Content-Type: application/json
User-Agent: Clerk-Webhook/1.0
X-Clerk-Event: user.created
...

--- JSON PAYLOAD ---
{
  "type": "user.created",
  "data": {
    "id": "user_123",
    "email_addresses": [...],
    "created_at": 1642248645123
  }
}

--- REQUEST INFO ---
Method: POST
URL: http://localhost:5000/webhook/clerk
Remote Address: 127.0.0.1
User Agent: Clerk-Webhook/1.0

--- CLERK EVENT TYPE ---
Event Type: user.created
✓ This is a registration-related event: user.created
================================================================================
```

## Development

The Flask app runs in debug mode by default, which provides:
- Auto-reload on code changes
- Detailed error messages
- Debug console

To run in production mode, set `debug=False` in the `app.run()` call.

## Security Notes

- This is a development/testing tool
- For production use, consider adding:
  - Webhook signature verification
  - Rate limiting
  - Authentication
  - HTTPS enforcement
  - Input validation and sanitization
