import { AsyncPage, formatServiceError, retry } from "@magda/utils";
import { ConnectorSource } from "@magda/connector-sdk";
import DapUrlBuilder from "./DapUrlBuilder";
import URI from "urijs";
import requestJson from "./requestJson";
import * as DapTypes from "./DapTypes";

export interface DapOptions {
    baseUrl: string;
    id: string;
    name: string;
    apiBaseUrl?: string;
    pageSize?: number;
    distributionSize?: number;
    maxRetries?: number;
    secondsBetweenRetries?: number;
    ignoreHarvestSources?: string[];
}

function collectionFile2Distribution(
    colDetails: DapTypes.CollectionResponse,
    fileDetails: DapTypes.CollectionFilesResponse,
    file: DapTypes.File
): DapTypes.FileWithExtraFields {
    return {
        ...file,
        licence: fileDetails.licence,
        licenceLink: fileDetails.licenceLink,
        rights: fileDetails.rights,
        access: fileDetails.access,
        collection: colDetails
    };
    // const mediaType = file["link"]["mediaType"];
    // const distributionObj: any = {};
    // distributionObj["licence"] = detail["licence"];
    // distributionObj["accessURL"] = detail["self"];
    // distributionObj["downloadURL"] = file["link"]["href"];
    // distributionObj["id"] = file["id"];
    // distributionObj["mediaType"] = mediaType;
    // distributionObj["format"] = mediaType;
    // distributionObj["name"] = file["filename"];
    // return distributionObj;
}

export default class Dap implements ConnectorSource {
    public readonly id: string;
    public readonly name: string;
    public readonly pageSize: number;
    public readonly distributionSize: number;
    public readonly maxRetries: number;
    public readonly secondsBetweenRetries: number;
    public readonly urlBuilder: DapUrlBuilder;
    private ignoreHarvestSources: string[];
    readonly hasFirstClassOrganizations: boolean = true;
    constructor({
        baseUrl,
        id,
        name,
        apiBaseUrl,
        pageSize = 1000,
        distributionSize = 24,
        maxRetries = 10,
        secondsBetweenRetries = 10,
        ignoreHarvestSources = []
    }: DapOptions) {
        this.id = id;
        this.name = name;
        this.pageSize = pageSize;
        this.distributionSize = distributionSize;
        this.maxRetries = maxRetries;
        this.secondsBetweenRetries = secondsBetweenRetries;
        this.ignoreHarvestSources = ignoreHarvestSources;
        this.urlBuilder = new DapUrlBuilder({
            id: id,
            name: name,
            baseUrl,
            apiBaseUrl
        });
    }
    // DAP data source contains only one organization CSIRO, so leave a static organization description here.
    private organization = {
        name: "The Commonwealth Scientific and Industrial Research Organisation",
        identifier: "CSIRO",
        title: "The Commonwealth Scientific and Industrial Research Organisation",
        description: `The Commonwealth Scientific and Industrial Research Organisation (CSIRO) is Australia's national science agency and one of the largest and most diverse research agencies in the world. The CSIRO Data Access Portal provides access to research data, software and other digital assets published by CSIRO across a range of disciplines. The portal is maintained by CSIRO Information Management & Technology to facilitate sharing and reuse.`,
        imageUrl:
            "https://data.csiro.au/dap/resources-2.6.6/images/csiro_logo.png",
        phone: "1300 363 400",
        email: "CSIROEnquiries@csiro.au",
        website: "https://data.csiro.au/"
    };

    public getJsonDatasets(): AsyncPage<DapTypes.CollectionResponse[]> {
        const packagePages = this.packageSearch({
            ignoreHarvestSources: this.ignoreHarvestSources
        });
        return packagePages.map((packagePage) => packagePage.dataCollections);
    }

    public async getJsonDataset(
        id: string
    ): Promise<DapTypes.CollectionResponse> {
        return await this.requestCollectionDetails(id);
    }
    public getJsonDistributions(
        dataset: DapTypes.CollectionResponse
    ): AsyncPage<DapTypes.FileWithExtraFields[]> {
        // dataset of dataCollection from DAP /collections api does not contain a 'data' field, which defines the distributions
        // Here use an api call (/collections/id) to get the dataset with the url in field 'data', and then fetch
        return AsyncPage.singlePromise<DapTypes.FileWithExtraFields[]>(
            this.requestCollectionFileDetails(dataset)
        );
    }

    public packageSearch(options?: {
        ignoreHarvestSources?: string[];
        q?: string;
        p?: number;
        soud?: string;
        sb?: string;
        rpp?: number;
    }): AsyncPage<DapTypes.QueryResultResponse<DapTypes.CollectionResponse>> {
        const url = new URI(this.urlBuilder.getPackageSearchUrl());

        const solrQueries = [];

        if (
            options &&
            options.ignoreHarvestSources &&
            options.ignoreHarvestSources.length > 0
        ) {
            solrQueries.push(
                ...options.ignoreHarvestSources.map((title) => {
                    const encoded =
                        title === "*"
                            ? title
                            : encodeURIComponent('"' + title + '"');
                    return `-harvest_source_title:${encoded}`;
                })
            );
        }

        let fqComponent = "";
        if (solrQueries.length > 0) {
            fqComponent = "&q=" + solrQueries.join("+");
        }

        if (options && options.sb) {
            url.addSearch("sb", options.sb);
        }
        if (options && options.soud) {
            url.addSearch("soud", options.soud);
        }

        const startStart = options.p || 1;
        let startIndex = startStart;

        return AsyncPage.create<
            DapTypes.QueryResultResponse<DapTypes.CollectionResponse>
        >((previous) => {
            if (previous) {
                if (
                    startIndex * previous.resultsPerPage >=
                    previous.totalResults
                ) {
                    return undefined;
                } else {
                    startIndex = startIndex + 1;
                }
            }
            const remaining = options.rpp
                ? startIndex * options.rpp - previous.totalResults
                : undefined;
            return this.requestPackageSearchPage(
                url,
                fqComponent,
                startIndex,
                remaining
            );
        });
    }

    searchDatasetsByTitle(title: string, maxResults: number): AsyncPage<any[]> {
        return AsyncPage.single([this.organization]);
    }

    public getJsonFirstClassOrganizations(): AsyncPage<any[]> {
        return AsyncPage.single([this.organization]);
    }

    getJsonFirstClassOrganization(id: string): Promise<any> {
        return Promise.resolve(this.organization);
    }

    searchFirstClassOrganizationsByTitle(
        title: string,
        maxResults: number
    ): AsyncPage<any[]> {
        return AsyncPage.single([this.organization]);
    }

    public getJsonDatasetPublisherId(dataset: any): string {
        return "CSIRO";
    }

    getJsonDatasetPublisher(dataset: any): Promise<any> {
        return Promise.resolve(this.organization);
    }

    private async requestCollectionDetails(
        id: string
    ): Promise<DapTypes.CollectionResponse> {
        // Different ckan which will return detailed data with distributions, DAP collection queries just returns summary kinds of data
        // To make the returned data contains detailed data, used Promise.all(dataset.id.identifier) to query detail data again use another api
        const url = this.urlBuilder.getPackageShowUrl(id);
        const collectionDetail = await requestJson<DapTypes.CollectionResponse>(
            url
        );
        console.log(">> request detail of " + url);
        if (collectionDetail.access) {
            // --- added access info to description
            // --- so that we know why the dataset has no distribution
            // --- and when the distribution will be available for public
            collectionDetail.description = `${collectionDetail.description}\n\n${collectionDetail.access}\n\n`;
        }
        return collectionDetail;
    }

    // DAP has dataset which included thousands of distributions (spacial data)
    // Harvest these distributoions will cause the magda harvest and indexer process really slow (days)
    // Read environment param distributionSize and harvest only limited distributions with every formats data included
    private async requestCollectionFileDetails(
        colDetail: DapTypes.CollectionResponse
    ): Promise<DapTypes.FileWithExtraFields[]> {
        if (!colDetail?.data) {
            return [];
        }

        let fileDetails: DapTypes.CollectionFilesResponse;

        try {
            fileDetails = await requestJson<DapTypes.CollectionFilesResponse>(
                colDetail.data
            );
        } catch (e) {
            const id = colDetail?.id?.identifier;
            console.log(
                `** Unable to fetch files for collection: ${id}; url: ${colDetail.data}`
            );
            console.log(`** Reason: ${e}`);
            return [];
        }

        console.log(
            ">> request distribution of " + colDetail.data,
            fileDetails?.file?.length
        );

        if (!fileDetails?.file?.length) {
            return [];
        }

        const distributionMap = {} as {
            [key: string]: DapTypes.FileWithExtraFields[];
        };
        fileDetails.file.forEach((file) => {
            const mediaType = file["link"]["mediaType"];
            if (!distributionMap[mediaType]) {
                distributionMap[mediaType] = [];
            }
            const distributionObj = collectionFile2Distribution(
                colDetail,
                fileDetails,
                file
            );
            distributionMap[mediaType].push(distributionObj);
        });
        // let avgDistSize = Math.ceil(this.distributionSize/distributionMap.size)
        let returnDistributions: DapTypes.FileWithExtraFields[] = [];
        Object.keys(distributionMap).forEach((mediaType) => {
            const dists = distributionMap[mediaType];
            returnDistributions = returnDistributions.concat(
                dists.slice(
                    0,
                    Math.ceil(
                        (dists.length * this.distributionSize) /
                            fileDetails.file.length
                    )
                )
            );
        });
        return returnDistributions;
    }

    // Custom this function following the DAP API specification: https://confluence.csiro.au/display/daphelp/Web+Services+Interface
    private requestPackageSearchPage(
        url: URI,
        fqComponent: string,
        startIndex: number,
        maxResults: number
    ): Promise<DapTypes.QueryResultResponse<DapTypes.CollectionResponse>> {
        const pageSize =
            maxResults && maxResults < this.pageSize
                ? maxResults
                : this.pageSize;

        const pageUrl = url.clone();
        pageUrl.addSearch("p", startIndex);
        pageUrl.addSearch("rpp", pageSize);

        const operation = async () => {
            const requestUrl = pageUrl.toString() + fqComponent;
            const searchResult =
                await requestJson<DapTypes.QueryResultResponse>(requestUrl);
            console.log("Received@" + startIndex);

            if (searchResult.totalResults) {
                // DAP currently respond `totalResults` in string type at this moment.
                // we will auto-convert it to fix it.
                searchResult.totalResults = parseInt(
                    searchResult.totalResults as unknown as string
                );
            }

            if (!searchResult?.dataCollections?.length) {
                throw new Error(
                    `Got empty collections at page: ${startIndex}. Res: ${JSON.stringify(
                        searchResult
                    )}`
                );
            }

            const collections: DapTypes.CollectionResponse[] = [];
            for (const simpleData of searchResult?.dataCollections) {
                const col = await await this.requestCollectionDetails(
                    simpleData.id.identifier
                );
                collections.push({
                    ...col,
                    // collection detail endpoint will respond spatial parameter in
                    // e.g. `10°28′5.466″ S`
                    // search result page's format is closer to what we need:
                    // e.g. `"-10.468185"`
                    spatialParameters: simpleData.spatialParameters
                });
            }
            return { ...searchResult, dataCollections: collections };
        };

        return retry(
            operation,
            this.secondsBetweenRetries,
            this.maxRetries,
            (e, retriesLeft) =>
                console.log(
                    formatServiceError(
                        `Failed to GET ${pageUrl.toString()}.`,
                        e,
                        retriesLeft
                    )
                )
        );
    }
}
