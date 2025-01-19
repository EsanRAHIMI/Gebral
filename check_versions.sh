#!/bin/bash

# تعریف رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # بدون رنگ

# تاریخ و زمان فعلی
CURRENT_DATETIME=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="./check_versions.log"

# افزودن تاریخ و زمان به لاگ
echo -e "\n=====================================" >> "$LOG_FILE"
echo -e "Execution Time: $CURRENT_DATETIME" >> "$LOG_FILE"

# نمایش وضعیت ابزارها
function show_tools_status {
  echo -e "\n${CYAN}=====================================${NC}"
  echo -e "${BLUE}System and Tools Versions${NC}"
  echo -e "${CYAN}=====================================${NC}" | tee -a "$LOG_FILE"
  
  echo -e "Node.js Version: $(node -v)" | tee -a "$LOG_FILE"
  echo -e "NPM Version: $(npm -v)" | tee -a "$LOG_FILE"
  echo -e "NVM Version: $(nvm --version 2>/dev/null || echo 'NVM not found')" | tee -a "$LOG_FILE"
  echo -e "Python Version: $(python3 --version 2>/dev/null || echo 'Python not found')" | tee -a "$LOG_FILE"
  echo -e "TypeScript Version: $(tsc -v 2>/dev/null || echo 'TypeScript not found')" | tee -a "$LOG_FILE"
  echo -e "Vite Version: $(vite --version 2>/dev/null || echo 'Vite not found')" | tee -a "$LOG_FILE"
  echo -e "Docker Version: $(docker --version)" | tee -a "$LOG_FILE"

  echo -e "${GREEN}PostgreSQL Version:${NC}" | tee -a "$LOG_FILE"
  if [ -f "./backend/.env" ]; then
    source ./backend/.env
    POSTGRES_VERSION=$(docker exec -i Gebral-DB psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" | grep "PostgreSQL" | xargs)
    echo "$POSTGRES_VERSION" | tee -a "$LOG_FILE"
  else
    echo -e "${RED}.env file not found.${NC}" | tee -a "$LOG_FILE"
  fi

  echo -e "Git Version: $(git --version)" | tee -a "$LOG_FILE"
}

# نمایش پکیج‌های NPM
function show_npm_packages {
  echo -e "\n${CYAN}=====================================${NC}"
  echo -e "${BLUE}NPM Packages${NC}"
  echo -e "${CYAN}=====================================${NC}" | tee -a "$LOG_FILE"
  
  echo -e "${YELLOW}Frontend Packages:${NC}" | tee -a "$LOG_FILE"
  (cd frontend && npm list --depth=0) | tee -a "$LOG_FILE"
  
  echo -e "${YELLOW}Backend Packages:${NC}" | tee -a "$LOG_FILE"
  (cd backend && npm list --depth=0) | tee -a "$LOG_FILE"
}

# نمایش ساختار دایرکتوری پروژه
function show_directory_structure {
  echo -e "\n${CYAN}=====================================${NC}"
  echo -e "${BLUE}Project Directory Structure${NC}"
  echo -e "${CYAN}=====================================${NC}" | tee -a "$LOG_FILE"
  
  tree -I 'node_modules|dist' -L 4 | tee -a "$LOG_FILE"
}

# وضعیت کانتینرهای Docker
function show_docker_status {
  echo -e "\n${CYAN}=====================================${NC}"
  echo -e "${BLUE}Docker Containers Status${NC}"
  echo -e "${CYAN}=====================================${NC}" | tee -a "$LOG_FILE"
  
  docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | tee -a "$LOG_FILE"
}

# وضعیت Git
function show_git_status {
  echo -e "\n${CYAN}=====================================${NC}"
  echo -e "${BLUE}Git Repository Status${NC}"
  echo -e "${CYAN}=====================================${NC}" | tee -a "$LOG_FILE"
  
  git status | tee -a "$LOG_FILE"
}

# پورت‌های باز
function show_open_ports {
  echo -e "\n${CYAN}=====================================${NC}"
  echo -e "${BLUE}Open Ports${NC}"
  echo -e "${CYAN}=====================================${NC}" | tee -a "$LOG_FILE"
  
  lsof -i -P -n | grep LISTEN | tee -a "$LOG_FILE"
}

# اجرای بخش‌ها
show_tools_status
show_npm_packages
show_directory_structure
show_docker_status
show_git_status
show_open_ports

# ثبت زمان پایان
echo -e "${GREEN}Log Generated Successfully!${NC}" | tee -a "$LOG_FILE"
