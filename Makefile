# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Tail logs
logs:
	docker-compose logs -f

# Rebuild and restart
rebuild:
	docker-compose down
	docker-compose build
	docker-compose up -d

# Prune everything
clean:
	docker system prune -af
