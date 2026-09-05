FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


COPY . .


ARG VITE_LIVEKIT_WS
ARG VITE_GAME_SERVER
ARG VITE_GAME_WS


ENV VITE_LIVEKIT_WS=$VITE_LIVEKIT_WS
ENV VITE_GAME_SERVER=$VITE_GAME_SERVER
ENV VITE_GAME_WS=$VITE_GAME_WS

RUN npm run build


FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
