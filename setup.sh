#!/bin/bash

# Leaderboard API Setup Script
# This script helps set up the development environment

set -e

echo "🎮 Leaderboard API Setup Script"
echo "================================"

# Check Node.js
echo ""
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x or higher."
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"

# Check npm
echo ""
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"

# Check Docker (optional)
echo ""
echo "Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v)
    echo "✅ Docker found: $DOCKER_VERSION"
    DOCKER_AVAILABLE=true
else
    echo "⚠️  Docker not found. You can still run the app locally with PostgreSQL."
    DOCKER_AVAILABLE=false
fi

# Install dependencies
echo ""
echo "Installing npm dependencies..."
npm install
echo "✅ Dependencies installed"

# Setup environment file
echo ""
if [ ! -f .env.development ]; then
    echo "Creating .env.development from template..."
    cp .env.example .env.development
    echo "✅ .env.development created"
else
    echo "ℹ️  .env.development already exists"
fi

# Setup with Docker or locally
echo ""
echo "How would you like to set up the database?"
echo "1) Docker (Recommended)"
echo "2) Local PostgreSQL"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        if [ "$DOCKER_AVAILABLE" = true ]; then
            echo ""
            echo "Starting services with Docker Compose..."
            docker-compose up -d
            echo ""
            echo "✅ Services started!"
            echo ""
            echo "Waiting for database to be ready..."
            sleep 10
            echo ""
            echo "🚀 Setup complete!"
            echo ""
            echo "Services running:"
            echo "  - API: http://localhost:3000/api"
            echo "  - PostgreSQL: localhost:5432"
            echo ""
            echo "View logs: docker-compose logs -f"
            echo "Stop services: docker-compose down"
        else
            echo "❌ Docker is not available. Please install Docker or choose option 2."
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "Please ensure PostgreSQL is running locally on port 5432"
        echo "Database name: leaderboard"
        echo "Username: postgres"
        echo "Password: postgres"
        echo ""
        read -p "Press Enter when PostgreSQL is ready..."
        echo ""
        echo "Starting application in development mode..."
        npm run start:dev &
        echo ""
        echo "✅ Application started!"
        echo ""
        echo "API available at: http://localhost:3000/api"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📚 Next steps:"
echo "  1. Test the API: curl http://localhost:3000/api/leaderboard"
echo "  2. Register a user: See API_EXAMPLES.md"
echo "  3. Read the documentation: README.md"
echo ""
echo "Happy coding! 🎉"
