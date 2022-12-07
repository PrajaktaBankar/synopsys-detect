var Ajv = require('ajv');
var ajv = new Ajv();

//*********Validation schema for Create Shared Feature API*/
var sharedFeaturesListInnerSchema = {
    "type":"object",
    "properties":{
        "aggregateStrategy":{
            "type":"string"
        },
        "colName":{
            "type":"string",

        }
    },
    "required":["aggregateStrategy","colName"]
}
var sharedFeaturesListSchema = {
    "type":"array",
    "items":sharedFeaturesListInnerSchema
}
var createFeatureSchema = {
    "type":"object",
    "properties":{
        "name":{
            "type":"string",
            "allOf":[
                {"not":{"maxLength":0},errorMessage:'Name is required!'}
            ]
        },
        "sharedIndex": { "type": "array", "items": { "type": "string" }, "minItems": 1 ,errorMessage:'Shared index column cannot be empty!'},
        "sharedFeaturesList":sharedFeaturesListSchema
    },
    "required":["name","sharedIndex","sharedFeaturesList"]
}

var validateCreateFeatureSchema = ajv.compile(createFeatureSchema)
module.exports = {
    validateCreateFeatureSchema:validateCreateFeatureSchema
}
//************************END ***************************** */