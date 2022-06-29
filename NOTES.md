# Kyma Prep and Deploy

```
make build-image ; make push-image

docker run --rm -i -t alunde/socketchat:latest /bin/bash

docker run --rm -p 8080:8080 -t alunde/socketchat:latest

kubectl apply -n dev -f deployment.yaml

kubectl get -n dev deployments

kubectl get -n dev pods

kubectl exec -n dev -it $(kubectl get pods -n dev -l app=socketchat -o jsonpath='{.items[0].metadata.name}') -- bash

kubectl get -n dev APIRule

kubectl logs -n dev -f $(kubectl get pods -n dev -l app=socketchat -o jsonpath='{.items[0].metadata.name}')

```

# Teardown
```
kubectl delete -n dev -f deployment.yaml
```

// Disable metamask stuff for now
// https://docs.ethers.io/v5/getting-started/
  "devDependencies": {
    "@thetalabs/theta-js": "https://github.com/andrewlunde/theta-js",
    "@thetalabs/theta-wallet-connect": "latest",
    "@metamask/onboarding": "latest",
    "nodemon": "latest"
  },


Market Rates Bring Your Own Rates Application

https://cryptorates.mrm.cfapps.us10.hana.ondemand.com/portal.portal/site#Shell-home

