Initial:
```console
helm install vdr-proxy ./devops/charts/server -f ./devops/charts/server/values_dev.yaml -n c2a2c4-dev
```

Afterwards:
```console
helm upgrade vdr-proxy ./devops/charts/server -f ./devops/charts/server/values_dev.yaml -n c2a2c4-dev
```