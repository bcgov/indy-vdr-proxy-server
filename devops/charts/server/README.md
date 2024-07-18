Initial:
```console
helm install vdr-proxy ./devops/charts/server -f ./devops/charts/server/values_dev.yaml
```

Afterwards:
```console
helm upgrade vdr-proxy ./devops/charts/server -f ./devops/charts/server/values_dev.yaml
```