```console
helm install vdr-proxy ./devops/charts/server -f ./devops/charts/server/values_dev.yaml
```

```console
helm template vdr-proxy ./devops/charts/server -f ./devops/charts/server values_dev.yaml | oc apply -n c2a2c4-dev -f -
```