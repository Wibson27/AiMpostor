# Backend coming soon

# Plant Disease Detection API Documentation

This document outlines the endpoints available in the Plant Disease Detection
API service, which provides plant disease identification and agricultural
assistance via AI.

## Base URL

```
/api/v1
```

## Authentication

Authentication requirements are not specified in the current implementation.
Future versions may require API keys or OAuth tokens.

## Endpoints

### Upload Plant Image

Analyzes a plant image to identify diseases and provide treatment
recommendations.

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

#### Request Parameters

| Parameter      | Type   | Required | Description                                                                           |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------------- |
| plantImage     | File   | Yes      | The plant image to analyze (JPEG, PNG, etc.)                                          |
| conversationId | String | No       | Unique identifier for the conversation. If not provided, a new one will be generated. |

#### Response

**Success Response (200 OK)**

```json
{
  "result": {
    "diseaseDetected": String,
    "confidence": Number,
    "plantType": String,
    "symptoms": Array,
    "cause": String,
    "treatment": String,
    "preventionMeasures": Array
  },
  "conversationId": String
}
```

**Error Responses**

- **400 Bad Request**: No image uploaded

  ```json
  { "error": "No image uploaded." }
  ```

- **500 Internal Server Error**: Processing error
  ```json
  { "error": "Failed to process image." }
  ```

### Chat with Agricultural AI Assistant

Sends a text message to continue conversation with the AI assistant about
agricultural topics.

- **URL**: `/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "conversationId": "string",
  "message": "string"
}
```

| Parameter      | Type   | Required | Description                                                                     |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------- |
| conversationId | String | Yes      | The unique identifier for the conversation, obtained from previous interactions |
| message        | String | Yes      | The user's message to the AI assistant                                          |

#### Response

**Success Response (200 OK)**

```json
{
  "response": "string"
}
```

**Error Responses**

- **400 Bad Request**: Missing parameters

  ```json
  { "error": "Conversation ID and message are required." }
  ```

- **404 Not Found**: Invalid conversation ID

  ```json
  { "error": "Conversation ID not found or no previous messages." }
  ```

- **500 Internal Server Error**: Processing error
  ```json
  { "error": "Failed to send message." }
  ```

## Usage Examples

### Uploading a Plant Image

```bash
curl -X POST \
  -F "plantImage=@leaf_sample.jpg" \
  -F "conversationId=abc123" \
  http://your-api-url/api/v1/upload
```

### Continuing Conversation

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"abc123","message":"How often should I water the plant?"}' \
  http://your-api-url/api/v1/chat
```

## Notes

- The current implementation stores conversation history in memory. In
  production, this should be replaced with a database solution.
- Large image uploads may impact performance. Consider optimizing image size
  before uploading.
