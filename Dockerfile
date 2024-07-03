FROM nikolaik/python-nodejs:python3.9-nodejs18

# Setup env variable for yarn
ENV YARN_VERSION=4.3.1

# Update dependencies, add libc6-compat and python to the base image
# RUN apk update && apk add --no-cache libc6-compat

# Install and use yarn 4.x
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# Create app directory
WORKDIR /app

# Create non-root user for Docker
RUN addgroup --system --gid 1001 local_node
RUN adduser --system --uid 1001 local_node

# Copy source code into app folder and give permissions to non-root user
COPY --chown=local_node:local_node . .

# Fix for node-gyp issues (Yarn 4 doesn't do global installs)
RUN npm install -g node-gyp

# Install deps and remove created cache
RUN yarn install --immutable && yarn cache clean

# Build the server
RUN yarn build

# Set Docker as a non-root user
USER local_node

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "dist/main.js"]