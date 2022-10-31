export interface Next {
    relationship: string;
    mediaType?: any;
    href: string;
    fileUpload: boolean;
}

export interface First {
    relationship: string;
    mediaType?: any;
    href: string;
    fileUpload: boolean;
}

export interface Last {
    relationship: string;
    mediaType?: any;
    href: string;
    fileUpload: boolean;
}

export interface Id {
    identifierType: string;
    identifier: string;
}

export interface LandingPage {
    relationship: string;
    mediaType: string;
    href: string;
    fileUpload: boolean;
}

export interface LicenceLink {
    relationship: string;
    mediaType: string;
    href: string;
    fileUpload: boolean;
}

export interface Activity {
    activityTitle: string;
}

export interface Project {
    irpHierarchy: boolean;
    wbs: string;
    projectDescription: string;
}

export interface SpatialParameters {
    projection: string;
    northLatitude: string;
    southLatitude: string;
    westLongitude: string;
    eastLongitude: string;
}

export interface DataCollection {
    id: Id;
    dataCollectionId: number;
    self: string;
    landingPage: LandingPage;
    title: string;
    description: string;
    licence: string;
    licenceLink: LicenceLink;
    attributionStatement: string;
    rights: string;
    published: Date;
    leadResearcher: string;
    contributors: string[];
    activity: Activity;
    collectionType: string;
    andsPid: string;
    doi: string;
    dataRestricted: string;
    project: Project;
    spatialParameters?: SpatialParameters;
}

export interface QueryResultResponse<TCollectionType = DataCollection> {
    elapsedTime: number;
    totalResults: number;
    page: number;
    resultsPerPage: number;
    next: Next;
    previous?: any;
    first: First;
    last: Last;
    query: string;
    showOnlyUnrestrictedData: boolean;
    sortBy: string;
    complete: boolean;
    dataCollections: TCollectionType[];
}

export interface Contact {
    contactName: string;
    contactDetails: string;
}

export interface RelatedLink {
    id: number;
    address: string;
    displayText: string;
    toolTip?: any;
    type: string;
    attributionStatement?: any;
    order: number;
}

export interface AllName {
    name: string;
    display: string;
    orcidId: string;
    type: string;
}

export interface ActivityDetails {
    activityId: number;
    activityTitle: string;
    activityType: string;
    activityDescription: string;
}

export interface ProjectDetails {
    irpHierarchy: boolean;
    wbs: string;
    businessUnit: string;
    program: string;
    projectDescription: string;
    projectLeader: string;
    projectTitle: string;
}

export interface OrganisationalLevels {
    irpHierarchy: boolean;
    businessUnit: string;
    team: string;
    program: string;
    group: string;
}

export interface CollectionResponse {
    dataCollectionTypeCode: string;
    id: Id;
    dataCollectionId: number;
    self: string;
    landingPage: LandingPage;
    title: string;
    description: string;
    legacyId?: any;
    fieldsOfResearch: string[];
    contact: Contact;
    dataStartDate: string;
    dataEndDate: string;
    keywords: string;
    relatedLinks: RelatedLink[];
    lineage: string;
    credit: string;
    licence: string;
    licenceLink: LicenceLink;
    organisations: string[];
    attributionStatement: string;
    rights: string;
    access: string;
    size: string;
    published: Date;
    leadResearcher: string;
    versions: string;
    metadata: string;
    data: string;
    serviceCount: number;
    supportingFiles: string;
    contributors: string[];
    allNames: AllName[];
    activity: ActivityDetails;
    domainType: string;
    collectionContentType: string;
    andsPid: string;
    doi: string;
    project: ProjectDetails;
    organisationalLevels: OrganisationalLevels;
    accessLevel: string;
    dataRestricted: string;
    mounted: boolean;
    depositStatus: string;
    accessViewable: boolean;
    withdrawn: boolean;
    askapLevel7: boolean;
    permaLink: string;
    selfLink: string;
    spatialParameters?: SpatialParameters;
}

export interface Link {
    relationship: string;
    mediaType: string;
    href: string;
    fileUpload: boolean;
}

export interface PresignedLink {
    relationship: string;
    mediaType: string;
    href: string;
    fileUpload: boolean;
}

export interface Parameter {
    name: string;
    value: string;
    units?: any;
    stringValue: string;
    numericValue?: any;
    dateValue?: any;
}

export interface File {
    id: number;
    filename: string;
    lastUpdated: Date;
    fileSize: number;
    link: Link;
    presignedLink: PresignedLink;
    parameters: Parameter[];
    smallThumbnail: string;
    mediumThumbnail: string;
    largeThumbnail: string;
    fullThumbnail: string;
    zipDownloadable: boolean;
}

export interface CollectionFilesResponse {
    id: string;
    self: string;
    licence: string;
    licenceLink: LicenceLink;
    rights: string;
    access: string;
    file: File[];
}

export interface ErrorDetails {
    defaultMessage: string;
    objectName: string;
}

export interface ErrorResponse {
    requestUri: string;
    errors: ErrorDetails[];
}