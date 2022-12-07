const mongoose = require('mongoose');
const Algorithms = mongoose.model('algorithms');
const { ALGORITHMS_ARRAY } = require('../../../../config/assets/algorithms');
const date = new Date().toString();
const config = require('../../../../config/config');

/**
 * Generates a new ticket
 * @param {*} req
 * @param {*} res
 */
exports.createAlgorithm = async (req, res) => {
  try {
    let data = req.body;
    let user = req.user;
    data.createdBy = user._id;
    const docs = await new Algorithms(data).save();
    if (!docs) {
      res.send({ message: 'Cannot create a new algorithm' });
    }
    res.send(docs);
  } catch (err) {
    logger.error('Cannot create algorithm', { error: err.message, Date: date });
    return err.code === 11000
      ? res.status(400).send({ message: 'Algorithm name already exists' })
      : res.status(400).send({ message: err.message });
  }
};

/**
 * Fetches all the algorithms
 * @param {*} req
 * @param {*} res
 */
exports.getAllAlgos = async (req, res) => {
  try {
    const docs = await Algorithms.find({});
    res.send(docs);
  } catch (err) {
    logger.error('Could not foun tickets', { error: err.message, Date: date });
    res.status(400).send({ message: 'Something went wrong' });
  }
};

/**
 * Disables the algorithm
 */
exports.disableAlgorithm = async (req, res) => {
  try {
    const doc = await Algorithms.findByIdAndUpdate(
      { _id: req.params.algoId },
      { status: req.params.status },
      { new: true }
    );
    if (!doc) {
      return res.send({ message: 'Cannot disable the algorithm' });
    }
    res.send(doc);
  } catch (error) {
    logger.error('Cannot disable the algorithm', {
      error: error.message,
      Date: new Date().toString(),
    });
    res.status(400).send({ message: 'Algorithm disabling failed' });
  }
};

/**
 * Updates the algorithms details
 * @param {*} req
 * @param {*} res
 */
exports.updateAlgorithm = async (req, res) => {
  try {
    let body = req.body;
    const docs = await Algorithms.findByIdAndUpdate(
      { _id: req.params.algoId },
      { ...body },
      { new: true }
    );
    if (!docs) {
      res.send({ message: 'No record found to update', data: docs });
    }
    logger.info('Algorithms details updated', { Date: date });
    res.send(docs);
  } catch (err) {
    logger.error('Could not update the algorithm', { error: err.message, Date: date });
    res.status(400).send({ message: err.message });
  }
};

/**
 * Middleware for validating the user and fetching ticket data by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
// exports.ticketById = async (req, res, next) => {
//   try {
//     const docs = await Ticket.findOne({ _id: req.body._id, createdBy: req.body.createdBy });
//     if (docs) {
//       req.ticket = docs;
//       next();
//     } else {
//       req.ticket = null;
//       next();
//     }
//   } catch (err) {
//     logger.error('Error while finding ticket', { error: err, Date: date });
//     next(err);
//   }
// };

/**
 * Soft deletes the algorithm
 */
exports.softDeleteAlgorithm = async (req, res) => {
  try {
    const doc = await Algorithms.findOneAndUpdate({ _id: req.params.algoId }, { isDeleted: true });
    if (!doc) {
      return res.send({ message: 'Unable to delete algorithm' });
    }
    res.send(doc);
  } catch (error) {
    logger.error('Cannot delete the algorithm', {
      error: error.message,
      Date: date,
    });
    res.status(500).send({ message: 'Algorithm deletion failed' });
  }
};

/**
 * Creates the master algorithm table when PS is setup everytime
 * @returns
 */
exports.createDefaultAlgorithms = async () => {
  try {
    let data;
    // let newArray = [];
    const newArray = await mapAlgoStructure();
    // QUERIES
    const count = await Algorithms.find().countDocuments();
    if (count === 0) {
      const doc = await Algorithms.insertMany(newArray);
      doc.length ? (data = 'Algorithms created') : (data = 'Algorithms not created');
    } else {
      data = 'Default algorithms present';
    }
    return data;
  } catch (error) {
    return `Algorithms creation failed - Error: ${error.message}`;
  }
};

/**
 * Maps the algorithm object as required
 * @returns
 */
const mapAlgoStructure = async () => {
  let finalArray = [];
  ALGORITHMS_ARRAY.forEach((i) => {
    let obj2 = {};
    let obj1 = {
      name: i.name || null,
      useGPU: i.useGPU,
      type: i.type || null,
      id: i.id || null,
      url: i.url || null,
    };
    // Disable the algos for SaaS
    config.app.type === 'saas' && config.disableAlgorithms.saas.includes(i.id)
      ? (obj1.status = false)
      : (obj1.status = true);
    // Check for - classification algos
    if (i.type === 'classification') {
      obj1.multilabel = i.multilabel;
      obj2.plotCfg = {};
      if (i.plotCfg && i.plotCfg.binary) {
        obj2.plotCfg.binary = {
          rocAucScore: i.plotCfg.binary.rocAucScore,
          liftGain: i.plotCfg.binary.liftGain,
          prCurve: i.plotCfg.binary.prCurve,
          limeReport: i.plotCfg.binary.limeReport,
          mathewsCoeff: i.plotCfg.binary.mathewsCoeff,
          advancedOpt: {
            featureCoeff: i.plotCfg.binary.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.binary.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.binary.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.binary.advancedOpt.advancedAlgo,
          },
        };
      }
      if (i.plotCfg && i.plotCfg.multiClass) {
        obj2.plotCfg.multiClass = {
          rocAucScore: i.plotCfg.multiClass.rocAucScore,
          liftGain: i.plotCfg.multiClass.liftGain,
          prCurve: i.plotCfg.multiClass.prCurve,
          limeReport: i.plotCfg.multiClass.limeReport,
          mathewsCoeff: i.plotCfg.multiClass.mathewsCoeff,
          advancedOpt: {
            featureCoeff: i.plotCfg.multiClass.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.multiClass.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.multiClass.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.multiClass.advancedOpt.advancedAlgo,
          },
        };
      }
      if (i.plotCfg && i.plotCfg.multiLabel) {
        obj2.plotCfg.multiLabel = {
          rocAucScore: i.plotCfg.multiLabel.rocAucScore,
          liftGain: i.plotCfg.multiLabel.liftGain,
          prCurve: i.plotCfg.multiLabel.prCurve,
          limeReport: i.plotCfg.multiLabel.limeReport,
          mathewsCoeff: i.plotCfg.multiLabel.mathewsCoeff,
          advancedOpt: {
            featureCoeff: i.plotCfg.multiLabel.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.multiLabel.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.multiLabel.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.multiLabel.advancedOpt.advancedAlgo,
          },
        };
      }
    }
    // Check for - regression algos
    else if (i.type === 'regression' && i.plotCfg) {
      obj2.plotCfg = {};
      obj2 = {
        plotCfg: {
          limeReport: i.plotCfg.limeReport,
          advancedOpt: {
            featureCoeff: i.plotCfg.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.advancedOpt.advancedAlgo,
          },
        },
      };
    }
    // Check for - timeseries algos
    else if (i.type === 'timeseries' && i.plotCfg) {
      obj2.plotCfg = {};
      obj2.plotCfg.hpt = i.plotCfg.hpt;
    }
    // Check for - Bagging Classifier, Bagging Regressor, Boosting Classifier, Boosting Regressor
    else if (!i.type && i.plotCfg) {
      obj2.plotCfg = {};
      if (i.plotCfg && i.plotCfg.binary) {
        obj2.plotCfg.binary = {
          rocAucScore: i.plotCfg.binary.rocAucScore,
          liftGain: i.plotCfg.binary.liftGain,
          prCurve: i.plotCfg.binary.prCurve,
          limeReport: i.plotCfg.binary.limeReport,
          mathewsCoeff: i.plotCfg.binary.mathewsCoeff,
          advancedOpt: {
            featureCoeff: i.plotCfg.binary.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.binary.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.binary.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.binary.advancedOpt.advancedAlgo,
          },
        };
      }
      if (i.plotCfg && i.plotCfg.multiClass) {
        obj2.plotCfg.multiClass = {
          rocAucScore: i.plotCfg.multiClass.rocAucScore,
          liftGain: i.plotCfg.multiClass.liftGain,
          prCurve: i.plotCfg.multiClass.prCurve,
          limeReport: i.plotCfg.multiClass.limeReport,
          mathewsCoeff: i.plotCfg.multiClass.mathewsCoeff,
          advancedOpt: {
            featureCoeff: i.plotCfg.multiClass.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.multiClass.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.multiClass.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.multiClass.advancedOpt.advancedAlgo,
          },
        };
      } else {
        obj2.plotCfg = {
          limeReport: i.plotCfg.limeReport,
          advancedOpt: {
            featureCoeff: i.plotCfg.advancedOpt.featureCoeff,
            featureImp: i.plotCfg.advancedOpt.featureImp,
            decisionTreeGraph: i.plotCfg.advancedOpt.decisionTreeGraph,
            advancedAlgo: i.plotCfg.advancedOpt.advancedAlgo,
          },
        };
      }
    }
    finalArray.push({ ...obj1, ...obj2 });
  });
  return finalArray;
};
