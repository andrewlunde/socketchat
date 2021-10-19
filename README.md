# chat Application

Welcome to the chat project built using websockets.

It contains these folders and files.

File / Folder | Purpose
---------|----------
`Dockerfile` | Docker build steps
`Makerfile` | Use make to build and publish the Docker image
`NOTES.md` | Building testing Docker image and deploying to BTP Kyma
`README.md` | Building mtar file and deploying to BTP Cloud Foundry
`srv/` | NodeJS websocket server and client in server.js
`mta.yaml` | Multi-Target-Architecture file for BTP Cloud Foundry


## Next Steps...

## Learn more...

# Build Command for BTP CF:
```
cd socketchat ; mkdir -p mta_archives ; mbt build -p=cf -t=mta_archives --mtar=chat.mtar
```

# BTP CF Deploy Command:
```
cf deploy mta_archives/chat.mtar -f
```

# Subsequent Build+Deploy Commands:
```
mbt build -p=cf -t=mta_archives --mtar=chat.mtar ; cf deploy mta_archives/chat.mtar -f
```

# BTP CF Undeploy Command:
```
cf undeploy chat -f --delete-services
```
