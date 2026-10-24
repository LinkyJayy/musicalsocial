FROM node:22-slim

# ffmpeg/ffprobe: enforce the 15-minute limit server-side, reject landscape videos,
# generate poster thumbnails and enable fast-start streaming.
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .

ENV NODE_ENV=production
ENV DATA_DIR=/data
EXPOSE 3000
CMD ["npm", "start"]
