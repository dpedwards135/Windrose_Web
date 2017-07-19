const modelClassKey = "";
const listType = "";
const baseDbString = "/v1/qa/model/";

function path(modelClassKey, listType, dbObjectId) {
    return baseDbString + modelClassKey + listType + "/" + dbObjectId;
}

function wUserString(userId) {
    return "user_id/" + userId;
}  

export {path, wUserString};