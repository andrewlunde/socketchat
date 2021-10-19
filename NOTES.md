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