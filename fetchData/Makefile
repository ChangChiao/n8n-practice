# Docker 操作的便利指令

.PHONY: build run test clean logs shell

# 建置 Docker 映像檔
build:
	docker-compose build

# 執行主要的 web scraper
run:
	docker-compose run --rm web-scraper

# 執行測試腳本
test:
	docker-compose run --rm test-script

# 在背景執行
up:
	docker-compose up -d

# 停止所有服務
down:
	docker-compose down

# 查看日誌
logs:
	docker-compose logs -f

# 進入容器的 shell
shell:
	docker-compose run --rm web-scraper /bin/bash

# 清理未使用的映像檔和容器
clean:
	docker-compose down -v
	docker system prune -f

# 重新建置並執行
rebuild: clean build run