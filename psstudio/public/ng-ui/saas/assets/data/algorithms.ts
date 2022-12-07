/* plotCfg is the dictionary having all info related to graphs, metrics.
Example: for regression,
plotCfg: {
  limeReport: true,
  advancedOpt: {
    featureCoeff: true,
    decisionTreeGraph: false,
    advancedAlgo: true,
  }
},
If limeReport is false, it means it is not suported and removed from UI
Same for other keys as well

We have removed regression line key from plotCfg as it is true (supported) for all models. 

If all three keys under advanceOpt are false, that option needs to be disabled.
For models not supporting advancedOpt, we have put false for all keys under that.
If anyone key is true, we need to show advanceOpt option in UI.

For classification,
For each model, we have 3 types under plotCfg; binary, multiclass, multilabel
plotCfg: {
  binary: {
    ...
  },
  multiClass: {
    ...
  },
  multiLabel: {
    ...
  },
}
Based on features supported by these types, we have added true/false.
If a feature key value is true for binary and false for multiclass & multilabel, then it means that 
feature is supported only for binary and not by others

featureImp: tree based models support this, but others don't, so false for all as of now
*/

export const ALGORITHMS_ARRAY: Array<any> = [
  {
    name: 'Linear Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '1simple_linear_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Polynomial Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '2polynomial_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: false,
      },
    },
  },
  {
    name: 'Decision Tree Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '4decision_tree_regression',
    url: 'https://scikit-learn.org/stable/auto_examples/tree/plot_tree_regression.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: true,
        decisionTreeGraph: true,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Random Forest Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '5random_forest_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: true,
        decisionTreeGraph: true,
        advancedAlgo: true,
      },
    },
  },
  // {
  //   name: "SGD Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "6sgd_egression",
  //   url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDRegressor.html",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: true,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: true,
  //     }
  //   },
  // },
  {
    name: 'Ridge Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '7ridge_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Lasso Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '8lasso_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'ElasticNet Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '9elastic_net_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Passive Aggressive Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '10passive_aggressive_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PassiveAggressiveRegressor.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  // {
  //   name: "ARD Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "12ard_regression",
  //   url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ARDRegression.html",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: true,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: true,
  //     }
  //   },
  // },
  // {
  //   name: "MLP Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "13mlp_regression",
  //   url: "https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPRegressor.html",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: false,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: true,
  //     }
  //   },
  // },
  // {
  //   name: "Kernel Ridge Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "14kernel_ridge_regression",
  //   url: "https://scikit-learn.org/stable/modules/generated/sklearn.kernel_ridge.KernelRidge.html",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: false,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: true,
  //     }
  //   },
  // },
  // {
  //   name: "nuSV Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "15nusv_regression",
  //   url: "https://scikit-learn.org/stable/modules/generated/sklearn.svm.NuSVC.html",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: false,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: true,
  //     }
  //   },
  // },
  {
    name: 'LassoLARS Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '16lasso_lars_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LassoLars.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Ridge CV Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '17ridge_cv_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RidgeCV.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Bayesian Ridge Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '18bayesian_ridge_regression',
    url: 'https://scikit-learn.org/stable/auto_examples/linear_model/plot_bayesian_ridge.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: true,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  // {
  //   name: "TheilSen Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "19theil_sen_regression",
  //   url: "https://scikit-learn.org/stable/auto_examples/linear_model/plot_theilsen.html",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: true,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: true,
  //     }
  //   },
  // },
  {
    name: 'KNN Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '20knn_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html',
    plotCfg: {
      //Config of all plots, metrices and reports generated. Have not mentioned for those which are true/false for all classifiers
      binary: {
        // for binary classifier
        rocAucScore: true, //ideally for binary classifiers but can be implemented for multiclass and multlabel with predict_proba method
        liftGain: true, //supported only for binary classifiers with predict_proba method
        prCurve: true, //supported for all classifiers with predict_proba method
        limeReport: true, //supported for all classifiers with predict_proba method
        mathewsCoeff: true, //supported for binary and multiclass classifiers
        advancedOpt: {
          featureCoeff: false, // not supported for classifiers without coef_ attribute
          featureImp: false, // not supported for classifiers without feature_importances_ attribute
          decisionTreeGraph: false, //only for tree based classifiers
          advancedAlgo: false, //supports bagging but not boosting
        },
      },
      multiClass: {
        //for multiclass classifier
        rocAucScore: false, //can be implemented in later sprint
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
      multiLabel: {
        //for multilabel classifier
        rocAucScore: false, //can be implemented in later sprint
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Logistic Regression',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: false, //if false, multilabel dict not mentioned in plotCfg
    id: '22logistic_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false, // no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
    },
  },
  {
    name: 'Gaussian NB Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: false,
    id: '23gaussian_nb_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: true, //Not present in UI for ver 4.0.0
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: true, //Not present in Ui for ver 4.0.0
        },
      },
    },
  },
  {
    name: 'Decision Tree Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '24decision_tree_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, // no coef_ attribute
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: true, //not present in UI ver 4.0.0
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Random Forest Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '25random_forest_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: true, //not present in UI ver 4.0.0
          advancedAlgo: false,
        },
      },
    },
  },
  {
    //no advanced algo for multilabel
    name: 'Extra Tree Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '26extra_tree_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.tree.ExtraTreeClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: true, //not present in U ver 4.0.0
          advancedAlgo: false,
        },
      },
    },
  },
  {
    //no advanced algo multilabel
    name: 'Ensemble Extra Trees Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '27ensemble_extra_trees_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: true, //not present in UI ver 4.0.0
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'MLP Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '28mlp_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: false, //supports bagging but not boosting
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Nearest Centroid Classification',
    driftMetrics: ['accuracy', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: false,
    id: '29nearest_centroid_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.NearestCentroid.html',
    plotCfg: {
      binary: {
        rocAucScore: false, //no predict_proba method
        liftGain: false, //no predict_proba method
        prCurve: false, //no predict_proba method
        limeReport: false, //no predict_proba method
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: false, // supports bagging but not boosting due to no sample_weight
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Ridge Classification',
    driftMetrics: ['accuracy', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: false,
    id: '30ridge_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RidgeClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: false, //no predict_proba method
        liftGain: false, //no predict_proba method
        prCurve: false, //no predict_proba method
        limeReport: false, //no predict_proba method
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
    },
  },
  {
    name: 'Ridge Classification with Cross Validation',
    driftMetrics: ['accuracy', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '31ridge_classification_with_cross_validation',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RidgeClassifierCV.html',
    plotCfg: {
      binary: {
        rocAucScore: false, //no predict_proba method
        liftGain: false, //no predict_proba method
        prCurve: false, //no predict_proba method
        limeReport: false, //no predict_proba method
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Logistic Regression with Cross Validation',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: false,
    id: '32logistic_regression_with_cross_validation',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegressionCV.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
    },
  },
  {
    name: 'Passive Aggressive Classification',
    driftMetrics: ['accuracy', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: false,
    id: '33passive_aggressive_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PassiveAggressiveClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: false, //no predict_proba method
        liftGain: false, //no predict_proba method
        prCurve: false, //no predict_proba method
        limeReport: false, //no predict_proba method
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true,
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: false, // supports bagging but not boosting due to no sample_weight
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: true, //Not present in UI for ver 4.0.0
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  // {
  //   name: "Artificial Neural Network Classification",
  //   driftMetrics: ["accuracy", "roc", "f1_score", "log_loss_error"],
  //   useGPU: false,
  //   type: "classification",
  //   multilabel: false,
  //   id: "34artificial_neural_network_classification",
  //   url: "https://www.tensorflow.org/api_docs/python/tf/keras/wrappers/scikit_learn/KerasClassifier",
  //   plotCfg: {
  //     binary: {
  //       rocAucScore: true,
  //       liftGain: true,
  //       prCurve: true,
  //       limeReport: true,
  //       mathewsCoeff: true,
  //       advancedOpt: {
  //         featureCoeff: false, //no coef_ attribute
  //         featureImp: false, //no feature_importances_ attribute
  //         decisionTreeGraph: false,
  //         advancedAlgo: false,
  //       }
  //     },
  //     multiClass: {
  //       rocAucScore: false,
  //       liftGain: false,
  //       prCurve: true,
  //       limeReport: true,
  //       mathewsCoeff: true,
  //       advancedOpt: {
  //         featureCoeff: false,
  //         featureImp: false,
  //         decisionTreeGraph: false,
  //         advancedAlgo: false,
  //       }
  //     }
  //   },
  // },
  // {
  //   name: "Artificial Neural Network Regression",
  //   useGPU: false,
  //   type: "regression",
  //   multilabel: false,
  //   id: "35artificial_neural_network_regression",
  //   url: "https://www.tensorflow.org/api_docs/python/tf/keras/wrappers/scikit_learn/KerasRegressor",
  //   plotCfg: {
  //     limeReport: true,
  //     advancedOpt: {
  //       featureCoeff: false,
  //       featureImp: false,
  //       decisionTreeGraph: false,
  //       advancedAlgo: false,
  //     }
  //   },
  // },
  {
    name: 'XGBoost Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '36xgboost_classification',
    url: 'https://xgboost.readthedocs.io/en/latest/python/python_api.html',
    // no advnced opt for multilabel present
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: true, //not present in UI ver 4.0.0
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'XGBoost Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '37xgboost_regression',
    url: 'https://xgboost.readthedocs.io/en/latest/python/python_api.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: true,
        decisionTreeGraph: true,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'LightGBM Classification',
    driftMetrics: ['accuracy', 'roc', 'f1_score', 'log_loss_error'],
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '38lightgbm_classification',
    url: 'https://lightgbm.readthedocs.io/en/latest/Python-Intro.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: true,
          decisionTreeGraph: true,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'LightGBM Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '39lightgbm_regression',
    url: 'https://lightgbm.readthedocs.io/en/latest/Python-Intro.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: true,
        decisionTreeGraph: true,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Sarimax',
    useGPU: false,
    type: 'timeseries',
    multilabel: false,
    id: '40sarimax_timeseries',
    url: 'https://www.statsmodels.org/dev/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html',
    plotCfg: {
      hpt: true,
    },
  },
  {
    name: 'Prophet',
    useGPU: false,
    type: 'timeseries',
    multilabel: false,
    id: '43prophet_timeseries',
    url: 'https://facebook.github.io/prophet/docs/quick_start.html',
    plotCfg: {
      hpt: false,
    },
  },
  {
    name: 'KMeans',
    useGPU: false,
    type: 'clustering',
    multilabel: false,
    id: '43kmeans_clustering',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html',
  },
  {
    name: 'DBSCAN',
    useGPU: false,
    type: 'clustering',
    multilabel: false,
    id: '45dbscan_clustering',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html',
  },
  {
    name: 'Agglomerative',
    useGPU: false,
    type: 'clustering',
    multilabel: false,
    id: '44agglomerative_clustering',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html',
  },
  {
    name: 'CUML_Logistic Regression',
    useGPU: true,
    type: 'classification',
    multilabel: false,
    id: '46cuml_logistic_regression',
    url: 'https://rapidsai.github.io/projects/cuml/en/0.12.0/api.html#logistic-regression',
  },
  {
    name: 'CUML_Linear Regression',
    useGPU: true,
    type: 'regression',
    multilabel: false,
    id: '47cuml_linear_regression',
    url: 'https://rapidsai.github.io/projects/cuml/en/0.12.0/api.html#linear-regression',
  },
  {
    name: 'CUML_Random Forest Regression',
    useGPU: true,
    type: 'regression',
    multilabel: false,
    id: '48random_forest_regression',
    url: 'https://rapidsai.github.io/projects/cuml/en/0.12.0/api.html#random-forest',
  },
  {
    name: 'CUML_Random Forest Classification',
    useGPU: true,
    type: 'classification',
    multilabel: false,
    id: '49random_forest_regression',
    url: 'https://rapidsai.github.io/projects/cuml/en/0.12.0/api.html#random-forest',
  },
  {
    name: 'CUML_ARIMA',
    useGPU: true,
    type: 'timeseries',
    multilabel: false,
    id: '50arima_timeseries',
    url: 'https://docs.rapids.ai/api/cuml/stable/api.html#arima',
  },
  {
    name: 'CUML_KMeans',
    useGPU: true,
    type: 'clustering',
    multilabel: false,
    id: '51kmeans_clustering',
    url: 'https://docs.rapids.ai/api/cuml/stable/api.html#k-means-clustering',
  },
  {
    name: 'Rapids_XGBoost Classification',
    useGPU: true,
    type: 'classification',
    multilabel: false,
    id: '52xgboost_classification',
    url: 'https://xgboost.readthedocs.io/en/latest/python/python_api.html',
  },
  {
    name: 'Rapids_XGBoost Regression',
    useGPU: true,
    type: 'regression',
    multilabel: false,
    id: '53xgboost_regression',
    url: 'https://xgboost.readthedocs.io/en/latest/python/python_api.html',
  },
  {
    name: 'SVM Classification',
    useGPU: false,
    type: 'classification',
    multilabel: true,
    id: '21svm_classification',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html',
    plotCfg: {
      binary: {
        rocAucScore: false, //no predict_proba method
        liftGain: false, //no predict_proba method
        prCurve: false, //no predict_proba method(in scikit-learn=0.22.2)
        limeReport: false, //no predict_proba method
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false, //no coef_ attribute
          featureImp: false, //no feature_importances_ attribute
          decisionTreeGraph: false,
          advancedAlgo: true, // Not present in UI for ver 4.0.0 and works when parameter algorithm set to SAMME
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: true,
        },
      },
      multiLabel: {
        rocAucScore: false,
        liftGain: false,
        prCurve: false,
        limeReport: false,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'SVM Regression',
    useGPU: false,
    type: 'regression',
    multilabel: false,
    id: '3sv_regression',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: true,
      },
    },
  },
  {
    name: 'Bagging Classifier',
    // useGPU: false,
    // type: "classification",
    // multilabel: false,
    id: '54bagging_classifier',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.BaggingClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
      multiLabel: {
        //multilabel not supported for bagging
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Bagging Regressor',
    // useGPU: false,
    // type: "regression",
    // multilabel: false,
    id: '55bagging_regressor',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.BaggingRegressor.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: false,
      },
    },
  },
  {
    name: 'Boosting Classifier',
    // useGPU: false,
    // type: "classification",
    // multilabel: false,
    id: '56boosting_classifier',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostClassifier.html',
    plotCfg: {
      binary: {
        rocAucScore: true,
        liftGain: true,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
      multiClass: {
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: true,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
      multiLabel: {
        //multilabel not supported for boosting
        rocAucScore: false,
        liftGain: false,
        prCurve: true,
        limeReport: true,
        mathewsCoeff: false,
        advancedOpt: {
          featureCoeff: false,
          featureImp: false,
          decisionTreeGraph: false,
          advancedAlgo: false,
        },
      },
    },
  },
  {
    name: 'Boosting Regressor',
    // useGPU: false,
    // type: "regression",
    // multilabel: false,
    id: '57boosting_regressor',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.AdaBoostRegressor.html',
    plotCfg: {
      limeReport: true,
      advancedOpt: {
        featureCoeff: false,
        featureImp: false,
        decisionTreeGraph: false,
        advancedAlgo: false,
      },
    },
  },
];
