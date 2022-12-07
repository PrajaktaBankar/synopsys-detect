/**
 * Created by Saurabh on 09/02/22
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Advanced options for each classification/regression type
const AdvancedOptSchema = new Schema({
  featureCoeff: Boolean,
  featureImp: Boolean,
  decisionTreeGraph: Boolean,
  advancedAlgo: Boolean,
});

// Classifications types - Binary, Multilabel, Multiclass
const ClassificationTypeSchema = new Schema({
  rocAucScore: Boolean,
  liftGain: Boolean,
  prCurve: Boolean,
  limeReport: Boolean,
  mathewsCoeff: Boolean,
  advancedOpt: { type: Object, AdvancedOptSchema },
});

// Main algorithm schema
const AlgorithmSchema = new Schema(
  {
    name: { type: String, unique: true },
    useGPU: Boolean,
    type: String,
    multilabel: Boolean,
    id: String,
    url: String,
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    // driftMetrics: [String],
    plotCfg: {
      type: Object,
      binary: { type: Object, ClassificationTypeSchema },
      multiClass: { type: Object, ClassificationTypeSchema },
      multiLabel: { type: Object, ClassificationTypeSchema },
      advancedOpt: { type: Object, AdvancedOptSchema },
      limeReport: Boolean,
      hpt: Boolean,
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model('algorithms', AlgorithmSchema);
