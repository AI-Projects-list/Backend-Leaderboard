# 🚀 Quick Start Guide

Get your Leaderboard API up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Docker & Docker Compose installed (recommended)

## Option 1: Docker Setup (Recommended) ⭐

### Step 1: Clone and Navigate
```bash
cd "c:\Users\budis\Downloads\Fabrotec\Leaderboard"
```

### Step 2: Start Everything
```bash
docker-compose up -d
```

### Step 3: Wait for Services (10 seconds)
Services starting:
- PostgreSQL database on port 5432
- API server on port 3000

### Step 4: Test the API
```bash
curl http://localhost:3000/api/leaderboard
```

Expected response:
```json
{
  "message": "Leaderboard retrieved successfully",
  "leaderboard": []
}
```

✅ **You're ready!** Skip to [First Steps](#first-steps)

---

## Option 2: Local Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup PostgreSQL
Make sure PostgreSQL is running:
- Host: localhost
- Port: 5432
- Database: leaderboard
- Username: postgres
- Password: postgres

### Step 3: Configure Environment
```bash
copy .env.example .env.development
```

### Step 4: Start the Application
```bash
npm run start:dev
```

### Step 5: Test the API
```bash
curl http://localhost:3000/api/leaderboard
```

---

## First Steps

### 1. Register Your First User

```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"player1\", \"password\": \"password123\"}"
```

**Save the `accessToken` from the response!**

### 2. Submit a Score

Replace `YOUR_TOKEN` with the token from step 1:

```bash
curl -X POST http://localhost:3000/api/scores ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"score\": 1000}"
```

### 3. View the Leaderboard

```bash
curl http://localhost:3000/api/leaderboard
```

You should see your score!

### 4. Create an Admin User

```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"admin\", \"password\": \"admin123\", \"role\": \"admin\"}"
```

### 5. Admin: Submit Score for Another Player

```bash
curl -X POST http://localhost:3000/api/scores ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"score\": 2000, \"playerName\": \"player1\"}"
```

---

## Testing Rate Limiting

Try submitting 15 scores rapidly (limit is 10 per 60 seconds):

```bash
# Windows PowerShell
for ($i=1; $i -le 15; $i++) {
    Write-Host "Request $i"
    curl -X POST http://localhost:3000/api/scores `
      -H "Content-Type: application/json" `
      -H "Authorization: Bearer YOUR_TOKEN" `
      -d "{\"score\": $(Get-Random -Maximum 10000)}"
}
```

After 10 requests, you'll get:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## Useful Commands

### View Application Logs
```bash
# Docker
docker-compose logs -f app

# Local
# Check logs/ folder
```

### Stop Services
```bash
# Docker
docker-compose down

# Local
# Ctrl+C in terminal
```

### Reset Database
```bash
# Docker
docker-compose down -v
docker-compose up -d
```

### Run Tests
```bash
npm run test
npm run test:cov
```

---

## Next Steps

1. 📖 Read the full [README.md](README.md) for detailed documentation
2. 🔧 Check [API_EXAMPLES.md](API_EXAMPLES.md) for more examples
3. 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
4. 📬 Import [postman_collection.json](postman_collection.json) to Postman

---

## Troubleshooting

### Port Already in Use

**Problem**: Port 3000 or 5432 already in use

**Solution**:
```bash
# Change ports in .env.development or docker-compose.yml
PORT=3001
DB_PORT=5433
```

### Database Connection Error

**Problem**: Can't connect to database

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Or restart services
docker-compose restart
```

### JWT Token Invalid

**Problem**: Getting 401 Unauthorized

**Solution**:
- Make sure you're using the correct token
- Token might be expired (default: 1 hour)
- Login again to get a fresh token

---

## 🎯 You're All Set!

Your Leaderboard API is now running and ready to use. Happy coding! 🎮

Need help? Check the [README.md](README.md) or open an issue.
