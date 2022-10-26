const moment = libraries.moment;
const dap = libraries.dap;
// distribution structure see `CollectionResponse` in src/DapTypes
return {
    title: dataset.title || dataset.name,
    description: `${dataset?.description ? dataset.description + "\n\n" : ""}${
        dataset?.access ? dataset.access + "\n\n" : ""
    }`,
    issued: dataset.published
        ? moment.utc(dataset.published).format()
        : undefined,
    modified: undefined,
    languages: ["English"],
    publisher:
        "The Commonwealth Scientific and Industrial Research Organisation",
    accrualPeriodicity: "",
    spatial: "",
    temporal: {
        start: dataset.dataStartDate,
        end: dataset.dataEndDate
    },
    themes: dataset.fieldOfResearch || [],
    keywords: dataset.keywords ? dataset.keywords.split(/[;,]+/) : [],
    contactPoint: dataset.attributionStatement,
    landingPage: dataset.landingPage.href,
    defaultLicense: dataset?.licence
};
