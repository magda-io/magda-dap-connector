if(dataset?.spatialParameters?.projection !== "WGS84"){
    return {};
} else {
    return {
        "spatialDataInputMethod": "bbox",
        "bbox": [
            dataset?.spatialParameters?.projection?.westLongitude,
            dataset?.spatialParameters?.projection?.southLatitude,
            dataset?.spatialParameters?.projection?.eastLongitude,
            dataset?.spatialParameters?.projection?.northLatitude
        ]
    };
}