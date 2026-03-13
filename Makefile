# Mobius Fly — Developer Commands
# Usage: make <target>

.PHONY: install dev build start lint lint-fix typecheck check clean storybook

# ─── Colors ───────────────────────────────────────────────────────────────────
# $(shell printf ...) evaluates at parse time and stores the actual escape byte.
# Plain \033 in a Make variable is a literal string, not a terminal escape.
RESET := $(shell printf '\033[0m')
BOLD  := $(shell printf '\033[1m')
GREEN := $(shell printf '\033[0;32m')
RED   := $(shell printf '\033[0;31m')
DIM   := $(shell printf '\033[2m')

# ─── Install ──────────────────────────────────────────────────────────────────
install:
	@echo "$(BOLD)Installing dependencies...$(RESET)"
	@npm install
	@npm run prepare
	@echo "$(GREEN)✓ Dependencies installed$(RESET)"

# ─── Dev ──────────────────────────────────────────────────────────────────────
dev:
	@echo "$(BOLD)Starting development server...$(RESET)"
	@npm run dev

# ─── Build ────────────────────────────────────────────────────────────────────
build:
	@echo "$(BOLD)Building for production...$(RESET)"
	@npm run build || { echo "$(RED)✗ Build failed$(RESET)"; exit 1; }
	@echo "$(GREEN)✓ Build complete$(RESET)"

# ─── Start ────────────────────────────────────────────────────────────────────
start:
	@npm run start

# ─── Lint ─────────────────────────────────────────────────────────────────────
# Calls eslint directly to avoid the npm script header noise.
# @ suppresses the command echo; eslint's own stdout/stderr is fully preserved.
# The || branch runs only on failure: prints a summary, then exits non-zero
# so Make stops and the success echo below is never reached.
lint:
	@echo "$(BOLD)Running ESLint...$(RESET)"
	@npx eslint . || { echo "$(RED)✗ ESLint failed$(RESET)"; exit 1; }
	@echo "$(GREEN)✓ ESLint passed$(RESET)"

# ─── Lint Fix ─────────────────────────────────────────────────────────────────
lint-fix:
	@echo "$(BOLD)Running ESLint with auto-fix...$(RESET)"
	@npx eslint . --fix || { echo "$(RED)✗ ESLint fix failed$(RESET)"; exit 1; }
	@echo "$(GREEN)✓ ESLint fix complete$(RESET)"

# ─── Typecheck ────────────────────────────────────────────────────────────────
typecheck:
	@echo "$(BOLD)Running TypeScript check...$(RESET)"
	@npx tsc --noEmit || { echo "$(RED)✗ Type check failed$(RESET)"; exit 1; }
	@echo "$(GREEN)✓ Type check passed$(RESET)"

# ─── Check ────────────────────────────────────────────────────────────────────
# Runs lint then typecheck as dependencies.
# If either dependency fails, Make stops before reaching this recipe.
# The success message only prints when both pass.
check: lint typecheck
	@echo ""
	@echo "$(GREEN)$(BOLD)All checks passed 🎉$(RESET)"

# ─── Clean ────────────────────────────────────────────────────────────────────
clean:
	@echo "$(DIM)Removing .next build cache...$(RESET)"
	@rm -rf .next
	@echo "$(GREEN)✓ Clean$(RESET)"

# ─── Storybook ────────────────────────────────────────────────────────────────
storybook:
	@echo "$(BOLD)Starting Storybook...$(RESET)"
	@npm run storybook
