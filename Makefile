RELEASE?=latest
APP?=socketchat
DOCKER_ACCOUNT?=alunde
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

build-image:
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm .

push-image:
	docker push $(CONTAINER_IMAGE)
