FROM node:18-slim

USER nobody
EXPOSE 9091

COPY analysts-server.js package.json .

CMD ["node", "analysts-server.js"]
