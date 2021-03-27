include .env

help: ## Help menu
	@echo "App Tasks"
	@cat $(MAKEFILE_LIST) | pcregrep -o -e "^([\w]*):\s?##(.*)"
	@echo

start: ## starts docker compose
	docker-compose -f docker-compose.yml up

restart: ## starts docker compose
	docker-compose restart

stop: ## stops all containers
	docker-compose stop

ssh: ## connect to fpm container
	docker exec -it $(APP_PREFIX)-fpm ash

mysql: ## connect to mysql container
	docker exec -it $(APP_PREFIX)-mysql bash

prod: ## ssh into prod server
	ssh $(PROD_SSH_URL) -p 7822 -t "cd $(PROD_PATH) ; bash"
