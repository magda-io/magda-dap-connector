if (dataset?.spatialParameters?.projection !== "WGS84") {
    return {};
} else {
    const westLongitude = dataset?.spatialParameters?.westLongitude;
    const southLatitude = dataset?.spatialParameters?.southLatitude;
    const eastLongitude = dataset?.spatialParameters?.eastLongitude;
    const northLatitude = dataset?.spatialParameters?.northLatitude;

    const bboxItems = [
        westLongitude,
        southLatitude,
        eastLongitude,
        northLatitude
    ]
        .map((item) => parseFloat(item))
        .filter((item) => !isNaN(item));

    if (bboxItems.length !== 4) {
        return {};
    }
    
    return {
        spatialDataInputMethod: "bbox",
        bbox: bboxItems
    };
}
