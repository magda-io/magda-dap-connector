// remove collection field (a reference to collection / dataset level info)
const { collection, ...restFields } = distribution;
return restFields;
