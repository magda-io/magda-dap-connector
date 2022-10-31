import fs from "fs";
import { AspectBuilder } from "@magda/connector-sdk";

export const datasetAspectBuilders: AspectBuilder[] = [
    {
        aspectDefinition: {
            id: "dap-dataset",
            name: "DAP Dataset",
            jsonSchema: require("@magda/registry-aspects/dap-dataset.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/dap-dataset.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "dcat-dataset-strings",
            name: "DCAT Dataset properties as strings",
            jsonSchema: require("@magda/registry-aspects/dcat-dataset-strings.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/dcat-dataset-strings.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "source",
            name: "Source",
            jsonSchema: require("@magda/registry-aspects/source.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/dataset-source.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "temporal-coverage",
            name: "Temporal Coverage",
            jsonSchema: require("@magda/registry-aspects/temporal-coverage.schema.json")
        },
        setupFunctionString: fs.readFileSync(
            "aspect-templates/temporal-coverage-setup.js",
            "utf8"
        ),
        builderFunctionString: fs.readFileSync(
            "aspect-templates/temporal-coverage.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "spatial-coverage",
            name: "Spatial Coverage",
            jsonSchema: require("@magda/registry-aspects/spatial-coverage.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/spatial-coverage.js",
            "utf8"
        )
    }
];

export const distributionAspectBuilders: AspectBuilder[] = [
    {
        aspectDefinition: {
            id: "dap-resource",
            name: "DAP Resource",
            jsonSchema: require("@magda/registry-aspects/dap-resource.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/dap-resource.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "dcat-distribution-strings",
            name: "DCAT Distribution properties as strings",
            jsonSchema: require("@magda/registry-aspects/dcat-distribution-strings.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/dcat-distribution-strings.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "source",
            name: "Source",
            jsonSchema: require("@magda/registry-aspects/source.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/distribution-source.js",
            "utf8"
        )
    }
];

export const organizationAspectBuilders: AspectBuilder[] = [
    {
        aspectDefinition: {
            id: "source",
            name: "Source",
            jsonSchema: require("@magda/registry-aspects/source.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/organization-source.js",
            "utf8"
        )
    },
    {
        aspectDefinition: {
            id: "organization-details",
            name: "Organization",
            jsonSchema: require("@magda/registry-aspects/organization-details.schema.json")
        },
        builderFunctionString: fs.readFileSync(
            "aspect-templates/organization-details.js",
            "utf8"
        )
    }
];
