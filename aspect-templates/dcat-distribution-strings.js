const getDateTimeString = libraries.getDateTimeString;
// Both `dataset` & `distribution` objects are available in the scope
// dataset structure see `CollectionResponse` in src/DapTypes
// distribution structure see `File` in src/DapTypes
return {
    title: distribution.filename || distribution.id,
    description: distribution.description || undefined,
    issued: "",
    modified: getDateTimeString(distribution?.lastUpdated),
    rights: dataset?.rights,
    license: dataset?.licence || undefined,
    accessURL: dataset.landingPage.href || undefined,
    accessNotes: "Please download the file from DAP UI files tab.",
    byteSize: distribution?.fileSize,
    // DAP doesn't allow direct ad-hoc download anymore.
    // We will hide the download URL for now
    //downloadURL: distribution?.link?.href || undefined,
    mediaType: distribution?.link?.mediaType || undefined,
    format: distribution?.link?.mediaType || undefined
};
