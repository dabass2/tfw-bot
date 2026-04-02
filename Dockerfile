# Use official Node runtime
FROM node:24-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (for Docker layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --omit=dev

# Copy all source files
COPY . .

# Build TS to JS
RUN npm run build

# Runtime env (override in docker-compose or docker run)
ENV NODE_ENV=production
ENV DISCORD_BOT_TOKEN=your-token-here
ENV RMEME_API_KEY=key-here

# Expose any port if needed (Discord bot uses outbound websocket, no inbound needed)
# EXPOSE 3000

# Start the bot
CMD [ "npm", "run", "serve" ]