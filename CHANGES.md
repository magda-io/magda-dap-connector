# 2.0.0

-   Upgrade to node 14
-   Upgrade to typescript 4 & webpack 5
-   Upgrade @magda dependencies to v2
-   Release all artifacts to GitHub Container Registry (instead of docker.io & https://charts.magda.io)
-   Upgrade API version for CronJob to batch/v1 (for k8s v1.25 support)
-   Release multi-arch docker images
-   Use node-fetch for all http requests instead
-   Refactor DAP connector code
-   Added test cases
-   Added support for `spatial-coverage` aspect

# 1.0.0

-   Upgrade dependencies
-   Upgrade CI scripts
-   Related to https://github.com/magda-io/magda/issues/3229, Use magda-common for docker image related logic
