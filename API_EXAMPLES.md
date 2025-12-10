# Leaderboard API - Postman Collection

This document provides example requests for testing the API using curl or Postman.

## Base URL
```
http://localhost:3000/api
```

## 1. Authentication

### Register a Regular User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "password": "password123"
  }'
```

### Register an Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "password": "password123"
  }'
```

**Save the `accessToken` from the response for subsequent requests.**

## 2. Score Submission

### Submit Score (Regular User)
```bash
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "score": 1000
  }'
```

### Submit Score (Admin for Another User)
```bash
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "score": 2000,
    "playerName": "player1"
  }'
```

## 3. Leaderboard

### Get Top 10 Leaderboard
```bash
curl http://localhost:3000/api/leaderboard
```

### Get Top 20 Leaderboard
```bash
curl http://localhost:3000/api/leaderboard?limit=20
```

## 4. User Scores

### Get My Scores
```bash
curl http://localhost:3000/api/scores/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get My Best Score
```bash
curl http://localhost:3000/api/scores/me/best \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Testing Rate Limiting

Run this script to test rate limiting (10 requests in 60 seconds):

```bash
#!/bin/bash
TOKEN="YOUR_ACCESS_TOKEN"

for i in {1..15}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/scores \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"score\": $((RANDOM % 10000))}"
  echo ""
  sleep 1
done
```

## Expected Responses

### Successful Score Submission
```json
{
  "message": "Score submitted successfully",
  "score": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "score": 1000,
    "createdAt": "2025-12-10T10:30:00.000Z"
  }
}
```

### Rate Limit Exceeded
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

### Unauthorized (Missing Token)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Forbidden (User trying to submit for another user)
```json
{
  "statusCode": 403,
  "message": "You can only submit scores for yourself"
}
```

### Leaderboard Response
```json
{
  "message": "Leaderboard retrieved successfully",
  "leaderboard": [
    {
      "rank": 1,
      "playerName": "player1",
      "score": 5000,
      "achievedAt": "2025-12-10T10:30:00.000Z"
    },
    {
      "rank": 2,
      "playerName": "player2",
      "score": 4500,
      "achievedAt": "2025-12-10T09:15:00.000Z"
    }
  ]
}
```
