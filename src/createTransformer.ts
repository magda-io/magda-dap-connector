import { AspectBuilder } from "@magda/connector-sdk";
import DapTransformer from "./DapTransformer";
import DapUrlBuilder from "./DapUrlBuilder";
import moment from "moment";
import URI from "urijs";

export interface CreateTransformerOptions {
    name: string;
    id: string;
    sourceUrl: string;
    datasetAspectBuilders: AspectBuilder[];
    distributionAspectBuilders: AspectBuilder[];
    organizationAspectBuilders: AspectBuilder[];
    tenantId: number;
}

function getDateTimeString(str: any) {
    if (!str || (typeof str !== "string" && typeof str !== "number")) {
        return undefined;
    }
    const d = moment(str);
    if(!d.isValid()){
        return undefined;
    }
    return d.toDate().toJSON();
}

export default function createTransformer({
    name,
    id,
    sourceUrl,
    datasetAspectBuilders,
    distributionAspectBuilders,
    organizationAspectBuilders,
    tenantId
}: CreateTransformerOptions) {
    return new DapTransformer({
        sourceId: id,
        datasetAspectBuilders: datasetAspectBuilders,
        distributionAspectBuilders: distributionAspectBuilders,
        organizationAspectBuilders: organizationAspectBuilders,
        tenantId: tenantId,
        libraries: {
            moment: moment,
            getDateTimeString,
            URI: URI,
            dap: new DapUrlBuilder({
                id: id,
                name: name,
                baseUrl: sourceUrl
            })
        }
    });
}
