import "mocha";
import { expect } from "chai";
import nock from "nock";
import createTransformer from "../createTransformer";
import path from "path";
import {
    JsonConnector,
    AuthorizedRegistryClient as Registry
} from "@magda/connector-sdk";
import {
    datasetAspectBuilders,
    organizationAspectBuilders,
    distributionAspectBuilders
} from "../aspectBuilders";
import Dap from "../Dap";
import * as fse from "fs-extra";

describe("Integration tests", () => {
    before(() => {
        nock.disableNetConnect();
    });

    after(() => {
        nock.enableNetConnect();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    const TENANT_ID_1 = 1;

    function setupCrawlTest(
        searchResponseFileName: string,
        collectionDetailResponseFileName: string,
        collectionFilesResponseFileName: string,
        resultRecordsJsonFileName: string
    ) {
        const connectorId = "dap";
        const connectName = "CSIRO";
        const sourceBaseUrl = "https://data.csiro.au";
        const sourceUrl = `${sourceBaseUrl}/dap/ws/v2/`;
        const registryBaseUrl = "http://example.com";

        const dap = new Dap({
            baseUrl: sourceUrl,
            id: connectorId,
            name: connectName,
            pageSize: 100
        });

        const registry = new Registry({
            baseUrl: registryBaseUrl,
            jwtSecret: "squirrel",
            userId: "1",
            maxRetries: 0,
            tenantId: TENANT_ID_1
        });

        const transformerOptions = {
            id: connectorId,
            name: connectName,
            sourceUrl: sourceUrl,
            datasetAspectBuilders,
            distributionAspectBuilders,
            organizationAspectBuilders,
            tenantId: TENANT_ID_1
        };

        const transformer = createTransformer(transformerOptions);

        const connector = new JsonConnector({
            source: dap,
            transformer: transformer,
            registry: registry
        });

        const sourceScope = nock(sourceBaseUrl);

        sourceScope
            .get("/dap/ws/v2/collections")
            .query(true)
            .reply(200, function (uri, requestBody) {
                expect(this.req.headers["content-type"]).to.equal(
                    "application/json"
                );
                return fse.readJSONSync(
                    path.resolve(__dirname, searchResponseFileName),
                    { encoding: "utf-8" }
                );
            });

        const collectJson = fse.readJSONSync(
            path.resolve(__dirname, collectionDetailResponseFileName),
            { encoding: "utf-8" }
        );

        sourceScope
            .get(`/dap/ws/v2/collections/${collectJson.dataCollectionId}`)
            .query(true)
            .reply(200, function (uri, requestBody) {
                expect(this.req.headers["content-type"]).to.equal(
                    "application/json"
                );
                return { ...collectJson };
            });

        console.log(
            `/dap/ws/v2/collections/${collectJson.dataCollectionId}/data`
        );
        sourceScope
            .get(`/dap/ws/v2/collections/${collectJson.dataCollectionId}/data`)
            .query(true)
            .reply(200, function (uri, requestBody) {
                expect(this.req.headers["content-type"]).to.equal(
                    "application/json"
                );
                return fse.readJSONSync(
                    path.resolve(__dirname, collectionFilesResponseFileName),
                    { encoding: "utf-8" }
                );
            });

        const records = [] as any[];
        const registryScope = nock("http://example.com");
        registryScope
            .put((uri) => uri.startsWith("/records/"))
            .reply(200, function (uri, requestBody) {
                records.push(requestBody);
                return requestBody;
            })
            .persist(true);

        registryScope
            .delete("/records")
            .query((query) => {
                if (query?.sourceId !== "dap") {
                    return false;
                }
                if (!query?.sourceTagToPreserve) {
                    return false;
                }
                return true;
            })
            .reply(200, { count: 0 });

        const removeSourceTag = (obj: any) => {
            const { sourceTag, ...restFields } = obj;
            return restFields;
        };

        it(
            `should produce result for \n- search response ${collectionDetailResponseFileName}; \n` +
                `- collection response ${collectionDetailResponseFileName}; \n` +
                `- collection files response ${collectionDetailResponseFileName} \nthat matches ${resultRecordsJsonFileName}`,
            async () => {
                await connector.run();
                sourceScope.done();
                //console.log(JSON.stringify(records));
                expect(
                    fse
                        .readJSONSync(
                            path.resolve(__dirname, resultRecordsJsonFileName),
                            { encoding: "utf-8" }
                        )
                        .map(removeSourceTag)
                ).to.deep.equal(records.map(removeSourceTag));
            }
        );
    }

    setupCrawlTest(
        "searchResult53623.json",
        "collectionDetailsRes53623.json",
        "collectionFileDetailsRes53623.json",
        "harvestRecords53623.json"
    );
});
