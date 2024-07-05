# Setup
FROM node:18-buster AS base

# Setup env variable for yarn
ENV YARN_VERSION=4.3.1

# Update dependencies, add python to the base image
RUN apt-get update && apt-get install python3=3.7.3-1

# Install and use yarn 4.x
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# Create app directory
WORKDIR /app

# Create non-root user for Docker
RUN addgroup --system --gid 1001 vdrproxy
RUN adduser --system --uid 1001 vdrproxy

# Copy source code into app folder and give permissions to non-root user
COPY --chown=vdrproxy:vdrproxy . .

# Fix for node-gyp issues (Yarn 4 doesn't do global installs)
RUN npm install -g node-gyp

# Build server
FROM base AS builder

# Install deps and remove created cache
RUN yarn install --immutable && yarn cache clean

# Build the server
RUN yarn build

# Run server
FROM builder AS runner

# Set Docker as a non-root user
USER vdrproxy

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "dist/main.js"]