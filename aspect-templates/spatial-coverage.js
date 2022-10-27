if(dataset?.spatialParameters?.projection !== "WGS84"){
    return {};
} else {
    return {
        "spatialDataInputMethod": "bbox",
        "bbox": [
            dataset?.spatialParameters?.westLongitude,
            dataset?.spatialParameters?.southLatitude,
            dataset?.spatialParameters?.eastLongitude,
            dataset?.spatialParameters?.northLatitude
        ]
    };
}