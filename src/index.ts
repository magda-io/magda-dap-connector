import { addJwtSecretFromEnvVar } from "@magda/utils";
import {
    JsonConnector,
    AuthorizedRegistryClient as Registry
} from "@magda/connector-sdk";
import Dap from "./Dap";
import createTransformer from "./createTransformer";
import {
    datasetAspectBuilders,
    organizationAspectBuilders,
    distributionAspectBuilders
} from "./aspectBuilders";
import yargs from "yargs";

const argv = addJwtSecretFromEnvVar(
    yargs
        .config()
        .help()
        .option("id", {
            describe:
                "The ID of this connector. Datasets created by this connector will have an ID prefixed with this ID.",
            type: "string",
            demandOption: true
        })
        .option("name", {
            describe:
                "The name of this connector, to be displayed to users to indicate the source of datasets.",
            type: "string",
            demandOption: true
        })
        .option("sourceUrl", {
            describe: "The base URL of the CSIRO DAP server, without /api/...",
            type: "string",
            demandOption: true
        })
        .option("pageSize", {
            describe:
                "The number of datasets per page to request from the CSIRO Dap server.",
            type: "number",
            default: 1000
        })
        .option("distributionSize", {
            describe: "The number of distributions harvested.",
            type: "number",
            default: 24
        })
        .option("ignoreHarvestSources", {
            describe:
                "An array of harvest sources to ignore.  Datasets from these harvest soures will not be added to the registry.",
            type: "array",
            default: []
        })
        .option("registryUrl", {
            describe:
                "The base URL of the registry to which to write data from CKAN.",
            type: "string",
            default: "http://localhost:6101/v0"
        })
        .option("interactive", {
            describe:
                "Run the connector in an interactive mode with a REST API, instead of running a batch connection job.",
            type: "boolean",
            default: false
        })
        .option("listenPort", {
            describe:
                "The port on which to run the REST API when in interactive model.",
            type: "number",
            default: 6113
        })
        .option("timeout", {
            describe:
                "When in --interactive mode, the time in seconds to wait without servicing an REST API request before shutting down. If 0, there is no timeout and the process will never shut down.",
            type: "number",
            default: 0
        })
        .option("jwtSecret", {
            describe: "The shared secret for intra-network communication",
            type: "string"
        })
        .option("userId", {
            describe:
                "The user id to use when making authenticated requests to the registry",
            type: "string",
            demand: true,
            default:
                process.env.USER_ID || process.env.npm_package_config_userId
        })
        .option("tenantId", {
            describe:
                "The magda tenant id to use when making requests to the registry",
            type: "number",
            demand: true
        }).argv
);

const dap = new Dap({
    baseUrl: argv.sourceUrl,
    id: argv.id,
    name: argv.name,
    pageSize: argv.pageSize,
    distributionSize: argv.distributionSize,
    ignoreHarvestSources: argv.ignoreHarvestSources
});

const registry = new Registry({
    baseUrl: argv.registryUrl,
    jwtSecret: argv.jwtSecret,
    userId: argv.userId,
    tenantId: argv.tenantId
});

const transformerOptions = {
    id: argv.id,
    name: argv.name,
    sourceUrl: argv.sourceUrl,
    pageSize: argv.pageSize,
    ignoreHarvestSources: argv.ignoreHarvestSources,
    registryUrl: argv.registryUrl,
    datasetAspectBuilders,
    distributionAspectBuilders,
    organizationAspectBuilders,
    tenantId: argv.tenantId
};

const transformer = createTransformer(transformerOptions);

const connector = new JsonConnector({
    source: dap,
    transformer: transformer,
    registry: registry
});

if (!argv.interactive) {
    connector.run().then((result) => {
        console.log(result.summarize());
    });
} else {
    connector.runInteractive({
        timeoutSeconds: argv.timeout,
        listenPort: argv.listenPort,
        transformerOptions: transformerOptions
    });
}
