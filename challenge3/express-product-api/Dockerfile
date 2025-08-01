# Sử dụng Node LTS
FROM node:20

# Tạo thư mục ứng dụng
WORKDIR /app

# Copy file package trước để cài trước (caching layer)
COPY package*.json ./

# Cài dependency
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Expose port ứng dụng chạy
EXPOSE 3000

# Start server
CMD ["npm", "run", "dev"]
