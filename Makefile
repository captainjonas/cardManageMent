.PHONY: install start dev build clean help test test-watch test-coverage

# 默认目标
.DEFAULT_GOAL := help

install: ## 安装项目依赖
	@echo "📦 Installing dependencies..."
	@npm install

start: install ## 启动开发服务器（自动安装依赖）
	@echo "🚀 Starting development server..."
	@npm run dev

dev: start ## start 的别名

build: install ## 构建生产版本
	@echo "🏗️  Building production version..."
	@npm run build

clean: ## 清理构建文件和依赖
	@echo "🧹 Cleaning up..."
	@rm -rf .next
	@rm -rf node_modules
	@echo "✨ Cleanup complete"

test: install ## 运行测试
	@echo "🧪 Running tests..."
	@npm test

test-watch: install ## 以监视模式运行测试
	@echo "👀 Running tests in watch mode..."
	@npm run test:watch

test-coverage: install ## 运行测试覆盖率报告
	@echo "📊 Generating test coverage report..."
	@npm run test:coverage

help: ## 显示帮助信息
	@echo "可用的命令:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' 