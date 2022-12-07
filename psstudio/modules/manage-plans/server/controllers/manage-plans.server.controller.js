var path = require('path'),
  logger = require(path.resolve('./logger'));

const mongoose = require('mongoose');
const Plans = mongoose.model('plans');

/**
 * function to get the plans data and return it to the ui.
 * @param {*} req 
 * @param {*} res 
 */
exports.getPlansData = (req, res) => {
  Plans.find().exec(function (err, plansData) {
    if (err) {
      logger.error('Can not get plans data in manage plans', { Date: date })
      return res.status(400).send(err.message);
    }
    res.send(plansData);
  });
}

/**
 * function to add new rule/plan to the plans collection.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addNewRule = async (req, res) => {
  if(req.query.reqType === 'createRule') {
    let data = await Plans.findOneAndUpdate({ 
      planType: req.body.planType, 
      "restrictionPlans.moduleName": req.body.ruleData.moduleName 
    }, { $push: { "restrictionPlans.$.rules": Object.assign({}, ...req.body.ruleData.rules) }}, {
      returnOriginal: false
    });
    if(data) {
      return res.status(200).send({message: "New rule added successfully!"});
    } else {
      let dataWithSamePlanType = await Plans.findOneAndUpdate({ 
        planType: req.body.planType, 
      }, { $push: { restrictionPlans: req.body.ruleData }}, {
        returnOriginal: false
      });
      if(dataWithSamePlanType) {
        return res.status(200).send({message: "New rule added successfully!"});
      } else {
        const newRule = new Plans({
          planType: req.body.planType,
          restrictionPlans: [req.body.ruleData]
        });
        const doc = await newRule.save();
        if(doc) {
          return res.status(200).send({message: "New rule added successfully!"});
        } else {
          logger.error('Can not add new rules in plans collection', { Date: date })
          return res.status(400).send(err.message);
        }
      }
    }
  } else if(req.query.reqType === 'createPlan') {
    Plans.findOne({planType: req.body.ruleData.selectedPlanTemplate}, function (err, planTemplateData) {
      if (err){
        logger.error('Can not add new Plan to the plans collection', { Date: date })
        return res.status(400).send(err.message);
      }
        Plans.create({
          planType: req.body.ruleData.planName,
          restrictionPlans: planTemplateData.restrictionPlans
        }, function(err, plansData){
          if(plansData) {
            return res.status(200).send({message: "New Plan added successfully!"});
          } else {
            logger.error('Can not add new rules in plans collection', { Date: date })
            return res.status(400).send(err.message);
          }
        })
    });
  }
}

/**
 * function to update the rules in the plans collection.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateAndSaveRule = async (req, res) => {
  let data = await Plans.findOneAndUpdate({ 
    planType: req.body.planType, 
    "restrictionPlans.moduleName": req.body.ruleData.moduleName 
  }, { "restrictionPlans.$.rules": req.body.ruleData.rules }, {
    returnOriginal: false
  });
  if(data) {
    return res.status(200).send({message: "Rules updated successfully!"});
  } else {
    logger.error('Could not update rules in plans collection', { Date: date })
    return res.status(400).send({err: {message: "Error in updating rules."}});
  }
}

/**
 * Creates the default plan details during the predictsense setup.
 */
 exports.createDefaultPlanDetails = async () => {
  try {
    let data;
    const user = await User.findOne({ roles: ['super_admin'], email: `${process.env.MAILER_EMAIL_ID}` });
    if (!user) {
      return 'Plans: No sudo user found with super_admin role';
    }
    const count = await Plans.find().countDocuments();
    if (count === 0) {
      // Then save the plan details
      await Plans.insertMany([
        {
          "planType" : "basic",
          "restrictionPlans" : [ 
            {
              "moduleName" : "project",
              "rules" : [ 
                  {
                    "label" : "No of Projects allowed : ",
                    "type" : "number",
                    "name" : "projectCount",
                    "values" : [ 
                      "5"
                    ],
                    "allowedValues" : "5"
                  }, 
                  {
                    "label" : "Allowed project type : ",
                    "type" : "dropdown",
                    "name" : "allowedprojecttype",
                    "values" : [ 
                      "predictive_modeling", 
                      "timeseries", 
                      "clustering"
                    ],
                    "allowedValues" : [ 
                      "predictive_modeling", 
                      "timeseries", 
                      "clustering"
                    ]
                  }, 
                  {
                    "label" : "Allowed project management options : ",
                    "type" : "dropdown",
                    "name" : "allowedprojectmanagementoptions",
                    "values" : [ 
                      "importProject", 
                      "importTemplate", 
                      "projectCreate"
                    ],
                    "allowedValues" : [ 
                      "importTemplate", 
                      "projectCreate"
                    ]
                  }
              ]
            }, 
            {
              "moduleName" : "settings",
              "rules" : [ 
                {
                  "label" : "Allowed settings option : ",
                  "type" : "dropdown",
                  "name" : "allowedsettingsoption",
                  "values" : [ 
                      "db", 
                      "sftp", 
                      "deploy", 
                      "upload", 
                      "logs", 
                      "pscorenodes", 
                      "user", 
                      "managePlans", 
                      "help", 
                      "report", 
                      "scheduler", 
                      "subscription", 
                      "profile",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ],
                  "allowedValues" : [ 
                      "help", 
                      "subscription", 
                      "profile"
                  ]
                }
              ]
            }, 
            {
              "moduleName" : "data",
              "rules" : [ 
                {
                  "label" : "Allowed connection list : ",
                  "type" : "dropdown",
                  "name" : "allowedconnectionlist",
                  "values" : [ 
                      "upload", 
                      "url", 
                      "mssql", 
                      "mysql", 
                      "postgresql", 
                      "sftp",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ],
                  "allowedValues" : [ 
                      "upload"
                  ]
                }, 
                {
                  "label" : "Enterprise connection list : ",
                  "type" : "dropdown",
                  "name" : "enterpriseconnectionlist",
                  "values" : [ 
                      "upload", 
                      "url", 
                      "mssql", 
                      "mysql", 
                      "postgresql", 
                      "sftp",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ],
                  "allowedValues" : [ 
                      "url", 
                      "sftp",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ]
                }, 
                {
                  "label" : "Allowed number of rows : ",
                  "type" : "number",
                  "name" : "allowednumberofrows",
                  "values" : [ 
                    "25000"
                  ],
                  "allowedValues" : "25000"
                }, 
                {
                  "label" : "Allowed number of columns : ",
                  "type" : "number",
                  "name" : "allowednumberofcolumns",
                  "values" : [ 
                      "15"
                  ],
                  "allowedValues" : "15"
                }, 
                {
                  "label" : "File upload limit : ",
                  "type" : "number",
                  "name" : "fileuploadlimit",
                  "values" : [ 
                      "3"
                  ],
                  "allowedValues" : "3"
                }
              ]
            }, 
            {
              "moduleName" : "eda",
              "rules" : [ 
                  {
                    "label" : "Allowed eda advance options : ",
                    "type" : "dropdown",
                    "name" : "allowededaadvanceoptions",
                    "values" : [ 
                      "splitDataset", 
                      "missingThreshold", 
                      "imputationFeature", 
                      "conditionalFiltering", 
                      "stringTransformation"
                    ],
                    "allowedValues" : [ 
                      "splitDataset", 
                      "missingThreshold"
                    ]
                  }, 
                  {
                    "label" : "Allowed number of eda/file : ",
                    "type" : "number",
                    "name" : "allowednumberofeda/file",
                    "values" : [ 
                        "2"
                    ],
                    "allowedValues" : "2"
                  }
              ]
            }, 
            {
              "moduleName" : "training",
              "rules" : [ 
                  {
                    "label" : "Allowed training advance options : ",
                    "type" : "dropdown",
                    "name" : "allowedtrainingadvanceoptions",
                    "values" : [ 
                      "featureGeneration", 
                      "transformation", 
                      "featureReduction", 
                      "sampling", 
                      "algorithmParameters", 
                      "nlp", 
                      "visualiseComponent", 
                      "stationarityTest", 
                      "resampling", 
                      "autoCorrelation"
                    ],
                    "allowedValues" : [ 
                      "transformation", 
                      "featureReduction", 
                      "algorithmParameters", 
                      "visualiseComponent", 
                      "stationarityTest", 
                      "autoCorrelation"
                    ]
                  }, 
                {
                  "label" : "Number of algorithms allowed : ",
                  "type" : "number",
                  "name" : "numberofalgorithmsallowed",
                  "values" : [ 
                      "3"
                  ],
                  "allowedValues" : "3"
                }, 
                {
                  "label" : "Number of training allowed/project : ",
                  "type" : "number",
                  "name" : "numberoftrainingallowed/project",
                  "values" : [ 
                      "2"
                  ],
                  "allowedValues" : "2"
                }
              ]
            }, 
            {
              "moduleName" : "user",
              "rules" : [ 
                {
                  "label" : "Number of invitations allowed : ",
                  "type" : "number",
                  "name" : "numberofinvitationsallowed",
                  "values" : [ 
                      "0"
                  ],
                  "allowedValues" : "0"
                }
              ]
            }, 
            {
              "moduleName" : "model",
              "rules" : [ 
                {
                  "label" : "Allowed model options : ",
                  "type" : "dropdown",
                  "name" : "allowedmodeloptions",
                  "values" : [ 
                      "none", 
                      "pipeline", 
                      "compareModels", 
                      "advanceAlgorithm", 
                      "retrain", 
                      "deployModel", 
                      "downloadModel", 
                      "limeReport", 
                      "rocAucScore", 
                      "liftAndGain", 
                      "prCurve", 
                      "decisionTree", 
                      "crossValidation"
                  ],
                  "allowedValues" : [ 
                      "none"
                  ]
                }, 
                {
                  "label" : "Number of rows allowed for QP : ",
                  "type" : "number",
                  "name" : "numberofrowsallowedforqp",
                  "values" : [ 
                      "50"
                  ],
                  "allowedValues" : "50"
                }, 
                {
                  "label" : "Number of columns allowed for QP : ",
                  "type" : "number",
                  "name" : "numberofcolumnsallowedforqp",
                  "values" : [ 
                      "20"
                  ],
                  "allowedValues" : "20"
                }, 
                {
                  "label" : "Number of rows allowed for scoring : ",
                  "type" : "number",
                  "name" : "numberofrowsallowedforscoring",
                  "values" : [ 
                      "50"
                  ],
                  "allowedValues" : "50"
                }, 
                {
                  "label" : "Number of columns allowed for scoring : ",
                  "type" : "number",
                  "name" : "numberofcolumnsallowedforscoring",
                  "values" : [ 
                      "20"
                  ],
                  "allowedValues" : "20"
                }
              ]
            }, 
            {
              "moduleName" : "menu",
              "rules" : [ 
                {
                  "label" : "Allowed menu items : ",
                  "type" : "dropdown",
                  "name" : "allowedmenuitems",
                  "values" : [ 
                      "Home", 
                      "Data", 
                      "EDA", 
                      "Notebook", 
                      "Text Analysis", 
                      "Train Model", 
                      "Models", 
                      "Drift Analysis", 
                      "Feature Repo", 
                      "Inference", 
                      "Reports"
                  ],
                  "allowedValues" : [ 
                      "Home", 
                      "Data", 
                      "EDA", 
                      "Train Model", 
                      "Models"
                  ]
                }, 
                {
                  "label" : "Allowed submenu items : ",
                  "type" : "dropdown",
                  "name" : "allowedsubmenuitems",
                  "values" : [ 
                      "Data Connection", 
                      "Data Set", 
                      "Data Flow", 
                      "Drift Report", 
                      "Drift Settings"
                  ],
                  "allowedValues" : [ 
                      "Data Connection", 
                      "Data Set"
                  ]
                }
              ]
            }, 
            {
              "moduleName" : "feedback",
              "rules" : [ 
                {
                  "label" : "Number of projects for reward : ",
                  "type" : "number",
                  "name" : "numberofprojectsforreward",
                  "values" : [ 
                      "2"
                  ],
                  "allowedValues" : "2"
                }
              ]
            }
          ]
        },{
          "planType" : "pro",
          "restrictionPlans" : [ 
            {
              "moduleName" : "project",
              "rules" : [ 
                  {
                    "label" : "No of Projects allowed : ",
                    "type" : "number",
                    "name" : "projectCount",
                    "values" : [ 
                      "20"
                    ],
                    "allowedValues" : "20"
                  }, 
                  {
                    "label" : "Allowed project type : ",
                    "type" : "dropdown",
                    "name" : "allowedprojecttype",
                    "values" : [ 
                      "predictive_modeling", 
                      "timeseries", 
                      "clustering"
                    ],
                    "allowedValues" : [ 
                      "predictive_modeling", 
                      "timeseries", 
                      "clustering"
                    ]
                  }, 
                  {
                    "label" : "Allowed project management options : ",
                    "type" : "dropdown",
                    "name" : "allowedprojectmanagementoptions",
                    "values" : [ 
                      "importProject", 
                      "importTemplate", 
                      "projectCreate"
                    ],
                    "allowedValues" : [ 
                      "importTemplate", 
                      "projectCreate"
                    ]
                  }
              ]
            }, 
            {
              "moduleName" : "settings",
              "rules" : [ 
                {
                  "label" : "Allowed settings option : ",
                  "type" : "dropdown",
                  "name" : "allowedsettingsoption",
                  "values" : [ 
                      "db", 
                      "sftp", 
                      "deploy", 
                      "upload", 
                      "logs", 
                      "pscorenodes", 
                      "user", 
                      "managePlans", 
                      "help", 
                      "report", 
                      "scheduler", 
                      "subscription", 
                      "profile",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ],
                  "allowedValues" : [ 
                      "db",
                      "user",
                      "help", 
                      "subscription", 
                      "profile"
                  ]
                }
              ]
            }, 
            {
              "moduleName" : "data",
              "rules" : [ 
                {
                  "label" : "Allowed connection list : ",
                  "type" : "dropdown",
                  "name" : "allowedconnectionlist",
                  "values" : [ 
                      "upload", 
                      "url", 
                      "mssql", 
                      "mysql", 
                      "postgresql", 
                      "sftp",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ],
                  "allowedValues" : [ 
                      "upload",
                      "mysql",
                      "mssql", 
                      "postgresql"
                  ]
                }, 
                {
                  "label" : "Enterprise connection list : ",
                  "type" : "dropdown",
                  "name" : "enterpriseconnectionlist",
                  "values" : [ 
                      "upload", 
                      "url", 
                      "mssql", 
                      "mysql", 
                      "postgresql", 
                      "sftp",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ],
                  "allowedValues" : [ 
                      "url", 
                      "sftp",
                      "snowflake",
                      "s3",
                      "bigquery"
                  ]
                }, 
                {
                  "label" : "Allowed number of rows : ",
                  "type" : "number",
                  "name" : "allowednumberofrows",
                  "values" : [ 
                    "150000"
                  ],
                  "allowedValues" : "150000"
                }, 
                {
                  "label" : "Allowed number of columns : ",
                  "type" : "number",
                  "name" : "allowednumberofcolumns",
                  "values" : [ 
                      "20"
                  ],
                  "allowedValues" : "20"
                }, 
                {
                  "label" : "File upload limit : ",
                  "type" : "number",
                  "name" : "fileuploadlimit",
                  "values" : [ 
                      "5"
                  ],
                  "allowedValues" : "5"
                }
              ]
            }, 
            {
              "moduleName" : "eda",
              "rules" : [ 
                  {
                    "label" : "Allowed eda advance options : ",
                    "type" : "dropdown",
                    "name" : "allowededaadvanceoptions",
                    "values" : [ 
                      "splitDataset", 
                      "missingThreshold", 
                      "imputationFeature", 
                      "conditionalFiltering", 
                      "stringTransformation"
                    ],
                    "allowedValues" : [ 
                      "splitDataset", 
                      "missingThreshold",
                      "imputationFeature",
                      "conditionalFiltering",
                      "stringTransformation"
                    ]
                  }, 
                  {
                    "label" : "Allowed number of eda/file : ",
                    "type" : "number",
                    "name" : "allowednumberofeda/file",
                    "values" : [ 
                        "4"
                    ],
                    "allowedValues" : "4"
                  }
              ]
            }, 
            {
              "moduleName" : "training",
              "rules" : [ 
                  {
                    "label" : "Allowed training advance options : ",
                    "type" : "dropdown",
                    "name" : "allowedtrainingadvanceoptions",
                    "values" : [ 
                      "featureGeneration", 
                      "transformation", 
                      "featureReduction", 
                      "sampling", 
                      "algorithmParameters", 
                      "nlp", 
                      "visualiseComponent", 
                      "stationarityTest", 
                      "resampling", 
                      "autoCorrelation"
                    ],
                    "allowedValues" : [ 
                      "featureGeneration",
                      "transformation", 
                      "featureReduction", 
                      "algorithmParameters", 
                      "visualiseComponent", 
                      "stationarityTest", 
                      "autoCorrelation",
                      "sampling",
                      "nlp",
                      "resampling"
                    ]
                  }, 
                {
                  "label" : "Number of algorithms allowed : ",
                  "type" : "number",
                  "name" : "numberofalgorithmsallowed",
                  "values" : [ 
                      "3"
                  ],
                  "allowedValues" : "3"
                }, 
                {
                  "label" : "Number of training allowed/project : ",
                  "type" : "number",
                  "name" : "numberoftrainingallowed/project",
                  "values" : [ 
                      "4"
                  ],
                  "allowedValues" : "4"
                }
              ]
            }, 
            {
              "moduleName" : "user",
              "rules" : [ 
                {
                  "label" : "Number of invitations allowed : ",
                  "type" : "number",
                  "name" : "numberofinvitationsallowed",
                  "values" : [ 
                      "5"
                  ],
                  "allowedValues" : "5"
                }
              ]
            }, 
            {
              "moduleName" : "model",
              "rules" : [ 
                {
                  "label" : "Allowed model options : ",
                  "type" : "dropdown",
                  "name" : "allowedmodeloptions",
                  "values" : [ 
                      "none", 
                      "pipeline", 
                      "compareModels", 
                      "advanceAlgorithm", 
                      "retrain", 
                      "deployModel", 
                      "downloadModel", 
                      "limeReport", 
                      "rocAucScore", 
                      "liftAndGain", 
                      "prCurve", 
                      "decisionTree", 
                      "crossValidation"
                  ],
                  "allowedValues" : [ 
                    "pipeline", 
                    "advanceAlgorithm",
                    "limeReport",
                    "rocAucScore", 
                    "liftAndGain", 
                    "prCurve", 
                    "decisionTree",
                    "crossValidation"
                  ]
                }, 
                {
                  "label" : "Number of rows allowed for QP : ",
                  "type" : "number",
                  "name" : "numberofrowsallowedforqp",
                  "values" : [ 
                      "150"
                  ],
                  "allowedValues" : "150"
                }, 
                {
                  "label" : "Number of columns allowed for QP : ",
                  "type" : "number",
                  "name" : "numberofcolumnsallowedforqp",
                  "values" : [ 
                      "20"
                  ],
                  "allowedValues" : "20"
                }, 
                {
                  "label" : "Number of rows allowed for scoring : ",
                  "type" : "number",
                  "name" : "numberofrowsallowedforscoring",
                  "values" : [ 
                      "150"
                  ],
                  "allowedValues" : "150"
                }, 
                {
                  "label" : "Number of columns allowed for scoring : ",
                  "type" : "number",
                  "name" : "numberofcolumnsallowedforscoring",
                  "values" : [ 
                      "20"
                  ],
                  "allowedValues" : "20"
                }
              ]
            }, 
            {
              "moduleName" : "menu",
              "rules" : [ 
                {
                  "label" : "Allowed menu items : ",
                  "type" : "dropdown",
                  "name" : "allowedmenuitems",
                  "values" : [ 
                      "Home", 
                      "Data", 
                      "EDA", 
                      "Notebook", 
                      "Text Analysis", 
                      "Train Model", 
                      "Models", 
                      "Drift Analysis", 
                      "Feature Repo", 
                      "Inference", 
                      "Reports"
                  ],
                  "allowedValues" : [ 
                      "Home", 
                      "Data", 
                      "EDA", 
                      "Train Model", 
                      "Models"
                  ]
                }, 
                {
                  "label" : "Allowed submenu items : ",
                  "type" : "dropdown",
                  "name" : "allowedsubmenuitems",
                  "values" : [ 
                      "Data Connection", 
                      "Data Set", 
                      "Data Flow", 
                      "Drift Report", 
                      "Drift Settings"
                  ],
                  "allowedValues" : [ 
                      "Data Connection", 
                      "Data Set"
                  ]
                }
              ]
            }, 
            {
              "moduleName" : "feedback",
              "rules" : [ 
                {
                  "label" : "Number of projects for reward : ",
                  "type" : "number",
                  "name" : "numberofprojectsforreward",
                  "values" : [ 
                      "2"
                  ],
                  "allowedValues" : "2"
                }
              ]
            }
          ]
        }
      ])
        .then((doc) => {
          doc ? (data = 'Default Plans created') : (data = 'Default Plans not created');
        })
        .catch((e) => (data = `Default Plans creation failed - Error: ${e.message}`));
    } else {
      data = 'Default Plans present';
    }
    return data;
    // });
  } catch (error) {
    return `Default Plans creation failed - Error: ${error.message}`;
  }
};