## Magda DAP Connector

![CI Workflow](https://github.com/magda-io/magda-dap-connector/workflows/Main%20CI%20Workflow/badge.svg?branch=master) [![Release](https://img.shields.io/github/release/magda-io/magda-dap-connector.svg)](https://github.com/magda-io/magda-dap-connector/releases)

[Magda](https://github.com/magda-io/magda) connectors go out to external datasources and copy their metadata into the Registry, so that they can be searched and have other aspects attached to them. A connector is simply a docker-based microservice that is invoked as a job. It scans the target datasource (usually an open-data portal), then completes and shuts down.

Magda dap Connector is created for crawling data from CSIRO Data Access Portal (DAP).

### Helm Chart

It's recommanded to deploy connectors with as [dependencies](https://helm.sh/docs/topics/chart_best_practices/dependencies/) of a Magda helm deployment. Example can be found from [here](https://github.com/magda-io/magda-config).

-   Magda Helm Charts Repository Url: https://charts.magda.io

The [helm chart](https://helm.sh/docs/topics/charts/) for this connector is auto released when a [Github Release](https://help.github.com/en/github/administering-a-repository/creating-releases) is created for this repo.

-   Add repository to helm:

```bash
helm repo add magda-io https://charts.magda.io
```

### Docker Image

Docker image releases can be found from Docker Hub:

https://hub.docker.com/r/data61/magda-dap-connector/

Development releases (per commit) are also available from [GitHub Registry](https://github.com/magda-io/magda-dap-connector/packages) and accessible with access token.

## Requirements

Kubernetes: `>= 1.14.0-0`

## Values

| Key                                | Type   | Default                              | Description |
| ---------------------------------- | ------ | ------------------------------------ | ----------- |
| config.id                          | string | `"dap"`                              |             |
| config.name                        | string | `"CSIRO"`                            |             |
| config.pageSize                    | int    | `100`                                |             |
| config.sourceUrl                   | string | `"https://data.csiro.au/dap/ws/v2/"` |             |
| defaultImage.imagePullSecret       | bool   | `false`                              |             |
| defaultImage.pullPolicy            | string | `"IfNotPresent"`                     |             |
| defaultImage.repository            | string | `"docker.io/data61"`                 |             |
| defaultImage.tag                   | string | `"0.0.57-0"`                         |             |
| defaultSettings.includeCronJobs    | bool   | `true`                               |             |
| defaultSettings.includeInitialJobs | bool   | `false`                              |             |
| defaultTenantId                    | int    | `0`                                  |             |
| global.connectors.image            | object | `{}`                                 |             |
| global.image                       | object | `{}`                                 |             |
| image.name                         | string | `"magda-dap-connector"`              |             |
| resources.limits.cpu               | string | `"100m"`                             |             |
| resources.requests.cpu             | string | `"50m"`                              |             |
| resources.requests.memory          | string | `"30Mi"`                             |             |
