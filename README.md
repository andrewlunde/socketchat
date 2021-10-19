# chat Application

Welcome to the chat project.

It contains these folders and files.

File / Folder | Purpose
---------|----------
`README.md` | this getting started guide
`srv/` | your service models and code go here
`mta.yaml` | project structure and relationships


## Next Steps...

## Learn more...

# Build Command:
```
cd socketchat ; mkdir -p mta_archives ; mbt build -p=cf -t=mta_archives --mtar=chat.mtar
```

# Deploy Command:
```
cf deploy mta_archives/chat.mtar -f
```

# Subsequent Build+Deploy Commands:
```
mbt build -p=cf -t=mta_archives --mtar=chat.mtar ; cf deploy mta_archives/chat.mtar -f
```

# Undeploy Command:
```
cf undeploy chat -f --delete-services
```
