const moment = libraries.moment;
// distribution structure see `FileWithExtraFields` in src/DapTypes
return {
    title: distribution.name || distribution.id,
    license: distribution.licence || undefined,
    accessURL: distribution.accessURL || undefined,
    // DAP doesn't allow direct ad-hoc download anymore. 
    // We will hide the download URL for now
    // downloadURL: distribution.downloadURL || undefined,
    mediaType: distribution.mediaType || undefined,
    format: distribution.format || undefined,
    description: distribution.description || undefined,
    issued: "",
    modified: distribution.lastUpdated
        ? moment
              .unix(distribution.lastUpdated)
              .utc()
              .format()
        : undefined
};
