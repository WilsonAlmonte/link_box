FROM golang:1.27.1-alpine 

ARG TERN_VERSION
ARG TARGET_ARCH

RUN go install github.com/jackc/tern/v2@latest 

WORKDIR /db
COPY tern.conf .
COPY migrations ./migrations/

ENTRYPOINT [ "tern" ]
CMD [ "migrate", "--config", "tern.conf", "--migrations", "migrations" ]
