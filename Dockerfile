# Build stage
FROM node:20.18.0-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Set production environment
ENV NODE_ENV=production

# Build the Medusa application
RUN npx medusa build


# Install stage
FROM node:20.18.0-alpine AS install

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built artifacts from the build stage
COPY --from=build /usr/src/app/.medusa/server ./
COPY --from=build /usr/src/app/.env ./.env.production
COPY --from=build /usr/src/app/scripts/UpdateImageTag.sh ./scripts/UpdateImageTag.sh
#COPY --from=build /usr/src/app/tsconfig.json ./tsconfig.json

# Install production dependencies
RUN yarn install --frozen-lockfile --production

# Production stage
FROM node:20.18.0-alpine AS production

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built artifacts from the install stage
COPY --from=install /usr/src/app ./

## echo .env file
#RUN cat .env.production
# Expose the port the app runs on
EXPOSE 9000

# Run migrations and start the application
CMD ["sh", "-c", "yarn medusa db:migrate && yarn medusa db:sync-links && yarn start"]
