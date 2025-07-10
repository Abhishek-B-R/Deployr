# Build all images
build:
	docker-compose build

devBuild:
	docker-compose -f dev.docker-compose.yml build --no-cache

# Start all services
up:
	docker-compose up -d

devUp:
	docker-compose -f dev.docker-compose.yml up -d

# Stop all services
down:
	docker-compose down

devDown:
	docker-compose -f dev.docker-compose.yml down

# Tail logs
logs:
	docker-compose logs -f

devLogs:
	docker-compose -f dev.docker-compose.yml logs -f

# Rebuild and restart
rebuild:
	docker-compose down
	docker-compose build
	docker-compose up -d

devRebuild:
	docker-compose -f dev.docker-compose.yml down
	docker-compose -f dev.docker-compose.yml build
	docker-compose -f dev.docker-compose.yml up -d

# Prune everything
clean:
	docker system prune -af

devClean:
	docker system prune -af
