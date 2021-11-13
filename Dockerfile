# build environment
FROM node:14 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.* yarn.* ./
RUN yarn
COPY . ./

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ARG REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_ID=$REACT_APP_CLIENT_ID

ARG REACT_APP_CLIENT_SECRET
ENV REACT_APP_CLIENT_SECRET=$REACT_APP_CLIENT_SECRET

RUN yarn build

# production environment
FROM nginx
RUN rm -rf /etc/nginx/conf.d
RUN mkdir -p /etc/nginx/conf.d
COPY ./default.conf /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
