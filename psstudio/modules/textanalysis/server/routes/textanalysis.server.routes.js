/**
 * Created by Saket on 17/10/17.
 */

var taController=  require('../controllers/textanalysis.server.controller');
var taPolicy = require('../policies/textanalysis.server.policy');

taPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    app.route('/api/v2/projects/:projectId/textAnalysis/feature').all(taPolicy.isAllowed)
    .get(taController.getFeatureValue)

    app.route('/api/v2/projects/:projectId/textAnalysis/experiments').all(taPolicy.isAllowed)
    .get(taController.getExperimentsList)
    .delete(taController.deleteExperiment)

    app.route('/api/v2/textAnalysis/textCleaning').all(taPolicy.isAllowed)
    .post(taController.dotextCleaning)

    app.route('/api/v2/textAnalysis/pos').all(taPolicy.isAllowed)
    .post(taController.doPos)

    app.route('/api/v2/textAnalysis/ner').all(taPolicy.isAllowed)
    .post(taController.doNer)

    app.route('/api/v2/textAnalysis/wordFrequency').all(taPolicy.isAllowed)
    .post(taController.dowordFrequency)

    app.route('/api/v2/textAnalysis/textSummarization').all(taPolicy.isAllowed)
    .post(taController.dotextSummarization)

    app.route('/api/v2/textAnalysis/sentimentAnalysis').all(taPolicy.isAllowed)
    .post(taController.doSentimentAnalysis)

    app.route('/api/v2/textAnalysis/saveAnalysis').all(taPolicy.isAllowed)
    .post(taController.saveAnalysis)
    .put(taController.updateAnalysis)

    app.route('/api/v2/textAnalysis/apply/saveAnalysis').all(taPolicy.isAllowed)
    .post(taController.applyAnalysis)
    .put(taController.updateApplyAnalysis)
    
    app.route('/api/data/textAnalysis/apply/done')
    .post(taController.textanalysisDone)

    app.route('/api/v2/textAnalysis/:taExperimentId')
    .get(taController.findOne)
    
    app.route('/api/v2/textAnalysis/wordEmbedding').all(taPolicy.isAllowed)
    .post(taController.doWordEmbedding)

    app.route('/api/v2/textAnalysis/ruleBasedMatch').all(taPolicy.isAllowed)
    .post(taController.doRuleBasedMatch)

    app.param('taExperimentId',taController.findById)
};
