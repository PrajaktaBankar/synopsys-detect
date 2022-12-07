/**
 * Exports all the form fields array for generating dynamic form
 */
export const HPT_FORM_FIELDS: Array<any> = [
  {
    algoName: 'Rapids_XGBoost Classification',
    fields: [
      {
        type: 'number',
        name: 'eta',
        label: 'eta',
        required: false,
        bo_data: '0,1',
        data: 0.3,
        gs_data: '0.3,0.5,0.7',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'gamma',
        label: 'gamma',
        required: false,
        bo_data: '0.0,1.0',//'0.0,9.0',
        data: 0,
        gs_data: '0.5,1,1.5',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 6,
        gs_data: '3,4,5,6,7',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'min_child_weight',
        label: 'min_child_weight',
        required: false,
        bo_data: '1,8',
        data: 1,
        gs_data: '1,4,8',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'max_delta_step',
        label: 'max_delta_step',
        required: false,
        bo_data: '0,8',
        data: 0,
        gs_data: '0,4,8',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'subsample',
        label: 'subsample',
        required: false,
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'radio',
        name: 'sampling_method',
        label: 'sampling_method',
        required: true,
        data: true,
        radio_btns: [
          { radio_label: 'uniform', value: true },
          { radio_label: 'gradient_based', value: false },
        ],
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'colsample_bytree',
        label: 'colsample_bytree',
        required: false,
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'colsample_bylevel',
        label: 'colsample_bylevel',
        required: false,
        bo_data: '0.0, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'colsample_bynode',
        label: 'colsample_bynode',
        required: false,
        bo_data: '0.0, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'lambda',
        label: 'lambda',
        required: false,
        data: 1,
        gs_data: '1,2',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.1,5.0',//'0.1,9.0',
        data: 0,
        gs_data: '0,1,2',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'scale_pos_weight',
        label: 'scale_pos_weight',
        required: false,
        bo_data: '0.1,5.0',//'0.1,9.0',
        data: 1,
        gs_data: '0,1,2',
        validators: {
          "required": false,
        }
      },

      {
        type: 'radio',
        name: 'tree_method',
        label: 'tree_method',
        required: false,
        data: true,
        radio_btns: [{ radio_label: 'gpu_hist', value: true }],
        validators: {
          "required": false,
        }
      },

      {
        type: 'radio',
        name: 'silent',
        label: 'silent',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false,
        }
      },
      {
        type: 'radio',
        name: 'grow_policy',
        label: 'grow_policy',
        required: true,
        data: true,
        radio_btns: [
          { radio_label: 'lossguide', value: true },
          { radio_label: 'depthwise', value: false },
        ],
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'max_leaves',
        label: 'max_leaves',
        required: false,
        bo_data: '0,256',
        data: 0,
        gs_data: '0,16,64,256',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'n_gpus',
        label: 'n_gpus',
        required: false,
        bo_data: '1',
        data: 1,
        gs_data: '1',
        validators: {
          "required": false,
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Rapids_XGBoost Regression',
    fields: [
      {
        type: 'number',
        name: 'eta',
        label: 'eta',
        required: false,
        bo_data: '0,1',
        data: 0.3,
        gs_data: '0.3,0.5,0.7',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'gamma',
        label: 'gamma',
        required: false,
        bo_data: '0.0,1.0',//'0.0,9.0',
        data: 0,
        gs_data: '0.5,1,1.5',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 6,
        gs_data: '3,4,5,6,7',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'min_child_weight',
        label: 'min_child_weight',
        required: false,
        bo_data: '1,8',
        data: 1,
        gs_data: '1,4,8',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'max_delta_step',
        label: 'max_delta_step',
        required: false,
        bo_data: '0,8',
        data: 0,
        gs_data: '0,4,8',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'subsample',
        label: 'subsample',
        required: false,
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'radio',
        name: 'sampling_method',
        label: 'sampling_method',
        required: true,
        data: true,
        radio_btns: [
          { radio_label: 'uniform', value: true },
          { radio_label: 'gradient_based', value: false },
        ],
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'colsample_bytree',
        label: 'colsample_bytree',
        required: false,
        bo_data: '0.0, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'colsample_bylevel',
        label: 'colsample_bylevel',
        required: false,
        bo_data: '0.0, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'colsample_bynode',
        label: 'colsample_bynode',
        required: false,
        bo_data: '0.0, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'lambda',
        label: 'lambda',
        required: false,
        data: 1,
        gs_data: '1,2',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.1,5.0',//'0.1,9.0',
        data: 0,
        gs_data: '0,1,2',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'scale_pos_weight',
        label: 'scale_pos_weight',
        required: false,
        bo_data: '0.1,5.0',//'0.1,9.0',
        data: 1,
        gs_data: '0,1,2',
        validators: {
          "required": false,
        }
      },
      {
        type: 'radio',
        name: 'tree_method',
        label: 'tree_method',
        required: false,
        data: true,
        radio_btns: [{ radio_label: 'gpu_hist', value: true }],
        validators: {
          "required": false,
        }
      },
      {
        type: 'radio',
        name: 'silent',
        label: 'silent',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false,
        }
      },
      {
        type: 'radio',
        name: 'grow_policy',
        label: 'grow_policy',
        required: true,
        data: true,
        radio_btns: [
          { radio_label: 'lossguide', value: true },
          { radio_label: 'depthwise', value: false },
        ],
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'max_leaves',
        label: 'max_leaves',
        required: false,
        bo_data: '0,256',
        data: 0,
        gs_data: '0,16,64,256',
        validators: {
          "required": false,
        }
      },
      {
        type: 'number',
        name: 'n_gpus',
        label: 'n_gpus',
        required: false,
        bo_data: '1',
        data: 1,
        gs_data: '1',
        validators: {
          "required": false,
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'CUML_ARIMA',
    fields: [
      {
        type: 'text',
        name: 'order',
        label: 'order(p,d,q)',
        placeholder_text: '',
        required: false,
        data: '1,1,1',
        gs_data: '',
        validators: {
          "required": false,
        }
      },
      {
        type: 'text',
        name: 'seasonal_order',
        label: 'seasonal order(P,D,Q,s)',
        placeholder_text: '',
        required: false,
        data: '0,0,0,0',
        gs_data: '',
        validators: {
          "required": false,

        }
      },
      {
        type: 'radio',
        name: 'fit_intercept',
        label: 'fit_intercept',
        required: false,
        data: null,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false, None: null },
        ],
        validators: {
          "required": false,
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'CUML_Random Forest Regression',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '100,200',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'accuracy_metric',
        label: 'accuracy_metric',
        required: false,
        data: 'mean_ae',
        radio_btns: [
          { radio_label: 'mse', value: 'mse' },
          { radio_label: 'median_ae', value: 'median_ae' },
          { radio_label: 'mean_ae', value: 'mean_ae' },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 'auto',
        gs_data: 'auto,sqrt,log2',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,16',
        data: 16,
        gs_data: '3,6,9,12,16',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'n_bins',
        label: 'n_bins',
        required: false,
        bo_data: '2,16',
        data: 16,
        gs_data: '2,8,16',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'min_rows_per_node',
        label: 'min_rows_per_node',
        required: false,
        bo_data: '2,8',
        data: 2,
        gs_data: '2,4,8',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        bo_data: '0.02,0.2',
        data: 0,
        gs_data: '0,0.1,0.2',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'max_leaves',
        label: 'max_leaves',
        required: false,
        bo_data: '-1, 8',
        data: -1,
        gs_data: '-1,2,4,8',
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'split_algo',
        label: 'split_algo',
        required: false,
        data: 1,
        radio_btns: [
          { radio_label: 'HIST', value: 0 },
          { radio_label: 'GLOBAL_QUANTILE', value: 1 },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'split_criterion',
        label: 'split_criterion',
        required: false,
        data: 2,
        radio_btns: [
          { radio_label: 'MSE', value: 2 },
          { radio_label: 'MAE', value: 3 },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'bootstrap',
        label: 'bootstrap',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'bootstrap_features',
        label: 'bootstrap_features',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'quantile_per_tree',
        label: 'quantile_per_tree',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'CUML_Random Forest Classification',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '100,200',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": false
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 'auto',
        gs_data: 'auto,sqrt,log2',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,16',
        data: 16,
        gs_data: '3,6,9,12,16',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'n_bins',
        label: 'n_bins',
        required: false,
        bo_data: '2,16',
        data: 16,
        gs_data: '2,8,16',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'min_rows_per_node',
        label: 'min_rows_per_node',
        required: false,
        bo_data: '2,8',
        data: 2,
        gs_data: '2,4,8',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        bo_data: '0.02,0.2',
        data: 0,
        gs_data: '0,0.1,0.2',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'max_leaves',
        label: 'max_leaves',
        required: false,
        bo_data: '-1, 8',
        data: -1,
        gs_data: '-1,2,4,8',
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'split_algo',
        label: 'split_algo',
        required: false,
        data: 1,
        radio_btns: [
          { radio_label: 'HIST', value: 0 },
          { radio_label: 'GLOBAL_QUANTILE', value: 1 },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'split_criterion',
        label: 'split_criterion',
        required: false,
        data: 0,
        radio_btns: [
          { radio_label: 'GINI', value: 0 },
          { radio_label: 'ENTROPY', value: 1 },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'bootstrap',
        label: 'bootstrap',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'bootstrap_features',
        label: 'bootstrap_features',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'quantile_per_tree',
        label: 'quantile_per_tree',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'CUML_Linear Regression',
    fields: [
      {
        type: 'text',
        name: 'algorithm',
        label: 'algorithm',
        required: false,
        data: 'eig',
        gs_data: 'eig,svd',
        validators: {
          "required": false
        }
      },
      {
        type: 'radio',
        name: 'fit_intercept',
        label: 'fit_intercept',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'CUML_Logistic Regression',
    fields: [
      {
        type: 'text',
        name: 'penalty',
        label: 'penalty',
        required: false,
        data: 'l2',
        gs_data: 'none,l1,l2,elasticnet',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.01,1',
        data: 0.0001,
        gs_data: '0.01,0.001,0.0001',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        bo_data: '1,5',//'1,20',
        data: 1.0,
        gs_data: '1.0,10.0,100.0',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '500,1000',
        data: 1000,
        gs_data: '500, 750, 1000',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'linesearch_max_iter',
        label: 'linesearch_max_iter',
        required: false,
        bo_data: '1,50',
        data: 50,
        gs_data: '10,20,50',
        validators: {
          "required": false
        }
      },
      {
        type: 'number',
        name: 'l1_ratio',
        label: 'l1_ratio',
        required: false,
        bo_data: '0,1',
        data: null,
        gs_data: 'null,0.1,0.5,1.0',
        validators: {
          "required": false
        }
      },
      {
        type: 'text',
        name: 'solver',
        label: 'solver',
        required: false,
        data: 'qn',
        gs_data: 'qn,lbfgs,owl',
        validators: {
          "required": false
        }
      },

      {
        type: 'radio',
        name: 'fit_intercept',
        label: 'fit_intercept',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": false
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'Linear Regression',
    fields: [
      //       {
      //         type: "radio",
      //         name: "fit_intercept",
      //         label: "fit_intercept",
      //         required: false,
      //         data: true,
      //         radio_btns: [
      //           { radio_label: "true", value: true },
      //           { radio_label: "false", value: false },
      //         ],
      //       },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'positive',
        label: 'positive',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
    ],
    isBOSupported: false,
    isGridSearchSupported: false,
  },
  {
    algoName: 'Polynomial Regression',
    fields: [
      {
        type: 'number',
        name: 'degree',
        label: 'degree',
        required: false,
        bo_data: '2,3', //'2,5',
        data: 2,
        gs_data: '2,3', //'2,3,4',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'interaction_only',
        label: 'interaction_only',
        required: true,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'radio',
        name: 'include_bias',
        label: 'include_bias',
        required: true,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'SV Regression',
    fields: [
      { type: 'number', name: 'C', label: 'C', required: false, data: 1.0 },
      {
        type: 'number',
        name: 'epsilon',
        label: 'epsilon',
        required: false,
        data: 0.1,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'kernel',
        label: 'kernel',
        required: true,
        data: 'rbf',
        select_options: [
          { option_label: 'rbf', value: 'rbf' },
          { option_label: 'linear', value: 'linear' },
          { option_label: 'poly', value: 'poly' },
          { option_label: 'sigmoid', value: 'sigmoid' },
        ],
        placeholder_text: 'Select kernal',
        sub_ui_elemets: [
          {
            type: 'text',
            name: 'gamma',
            label: 'gamma',
            required: false,
            display_if: 'rbf',
            data: 5,
            display_for: ['rbf', 'poly', 'sigmoid'],
          },
        ],
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+|[0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'degree',
        label: 'degree',
        required: false,
        data: 3,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'coef0',
        label: 'coef0',
        required: false,
        data: 0.0,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'radio',
        name: 'shrinking',
        label: 'shrinking',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number', name: 'tol', label: 'tol', required: false, data: 0.0, validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'cache_size',
        label: 'cache_size',
        required: false,
        data: 0,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        data: -1,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Decision Tree Regression',
    fields: [
      {
        type: 'select',
        name: 'criterion',
        label: 'criterion',
        required: false,
        data: 'squared_error',
        gs_data: ['squared_error', 'friedman_mse', 'absolute_error'],
        select_options: [
          { option_label: 'squared_error', value: 'squared_error' },
          { option_label: 'friedman_mse', value: 'friedman_mse' },
          { option_label: 'absolute_error', value: 'absolute_error' },
          { option_label: 'poisson', value: 'poisson' },
        ],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(,[a-zA-Z]+(_[a-zA-Z]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'splitter',
        label: 'splitter',
        required: true,
        data: 'best',
        gs_data: ['best', 'random'],
        select_options: [
          { option_label: 'best', value: 'best' },
          { option_label: 'random', value: 'random' },
        ],
        placeholder_text: 'Select splitter',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        data: 'None',
        placeholder_text: 'Some value',
        gs_data: '1.0,2.0',//'1.0,2.0,3.0,4.0,5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_split',
        label: 'min_samples_split',
        required: false,
        bo_data: '0.1,0.2',//'0.1,0.5',
        data: 2,
        gs_data: '0.1,0.2', //'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_leaf',
        label: 'min_samples_leaf',
        required: false,
        bo_data: '0.1,0.2',//'0.1,0.5',
        data: 1,
        gs_data: '0.1,0.2',//'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_weight_fraction_leaf',
        label: 'min_weight_fraction_leaf',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.4',
        data: 0,
        gs_data: '0,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 'None',
        gs_data: 'None,auto,sqrt,log2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_leaf_nodes',
        label: 'max_leaf_nodes',
        required: false,
        bo_data: '2,3',//'2,10',
        data: 'None',
        gs_data: 'None, 5',//'None, 5, 10, 15',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*|None(, [0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        data: 0,
        gs_data: '0,0.1',//'0,0.1,0.2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "presort",
      //   label: "presort",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Random Forest Regression',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '100,200', //'100,900',
        data: 10,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'criterion',
        label: 'criterion',
        required: true,
        data: 'squared_error',
        gs_data: ['squared_error', 'absolute_error', 'poisson'],
        select_options: [
          { option_label: 'squared_error', value: 'squared_error' },
          { option_label: 'absolute_error', value: 'absolute_error' },
          { option_label: 'poisson', value: 'poisson' },
        ],
        placeholder_text: 'Select criterion',
        validators: {
          "required": true
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 'auto',
        gs_data: 'None,auto,sqrt,log2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,4', //'3,10',
        data: 'None',
        gs_data: '1.0,2.0',//'1.0,2.0,3.0,4.0,5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_split',
        label: 'min_samples_split',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.5',
        data: 2,
        gs_data: '0.1,0.2',//'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_leaf',
        label: 'min_samples_leaf',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.5',
        data: 1,
        gs_data: '0.1,0.2', //'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_weight_fraction_leaf',
        label: 'min_weight_fraction_leaf',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.4',
        data: 0,
        gs_data: '0,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_leaf_nodes',
        label: 'max_leaf_nodes',
        required: false,
        bo_data: '5,7',//'5,15',
        data: 'None',
        gs_data: 'None,5', //'None,5,10,15',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        bo_data: '0.02,0.1', //'0.02,0.2',
        data: 0,
        gs_data: '0,0.1,0.2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "oob_score",
      //   label: "oob_score",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'KNN Classification',
    fields: [
      {
        type: 'number',
        name: 'n_neighbors',
        label: 'n_neighbors',
        required: false,
        bo_data: '3,5', //'3,10',
        data: 5,
        gs_data: '3,5,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'weights',
        label: 'weights',
        required: true,
        data: 'uniform',
        gs_data: ['uniform', 'distance'],
        select_options: [
          { option_label: 'uniform', value: 'uniform' },
          { option_label: 'distance', value: 'distance' },
        ],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'algorithm',
        label: 'algorithm',
        required: true,
        data: 'auto',
        gs_data: ['auto', 'ball_tree', 'kd_tree', 'brute'],
        select_options: [
          { option_label: 'auto', value: 'auto' },
          { option_label: 'ball_tree', value: 'ball_tree' },
          { option_label: 'kd_tree', value: 'kd_tree' },
          { option_label: 'brute', value: 'brute' },
        ],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(,[a-zA-Z]+(_[a-zA-Z]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'leaf_size',
        label: 'leaf_size',
        required: false,
        bo_data: '5,7',//'5,20',
        data: 30,
        gs_data: '25,30,35',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'p',
        label: 'p',
        required: false,
        bo_data: '1,3',//'1,5',
        data: 2,
        gs_data: '2,3,4',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'metric',
        label: 'metric',
        required: false,
        data: 'minkowski',
        gs_data: 'minkowski,euclidean,manhattan',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'SVM Classification',
    fields: [
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        bo_data: '0.1,1',//'0.1,10',
        data: '1.0',
        gs_data: '1,10',//'1,10,100',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'kernel',
        label: 'kernel',
        required: true,
        data: 'rbf',
        gs_data: ['linear', 'poly', 'rbf', 'sigmoid'],
        select_options: [
          { option_label: 'rbf', value: 'rbf' },
          { option_label: 'linear', value: 'linear' },
          { option_label: 'poly', value: 'poly' },
          { option_label: 'sigmoid', value: 'sigmoid' },
        ],
        placeholder_text: 'Select kernal',
        sub_ui_elemets: [
          {
            type: 'text',
            name: 'gamma',
            label: 'gamma',
            required: false,
            display_if: 'rbf',
            data: 5,
            display_for: ['rbf', 'poly', 'sigmoid'],
          },
        ],
        validators: {
          "required": true,
        }
      },
      {
        type: 'number',
        name: 'degree',
        label: 'degree',
        required: false,
        bo_data: '3,5', //'3,7',
        data: 3,
        gs_data: '3,5',//'3,5,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'gamma',
        label: 'gamma',
        required: false,
        data: 'scale',
        bo_data: '0.0001,0.001',//'0.0001,0.01',
        gs_data: '0.0001,0.001,0.01',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*(,[0-9]+(\.[0-9]+)*)*|[a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'coef0',
        label: 'coef0',
        required: false,
        data: '0.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        data: 0.0001,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        data: 10,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'SVM Regression',
    fields: [
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        bo_data: '0.1,1.0', //'0.1,10',
        data: '1.0',
        gs_data: '1,10',//'1,10,100',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'kernel',
        label: 'kernel',
        required: true,
        data: 'rbf',
        gs_data: ['linear', 'poly', 'rbf', 'sigmoid'],
        select_options: [
          { option_label: 'rbf', value: 'rbf' },
          { option_label: 'linear', value: 'linear' },
          { option_label: 'poly', value: 'poly' },
          { option_label: 'sigmoid', value: 'sigmoid' },
        ],
        placeholder_text: 'Select kernal',
        sub_ui_elemets: [
          {
            type: 'text',
            name: 'gamma',
            label: 'gamma',
            required: false,
            display_if: 'rbf',
            data: 5,
            display_for: ['rbf', 'poly', 'sigmoid'],
          },
        ],
        validators: {
          "required": true,
        }
      },
      {
        type: 'number',
        name: 'degree',
        label: 'degree',
        required: false,
        bo_data: '3,5',//'3,7',
        data: 3,
        gs_data: '3,5,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'gamma',
        label: 'gamma',
        required: false,
        data: 'scale',
        bo_data: '0.0001,0.001', //'0.0001,0.01',
        gs_data: '0.0001,0.001,0.01',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|[a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'coef0',
        label: 'coef0',
        required: false,
        data: '0.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        data: 0.0001,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        data: 10,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Logistic Regression',
    fields: [
      {
        type: 'text',
        name: 'penalty',
        label: 'penalty',
        required: false,
        data: 'l2',
        gs_data: 'None,l2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.01,0.1', //'0.01,1',
        data: 0.0001,
        gs_data: '0.001,0.01',//'0.01,0.001,0.0001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        bo_data: '1,3',//'1,20',
        data: 1.0,
        gs_data: '1.0,10.0', //'1.0,10.0,100.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Gaussian NB Classification',
    fields: [
      {
        type: 'text',
        name: 'priors',
        label: 'priors',
        required: false,
        data: 'None',
        gs_data: '0.1,0.9,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'Random Forest Classification',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '50,100', //'50,200',
        data: 10,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'criterion',
        label: 'criterion',
        required: true,
        data: 'gini',
        gs_data: ['gini', 'entropy'],
        select_options: [
          { option_label: 'gini', value: 'gini' },
          { option_label: 'entropy', value: 'entropy' },
        ],
        placeholder_text: 'Select criterion',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 'auto',
        gs_data: 'None,auto,sqrt,log2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '1,3',//'1,5',
        data: 'None',
        gs_data: '1.0,2.0', //'1.0, 2.0, 3.0, 4.0, 5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_split',
        label: 'min_samples_split',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.5',
        data: 2,
        gs_data: '0.1,0.2', //'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_leaf',
        label: 'min_samples_leaf',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.5',
        data: 1,
        gs_data: '0.1,0.2', //'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_weight_fraction_leaf',
        label: 'min_weight_fraction_leaf',
        required: false,
        bo_data: '0,0.2', //'0,0.5',
        data: 0,
        gs_data: '0,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_leaf_nodes',
        label: 'max_leaf_nodes',
        required: false,
        data: 'None',
        gs_data: 'None,5,10,15',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        data: 0,
        gs_data: '0,0.1', //'0,0.1,0.2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'bootstrap',
        label: 'bootstrap',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      // {
      //   type: "radio",
      //   name: "oob_score",
      //   label: "oob_score",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Decision Tree Classification',
    fields: [
      {
        type: 'select',
        name: 'criterion',
        label: 'criterion',
        required: true,
        data: 'gini',
        gs_data: ['gini', 'entropy'],
        select_options: [
          { option_label: 'gini', value: 'gini' },
          { option_label: 'entropy', value: 'entropy' },
        ],
        placeholder_text: 'Select criterion',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)*$"
        }
      },
      {
        type: 'select',
        name: 'splitter',
        label: 'splitter',
        required: true,
        data: 'best',
        gs_data: ['best', 'random'],
        select_options: [
          { option_label: 'best', value: 'best' },
          { option_label: 'random', value: 'random' },
        ],
        placeholder_text: 'Select splitter',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        data: 'None',
        gs_data: '1.0,2.0', //'1.0,2.0,3.0,4.0,5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_split',
        label: 'min_samples_split',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.5',
        data: 2,
        gs_data: '0.1,0.2', //'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_leaf',
        label: 'min_samples_leaf',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.5',
        data: 1,
        gs_data: '0.1,0.2', //'0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_weight_fraction_leaf',
        label: 'min_weight_fraction_leaf',
        required: false,
        bo_data: '0.1,0.2', //'0.1,0.4',
        data: 0,
        gs_data: '0,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 'None',
        gs_data: 'None,auto,sqrt,log2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_leaf_nodes',
        label: 'max_leaf_nodes',
        required: false,
        bo_data: '2,4', //'2,10',
        data: 'None',
        gs_data: 'None,5,10,15',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        data: 0,
        gs_data: '0,0.1,0.2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "presort",
      //   label: "presort",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'SGD Regression',
    fields: [
      {
        type: 'select',
        name: 'loss',
        label: 'loss',
        required: true,
        data: 'squared_error',
        gs_data: ['squared_error', 'huber', 'epsilon_insensitive', 'squared_epsilon_insensitive'],
        select_options: [
          { option_label: 'huber', value: 'huber' },
          { option_label: 'squared_error', value: 'squared_error' },
          { option_label: 'epsilon_insensitive', value: 'epsilon_insensitive' },
          {
            option_label: 'squared_epsilon_insensitive',
            value: 'squared_epsilon_insensitive',
          },
        ],
        placeholder_text: 'Select loss',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(,[a-zA-Z]+(_[a-zA-Z]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'penalty',
        label: 'penalty',
        required: true,
        data: 'l2',
        gs_data: ['None', 'l2', 'l1', 'elasticnet'],
        select_options: [
          { option_label: 'None', value: 'None' },
          { option_label: 'l2', value: 'l2' },
          { option_label: 'l1', value: 'l1' },
          { option_label: 'elasticnet', value: 'elasticnet' },
        ],
        placeholder_text: 'Select penalty',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.0001,0.001', //'0.0001, 1.0',
        data: 0.0001,
        gs_data: '1.0E-4, 1.0E-5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|([0-9]+(\.[0-9]+)*E-[0-9]+(\.[0-9]+)*)(, ([0-9]+(\.[0-9]+)*E-[0-9]+(\.[0-9]+)*)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'l1_ratio',
        label: 'l1_ratio',
        required: false,
        bo_data: '0.0,1.0',
        data: 0.15,
        gs_data: '0.15,0.20',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'early_stopping',
        label: 'early_stopping',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'validation_fraction',
        label: 'validation_fraction',
        required: false,
        bo_data: '0.1,0.2',//'0.1, 0.9',
        data: 0.1,
        gs_data: '0.1,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'n_iter_no_change',
        label: 'n_iter_no_change',
        required: false,
        bo_data: '2,5', //'2, 20',
        data: 5,
        gs_data: '5,10',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '3,5', //'3, 20',
        data: 1000,
        gs_data: 'None,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*|None(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        data: '1e-03',
        gs_data: 'None,0.01',
        bo_data: '0.018,0.1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'shuffle',
        label: 'shuffle',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'epsilon',
        label: 'epsilon',
        required: false,
        data: 0.1,
        gs_data: '0.1,0.01',
        bo_data: '0.1,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'learning_rate',
        label: 'learning_rate',
        required: true,
        data: 'invscaling',
        gs_data: ['constant', 'optimal', 'invscaling', 'adaptive'],
        select_options: [
          { option_label: 'constant', value: 'constant' },
          { option_label: 'optimal', value: 'optimal' },
          { option_label: 'invscaling', value: 'invscaling' },
        ],
        placeholder_text: 'Select solver',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'eta0',
        label: 'eta0',
        required: false,
        data: 0.01,
        gs_data: '0.001,0.01', //'0.01,0.001',
        bo_data: '0.01,0.1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "number",
      //   name: "power_t",
      //   label: "power_t",
      //   required: false,
      //   data: 0.25,
      //   gs_data: "0.25,0.50",
      // },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'average',
        label: 'average',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      // {
      //   type: "text",
      //   name: "n_iter",
      //   label: "n_iter",
      //   required: false,
      //   data: "None",
      //   gs_data: "None,10",
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Ridge Regression',
    fields: [
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.0,1.0',
        data: 1.0,
        gs_data: '1,3,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '3,5', //'3,20',
        data: 1000,
        gs_data: 'None,5,10',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,1.0',
        data: 0.001,
        gs_data: '0.001,0.01',//'0.1,0.01,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'solver',
        label: 'solver',
        required: true,
        data: 'auto',
        gs_data: ['auto', 'svd', 'cholesky', 'lsqr', 'sparse_cg', 'sag', 'saga'],
        select_options: [
          { option_label: 'auto', value: 'auto' },
          { option_label: 'svd', value: 'svd' },
          { option_label: 'cholesky', value: 'cholesky' },
          { option_label: 'lsqr', value: 'lsqr' },
          { option_label: 'sparse_cg', value: 'sparse_cg' },
          { option_label: 'sag', value: 'sag' },
          { option_label: 'saga', value: 'saga' },
        ],
        placeholder_text: 'Select solver',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(,[a-zA-Z]+(_[a-zA-Z]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Lasso Regression',
    fields: [
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.0,1.0',//'0.0,2.0',
        data: 1.0,
        gs_data: '1,3,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "precompute",
      //   label: "precompute",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 100,
        gs_data: '100,500,1000',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,1.0',//'0.0,2.0',
        data: 0.0001,
        gs_data: '0.001,0.01',//'0.1,0.01,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'positive',
        label: 'positive',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'select',
        name: 'selection',
        label: 'selection',
        required: true,
        data: 'cyclic',
        gs_data: ['cyclic', 'random'],
        select_options: [
          { option_label: 'cyclic', value: 'cyclic' },
          { option_label: 'random', value: 'random' },
        ],
        placeholder_text: 'Select selection',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'ElasticNet Regression',
    fields: [
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.0,1.0',//'0.0,2.0',
        data: 1.0,
        gs_data: '1,3,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'l1_ratio',
        label: 'l1_ratio',
        required: false,
        bo_data: '0.0,1.0',//'0.0,5.0',
        data: 0.5,
        gs_data: '0.1,0.2',//'0.1,0.2,0.3',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "precompute",
      //   label: "precompute",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 1000,
        gs_data: '100,500,1000',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,1.0',//'0.0,2.0',
        data: 0.0001,
        gs_data: '0.001,0.01',//'0.001,0.0001,0.00001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'positive',
        label: 'positive',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'text',
        name: 'selection',
        label: 'selection',
        required: false,
        data: 'cyclic',
        gs_data: 'cyclic,random',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Passive Aggressive Regression',
    fields: [
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        data: 1.0,
        gs_data: '0.01,0.1',//'0.01,0.1,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '100,200',//'100,500',
        data: '1000',
        gs_data: '100,500,1000',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,1.0',//'0.0,5.0',
        data: 0.001,
        gs_data: '1e-3,1e-4,1e-5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'shuffle',
        label: 'shuffle',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'select',
        name: 'loss',
        label: 'loss',
        required: true,
        data: 'epsilon_insensitive',
        gs_data: ['epsilon_insensitive', 'squared_epsilon_insensitive'],
        select_options: [
          { option_label: 'epsilon_insensitive', value: 'epsilon_insensitive' },
          {
            option_label: 'squared_epsilon_insensitive',
            value: 'squared_epsilon_insensitive',
          },
        ],
        placeholder_text: 'Select loss',
        validators: {
          "required": true,
          // "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(_[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'epsilon',
        label: 'epsilon',
        required: false,
        data: 0.1,
        gs_data: '0.01,0.1',//'0.1,0.01,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'average',
        label: 'average',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      // {
      //   type: "number",
      //   name: "n_iter",
      //   label: "n_iter",
      //   required: false,
      //   bo_data: "2,20",
      //   data: 0.21,
      //   gs_data: "None,10,20",
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Huber Regression',
    fields: [
      {
        type: 'number',
        name: 'epsilon',
        label: 'epsilon',
        required: false,
        data: 1.35,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        data: 100,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        data: 0.0001,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'radio',
        name: 'warm_start',
        label: 'warm_start',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'radio',
        name: 'fit_intercept',
        label: 'fit_intercept',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        data: 0.006,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'ARD Regression',
    fields: [
      {
        type: 'number',
        name: 'n_iter',
        label: 'n_iter',
        required: false,
        bo_data: '100,200', //'100,500',
        data: 300,
        gs_data: '100,300',//'100,300,500',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0001,0.001',//'0.0001,0.1',
        data: 0.049,
        gs_data: '0.001,0.01',//'0.01,0.001,0.0001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'alpha_1',
        label: 'alpha_1',
        required: false,
        bo_data: '0.0,0.1',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'alpha_2',
        label: 'alpha_2',
        required: false,
        bo_data: '0.0,0.1',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'lambda_1',
        label: 'lambda_1',
        required: false,
        bo_data: '0.0,0.1',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'lambda_2',
        label: 'lambda_2',
        required: false,
        bo_data: '0.0,0.1',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'threshold_lambda',
        label: 'threshold_lambda',
        required: false,
        bo_data: '1000.0,10000.0',//'1000.0,100000.0',
        data: '10000.0',
        gs_data: '1000.0,10000.0,100000.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 10000,
          "entMax": 10000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "compute_score",
      //   label: "compute_score",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'MLP Regression',
    fields: [
      {
        type: 'text',
        name: 'hidden_layer_sizes',
        label: 'hidden_layer_sizes',
        required: false,
        bo_data: '50,150',//'50,200',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'activation',
        label: 'activation',
        required: true,
        data: 'relu',
        gs_data: ['identity', 'logistic', 'tanh', 'relu'],
        select_options: [
          { option_label: 'identity', value: 'identity' },
          { option_label: 'logistic', value: 'logistic' },
          { option_label: 'tanh', value: 'tanh' },
          { option_label: 'relu', value: 'relu' },
        ],
        placeholder_text: 'Select activation',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'learning_rate',
        label: 'learning_rate',
        required: true,
        data: 'constant',
        gs_data: ['constant', 'invscaling', 'adaptive'],
        select_options: [
          { option_label: 'constant', value: 'constant' },
          { option_label: 'invscaling', value: 'invscaling' },
          { option_label: 'adaptive', value: 'adaptive' },
        ],
        placeholder_text: 'Select learning_rate',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'solver',
        label: 'solver',
        required: true,
        data: 'adam',
        gs_data: ['lbfgs', 'adam'],
        select_options: [
          { option_label: 'lbfgs', value: 'lbfgs' },
          { option_label: 'sgd', value: 'sgd' },
          { option_label: 'adam', value: 'adam' },
        ],
        placeholder_text: 'Select solver',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'beta_1',
        label: 'beta_1',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.9,
        gs_data: '0.9,0.99',//'0.9,0.99,0.999',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'beta_2',
        label: 'beta_2',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.999,
        gs_data: '0.9,0.999',//'0.9,0.99,0.999',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'epsilon',
        label: 'epsilon',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: '1e-08',
        gs_data: '1e-07,1e-08,1e-09',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.0001,
        gs_data: '0.0001,0.001',//'0.001,0.0001,0.00001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate_init',
        label: 'learning_rate_init',
        required: false,
        bo_data: '0.0,1.0',
        data: 0.001,
        gs_data: '0.01,0.001,0.0001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "number",
      //   name: "power_t",
      //   label: "power_t",
      //   required: false,
      //   bo_data: "0.0,1.0",
      //   data: 0.5,
      //   gs_data: "0.3,0.5,0.7",
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '200,300',
        data: 200,
        gs_data: '100,200',//'100,200,500',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'radio',
        name: 'shuffle',
        label: 'shuffle',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,0.9',
        data: '0.0001',
        gs_data: '0.0001,0.001',//'0.001,0.0001,0.00001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'momentum',
        label: 'momentum',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.9,
        gs_data: '0.5,0.7',//'0.5,0.7,0.9',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "nesterovs_momentum",
      //   label: "nesterovs_momentum",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'early_stopping',
        label: 'early_stopping',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'validation_fraction',
        label: 'validation_fraction',
        required: false,
        bo_data: '0.0,0.9',
        data: 0.1,
        gs_data: '0.1,0.2',//'0.1,0.2,0.3',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Kernel Ridge Regression',
    fields: [
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '1.0,2.0',//'1.0,5.0',
        data: 1,
        gs_data: '1,3',//'1,3,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'kernel',
        label: 'kernel',
        required: true,
        data: 'linear',
        gs_data: ['linear', 'poly', 'rbf', 'sigmoid'],
        select_options: [
          { option_label: 'linear', value: 'linear' },
          { option_label: 'poly', value: 'poly' },
          { option_label: 'rbf', value: 'rbf' },
          { option_label: 'sigmoid', value: 'sigmoid' },
        ],
        placeholder_text: 'Select kernel',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'gamma',
        label: 'gamma',
        required: false,
        bo_data: '0.01,0.1',
        data: 'None',
        gs_data: 'None,0.1,0.01',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'degree',
        label: 'degree',
        required: false,
        bo_data: '3,5',//'3,7',
        data: 3,
        gs_data: '3,5',//'3,5,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'coef0',
        label: 'coef0',
        required: false,
        bo_data: '0.1,2.0',
        data: 1,
        gs_data: '0.1,0,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'LassoLARS Regression',
    fields: [
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '1.0,2.0',//'1.0,5.0',
        data: 1.0,
        gs_data: '1.0,3.0,5.0',//'1.0,3.0,5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "select",
      //   name: "precompute",
      //   label: "precompute",
      //   required: true,
      //   data: "auto",
      //   gs_data: ["auto", true, false],
      //   select_options: [
      //     { option_label: "auto", value: "auto" },
      //     { option_label: "True", value: true },
      //     { option_label: "False", value: false },
      //   ],
      //   placeholder_text: "Select precompute",
      // },
      {
        type: 'text',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '100,200',//'100,1000',
        data: 500,
        gs_data: '100,500',//'100,500,1000',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'eps',
        label: 'eps',
        required: false,
        bo_data: '0.0,1.0',//'0.0,3.0',
        data: '2.220446049250313e-16',
        gs_data: '2.220446049250313e-15,2.220446049250313e-16,2.220446049250313e-17',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|([0-9]+(\.[0-9]+)*e-[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "fit_path",
      //   label: "fit_path",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'positive',
        label: 'positive',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Ridge CV Regression',
    fields: [
      {
        type: 'text',
        name: 'alphas',
        label: 'alphas',
        required: false,
        bo_data: '0.0001,0.001',//'0.0001,10.0',
        data: '0.1,10.0',//'0.1, 1.0, 10.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
        // gs_data: '0.0001,0.001,0.01,0.1,1.0,10.0', - disabling because skopt does not support array/list types
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      {
        type: 'select',
        name: 'gcv_mode',
        label: 'gcv_mode',
        required: true,
        data: 'auto',
        gs_data: ['auto', 'svd', 'eigen'],
        select_options: [
          { option_label: 'auto', value: 'auto' },
          { option_label: 'svd', value: 'svd' },
          { option_label: 'eigen', value: 'eigen' },
        ],
        placeholder_text: 'Select gcv_mode',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'cv',
        label: 'cv',
        required: false,
        bo_data: '5,7',//'5,10',
        data: 'None',
        gs_data: '5,7',//'5,7,9',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Bayesian Ridge Regression',
    fields: [
      {
        type: 'number',
        name: 'n_iter',
        label: 'n_iter',
        required: false,
        bo_data: '100,200',//'100,1000',
        data: 300,
        gs_data: '100,300',//'100,300,500',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.1, 0.9',//'0.000001, 0.9',
        data: '1e-03',
        gs_data: '0.001,0.01',//'0.01,0.001,0.0001',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'alpha_1',
        label: 'alpha_1',
        required: false,
        bo_data: '0.1, 0.9',//'0.000001, 0.9',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'alpha_2',
        label: 'alpha_2',
        required: false,
        bo_data: '0.1, 0.9',//'0.000001, 0.9',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'lambda_1',
        label: 'lambda_1',
        required: false,
        bo_data: '0.1, 0.9',//'0.000001, 0.9',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'lambda_2',
        label: 'lambda_2',
        required: false,
        bo_data: '0.1, 0.9',//'0.000001, 0.9',
        data: '1e-06',
        gs_data: '1e-05,1e-06,1e-07',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "compute_score",
      //   label: "compute_score",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'TheilSen Regression',
    fields: [
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'max_subpopulation',
        label: 'max_subpopulation',
        required: false,
        bo_data: '100,200',//'100,10000',
        data: '10000',
        gs_data: '1000,10000',//'1000,10000,100000',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 10000,
          "entMax": 10000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '100,200',//'100,500',
        data: 300,
        gs_data: '100,300',//'100,300,500',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.01, 0.1',//'0.000001, 0.1',
        data: 0.001,
        gs_data: '0.001,0.01',//'0.01,0.001,0.0001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*(, [0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'nuSV Regression',
    fields: [
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        bo_data: '1,3',//'1,10',
        data: 1.0,
        gs_data: '0.001,0.01',//'0.001,0.01,0.1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'nu',
        label: 'nu',
        required: false,
        bo_data: '0.3,0.5', //'0.3,0.9',
        data: 0.5,
        gs_data: '0.3,0.5,0.7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'kernel',
        label: 'kernel',
        required: true,
        data: 'rbf',
        gs_data: ['rbf'],
        select_options: [
          { option_label: 'linear', value: 'linear' },
          { option_label: 'poly', value: 'poly' },
          { option_label: 'rbf', value: 'rbf' },
          { option_label: 'sigmoid', value: 'sigmoid' },
          { option_label: 'precomputed', value: 'precomputed' },
        ],
        placeholder_text: 'Select kernel',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'gamma',
        label: 'gamma',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.5',
        data: 'auto',
        gs_data: 'scale,0.1,0.3',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|auto(,[0-9]+(\.[0-9]+)*)*|scale(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'degree',
        label: 'degree',
        required: false,
        bo_data: '3,5',//'3,7',
        data: 3,
        gs_data: '3,5,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'coef0',
        label: 'coef0',
        required: false,
        bo_data: '0.1,0.5',//'0.1,1.0',
        data: 0.0,
        gs_data: '0.1,0,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "shrinking",
      //   label: "shrinking",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.01,0.1',//'0.001,0.1',
        data: '0.001',
        gs_data: '1e-1,1e-3,1e-5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Extra Tree Classification',
    fields: [
      {
        type: 'select',
        name: 'criterion',
        label: 'criterion',
        required: true,
        data: 'gini',
        gs_data: ['gini', 'entropy'],
        select_options: [
          { option_label: 'gini', value: 'gini' },
          { option_label: 'entropy', value: 'entropy' },
        ],
        placeholder_text: 'Select criterion',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      //       {
      //         type: "select",
      //         name: "splitter",
      //         label: "splitter",
      //         required: true,
      //         data: "best",
      //         gs_data: ["best", "random"],
      //         select_options: [
      //           { option_label: "best", value: "best" },
      //           { option_label: "random", value: "random" },
      //         ],
      //         placeholder_text: "Select splitter",
      //       },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 'None',
        gs_data: '1.0,2.0,3.0,4.0,5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_split',
        label: 'min_samples_split',
        required: false,
        bo_data: '2,5',//'2,9',
        data: 2,
        gs_data: '0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_leaf',
        label: 'min_samples_leaf',
        required: false,
        bo_data: '2,5',//'2,9',
        data: 1,
        gs_data: '0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_weight_fraction_leaf',
        label: 'min_weight_fraction_leaf',
        required: false,
        bo_data: '0,0.2',//'0,0.5',
        data: 0,
        gs_data: '0,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "text",
      //   name: "max_features",
      //   label: "max_features",
      //   required: false,
      //   bo_data: "2,20",
      //   data: "None",
      //   gs_data: "None,auto,sqrt,log2",
      // },
      {
        type: 'text',
        name: 'max_leaf_nodes',
        label: 'max_leaf_nodes',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 'None',
        gs_data: 'None,5,10,15',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        bo_data: '0,1',
        data: 0,
        gs_data: '0,0.1,0.2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Ensemble Extra Trees Classification',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '10,50',//'10,100',
        data: 10,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'criterion',
        label: 'criterion',
        required: true,
        data: 'gini',
        gs_data: ['gini', 'entropy'],
        select_options: [
          { option_label: 'gini', value: 'gini' },
          { option_label: 'entropy', value: 'entropy' },
        ],
        placeholder_text: 'Select criterion',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_features',
        label: 'max_features',
        required: false,
        bo_data: '2,5',//'2,20',
        data: 'auto',
        gs_data: 'None,auto,sqrt,log2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+([0-9]+)*(,[a-zA-Z]+([0-9]+)*)*|[0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '2,5',//'2,20',
        data: 'None',
        gs_data: '1.0,2.0,3.0,4.0,5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_split',
        label: 'min_samples_split',
        required: false,
        bo_data: '2,5',//'2,9',
        data: 2,
        gs_data: '0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples_leaf',
        label: 'min_samples_leaf',
        required: false,
        bo_data: '2,5',//'2,9',
        data: 1,
        gs_data: '0.1,0.2,0.3,0.4,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_weight_fraction_leaf',
        label: 'min_weight_fraction_leaf',
        required: false,
        bo_data: '0,0.2',//'0,0.5',
        data: 0,
        gs_data: '0,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_leaf_nodes',
        label: 'max_leaf_nodes',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 'None',
        gs_data: 'None,5,10,15',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_impurity_decrease',
        label: 'min_impurity_decrease',
        required: false,
        bo_data: '0,2',//'0,5',
        data: 0,
        gs_data: '0,0.1,0.2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'bootstrap',
        label: 'bootstrap',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      //       {
      //         type: "radio",
      //         name: "oob_score",
      //         label: "oob_score",
      //         required: false,
      //         data: false,
      //         radio_btns: [
      //           { radio_label: "true", value: true },
      //           { radio_label: "false", value: false },
      //         ],
      //       },
      //       {
      //         type: "radio",
      //         name: "warm_start",
      //         label: "warm_start",
      //         required: false,
      //         data: false,
      //         radio_btns: [
      //           { radio_label: "true", value: true },
      //           { radio_label: "false", value: false },
      //         ],
      //       },
    ],
    isBOSupported: true,
  },
  //   {
  //     algoName: "Ensemble Extra Trees Classification",
  //     fields: [
  //       {
  //         type: "number",
  //         name: "n_estimators",
  //         label: "n_estimators",
  //         required: false,
  //         bo_data: "10,100",
  //         data: 10,
  //       },
  //       {
  //         type: "text",
  //         name: "criterion",
  //         label: "criterion",
  //         required: false,
  //         data: "gini",
  //       },
  //       {
  //         type: "text",
  //         name: "max_features",
  //         label: "max_features",
  //         required: false,
  //         bo_data: "2,20",
  //         data: "auto",
  //       },
  //       {
  //         type: "text",
  //         name: "max_depth",
  //         label: "max_depth",
  //         required: false,
  //         bo_data: "3,20",
  //         data: "None",
  //       },
  //       {
  //         type: "number",
  //         name: "min_samples_split",
  //         label: "min_samples_split",
  //         required: false,
  //         bo_data: "2,9",
  //         data: 2,
  //       },
  //       {
  //         type: "number",
  //         name: "min_samples_leaf",
  //         label: "min_samples_leaf",
  //         required: false,
  //         bo_data: "2,9",
  //         data: 1,
  //       },
  //       {
  //         type: "number",
  //         name: "min_weight_fraction_leaf",
  //         label: "min_weight_fraction_leaf",
  //         required: false,
  //         bo_data: "0,0.5",
  //         data: 0,
  //       },
  //       {
  //         type: "text",
  //         name: "max_leaf_nodes",
  //         label: "max_leaf_nodes",
  //         required: false,
  //         bo_data: "3,20",
  //         data: "None",
  //       },
  //       {
  //         type: "number",
  //         name: "min_impurity_decrease",
  //         label: "min_impurity_decrease",
  //         required: false,
  //         bo_data: "0,5",
  //         data: 0,
  //       },
  //       {
  //         type: "radio",
  //         name: "bootstrap",
  //         label: "bootstrap",
  //         required: false,
  //         data: false,
  //         radio_btns: [
  //           { radio_label: "true", value: true },
  //           { radio_label: "false", value: false },
  //         ],
  //       },
  //       {
  //         type: "radio",
  //         name: "oob_score",
  //         label: "oob_score",
  //         required: false,
  //         data: false,
  //         radio_btns: [
  //           { radio_label: "true", value: true },
  //           { radio_label: "false", value: false },
  //         ],
  //       },
  //       {
  //         type: "radio",
  //         name: "warm_start",
  //         label: "warm_start",
  //         required: false,
  //         data: false,
  //         radio_btns: [
  //           { radio_label: "true", value: true },
  //           { radio_label: "false", value: false },
  //         ],
  //       },
  //       {
  //         type: "text",
  //         name: "class_weight",
  //         label: "class_weight",
  //         required: false,
  //         data: "None",
  //       },
  //     ],
  //     isBOSupported: true,
  //   },
  {
    algoName: 'MLP Classification',
    fields: [
      {
        type: 'text',
        name: 'hidden_layer_sizes',
        label: 'hidden_layer_sizes',
        required: false,
        bo_data: '50,70',//'50,200',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'activation',
        label: 'activation',
        required: true,
        data: 'relu',
        gs_data: ['relu', 'tanh', 'logistic', 'identity'],
        select_options: [
          { option_label: 'identity', value: 'identity' },
          { option_label: 'logistic', value: 'logistic' },
          { option_label: 'tanh', value: 'tanh' },
          { option_label: 'relu', value: 'relu' },
        ],
        placeholder_text: 'Select activation',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'select',
        name: 'solver',
        label: 'solver',
        required: true,
        data: 'adam',
        gs_data: ['lbfgs', 'sgd', 'adam'],
        select_options: [
          { option_label: 'lbfgs', value: 'lbfgs' },
          { option_label: 'sgd', value: 'sgd' },
          { option_label: 'adam', value: 'adam' },
        ],
        placeholder_text: 'Select solver',
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'beta_1',
        label: 'beta_1',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.9,
        gs_data: '0.9,0.99',//'0.9,0.99,0.999',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'beta_2',
        label: 'beta_2',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.999,
        gs_data: '0.9,0.99',//'0.9,0.99,0.999',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'epsilon',
        label: 'epsilon',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.0003,
        gs_data: '1e-07,1e-08,1e-09',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.0001,
        gs_data: '0.0001,0.001',//'0.001,0.0001,0.00001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'learning_rate',
        label: 'learning_rate',
        required: true,
        data: 'constant',
        gs_data: ['constant', 'invscaling', 'adaptive'],
        select_options: [
          { option_label: 'constant', value: 'constant' },
          { option_label: 'invscaling', value: 'invscaling' },
          { option_label: 'adaptive', value: 'adaptive' },
        ],
        placeholder_text: 'Select learning_rate',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate_init',
        label: 'learning_rate_init',
        required: false,
        bo_data: '0.1,1.0',//'0.01,1.0',
        data: 0.001,
        gs_data: '0.01,0.001,0.0001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "number",
      //   name: "power_t",
      //   label: "power_t",
      //   required: false,
      //   bo_data: "0.0,1.0",
      //   data: 0.5,
      //   gs_data: "0.3,0.5,0.7",
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '200,300',
        data: 200,
        gs_data: '100,200',//'100,200,500',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'shuffle',
        label: 'shuffle',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.018,
        gs_data: '0.0001,0.001',//'0.001,0.0001,0.00001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'momentum',
        label: 'momentum',
        required: false,
        bo_data: '0.1,0.3',//'0.1,0.9',
        data: 0.9,
        gs_data: '0.5,0.7',//'0.5,0.7,0.9',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "nesterovs_momentum",
      //   label: "nesterovs_momentum",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'radio',
        name: 'early_stopping',
        label: 'early_stopping',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'validation_fraction',
        label: 'validation_fraction',
        required: false,
        bo_data: '0.0,0.9',
        data: 0.1,
        gs_data: '0.1,0.2',//'0.1,0.2,0.3',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Nearest Centroid Classification',
    fields: [
      {
        type: 'select',
        name: 'metric',
        label: 'metric',
        required: true,
        data: 'euclidean',
        gs_data: ['euclidean', 'manhattan'],
        select_options: [
          { option_label: 'euclidean', value: 'euclidean' },
          { option_label: 'manhattan', value: 'manhattan' },
          { option_label: 'minkowski', value: 'minkowski' },
          //           { option_label: "mahalanobis", value: "mahalanobis" },
        ],
        placeholder_text: 'Select metric',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(,[a-zA-Z]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'shrink_threshold',
        label: 'shrink_threshold',
        required: false,
        bo_data: '0.0,0.9',
        data: 'None',
        gs_data: '0.1,0.3',//'0.1,0.3,0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Ridge Classification',
    fields: [
      {
        type: 'number',
        name: 'alpha',
        label: 'alpha',
        required: false,
        bo_data: '0.0,1.0',
        data: 1.0,
        gs_data: '1,3,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      // {
      //   type: "radio",
      //   name: "copy_X",
      //   label: "copy_X",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'text',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 'None',
        gs_data: 'None,5,10',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*|None(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,1.0',
        data: 0.001,
        gs_data: '0.1,0.01,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'solver',
        label: 'solver',
        required: true,
        data: 'auto',
        gs_data: ['auto', 'sparse_cg', 'cholesky', 'svd', 'lsqr', 'sag', 'saga'],
        select_options: [
          { option_label: 'auto', value: 'auto' },
          { option_label: 'svd', value: 'svd' },
          { option_label: 'cholesky', value: 'cholesky' },
          { option_label: 'lsqr', value: 'lsqr' },
          { option_label: 'sparse_cg', value: 'sparse_cg' },
          { option_label: 'sag', value: 'sag' },
          { option_label: 'saga', value: 'saga' },
        ],
        placeholder_text: 'Select solver',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(,[a-zA-Z]+(_[a-zA-Z]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Ridge Classification with Cross Validation',
    fields: [
      {
        type: 'text',
        name: 'alphas',
        label: 'alphas',
        required: false,
        // bo_data: '0.0001,10.0',
        data: '0.1,1.0,10.0',
        gs_data: '0.0001,0.001,0.01,0.1,1.0,10.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'normalize',
      //   label: 'normalize',
      //   required: false,
      //   data: false,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      {
        type: 'text',
        name: 'cv',
        label: 'cv',
        required: false,
        bo_data: '3,7',
        data: 'None',
        gs_data: '3,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([1-9]+(,[1-9]+(\.[1-9]+)*)*|None(,[1-9]+(\.[1-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Logistic Regression with Cross Validation',
    fields: [
      {
        type: 'number',
        name: 'Cs',
        label: 'Cs',
        required: false,
        bo_data: '1,5',//'1,20',
        data: 10,
        gs_data: '1,10',//'1,10,100',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'cv',
        label: 'cv',
        required: false,
        bo_data: '3,7',
        data: 3,
        gs_data: '3,5,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'text',
        name: 'penalty',
        label: 'penalty',
        required: false,
        data: 'l2',
        gs_data: 'l2',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+([0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.0,1.0',
        data: 0.001,
        gs_data: '0.01,0.001,0.0001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'refit',
        label: 'refit',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      /*{
                    type: "select",
                    name: "multi_class",
                    label: "multi_class",
                    required: true,
                    data: "ovr",
                    select_options: [
                        {option_label: "ovr", value: "ovr"},
                        {option_label: "multinomial", value: "multinomial"}
                    ],
                    placeholder_text:'Select solver',
                    sub_ui_elemets:[]
                }*/
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Passive Aggressive Classification',
    fields: [
      {
        type: 'number',
        name: 'C',
        label: 'C',
        required: false,
        bo_data: '0.1,1.0',
        data: 1.0,
        gs_data: '0.01,0.1,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "fit_intercept",
      //   label: "fit_intercept",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'max_iter',
        label: 'max_iter',
        required: false,
        bo_data: '1000,1500',
        data: 1000,
        gs_data: '100,500,1000',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'tol',
        label: 'tol',
        required: false,
        bo_data: '0.1,1.0',
        data: 0.001,
        gs_data: '1e-3,1e-4,1e-5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(, [0-9]+(\.[0-9]+)*)*|[0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|(1e-[0-9]+)(,(1e-[0-9]+)*)*)$"
        }
      },
      {
        type: 'radio',
        name: 'shuffle',
        label: 'shuffle',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'select',
        name: 'loss',
        label: 'loss',
        required: true,
        data: 'hinge',
        gs_data: ['hinge', 'squared_hinge'],
        select_options: [
          { option_label: 'squared_hinge', value: 'squared_hinge' },
          { option_label: 'hinge', value: 'hinge' },
        ],
        placeholder_text: 'Select solver',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[a-zA-Z]+)*(,[a-zA-Z]+(_[a-zA-Z]+)*)*)$"
        }
      },
      // {
      //   type: "radio",
      //   name: "warm_start",
      //   label: "warm_start",
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: "true", value: true },
      //     { radio_label: "false", value: false },
      //   ],
      // },
      {
        type: 'text',
        name: 'average',
        label: 'average',
        required: false,
        data: false,
        gs_data: 'True,False,10',
        validators: {
          "required": true
        }
      },
      // {
      //   type: "text",
      //   name: "n_iter",
      //   label: "n_iter",
      //   required: false,
      //   data: "None",
      //   gs_data: "None,10,20",
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Artificial Neural Network Classification',
    fields: [
      {
        type: 'select',
        name: 'activation',
        label: 'activation',
        required: false,
        data: 'relu',
        select_options: [
          { option_label: 'relu', value: 'relu' },
          { option_label: 'tanh', value: 'tanh' },
        ],
        placeholder_text: 'Select activattion',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'select',
        name: 'kernel_initializer',
        label: 'kernel_initializer',
        required: false,
        data: 'uniform',
        select_options: [
          { option_label: 'uniform', value: 'uniform' },
          { option_label: 'zeros', value: 'zeros' },
          { option_label: 'ones', value: 'ones' },
          { option_label: 'constant', value: 'constant' },
          { option_label: 'normal', value: 'normal' },
        ],
        placeholder_text: 'Select kernel_initializer',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'select',
        name: 'optimizer',
        label: 'optimizer',
        required: false,
        data: 'adam',
        select_options: [
          { option_label: 'adam', value: 'adam' },
          { option_label: 'sgd', value: 'sgd' },
          { option_label: 'rmsprop', value: 'rmsprop' },
          { option_label: 'adagrad', value: 'adagrad' },
          { option_label: 'adadelta', value: 'adadelta' },
          { option_label: 'adamax', value: 'adamax' },
          { option_label: 'nadam', value: 'nadam' },
        ],
        placeholder_text: 'Select optimizer',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        disable: true,
        data: 0.01,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'dropout',
        label: 'dropout',
        required: false,
        disable: true,
        data: 0.1,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'hidden_layers',
        label: 'hidden_layers',
        required: false,
        disable: true,
        data: 3,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'epochs',
        label: 'epochs',
        required: false,
        data: 100,
        gs_data: '50,100',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'batch_size',
        label: 'batch_size',
        required: false,
        data: 32,
        gs_data: '32,50',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'Artificial Neural Network Regression',
    fields: [
      {
        type: 'select',
        name: 'activation',
        label: 'activation',
        required: false,
        data: 'relu',
        select_options: [
          { option_label: 'relu', value: 'relu' },
          { option_label: 'tanh', value: 'tanh' },
        ],
        placeholder_text: 'Select activattion',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'select',
        name: 'kernel_initializer',
        label: 'kernel_initializer',
        required: false,
        data: 'normal',
        select_options: [
          { option_label: 'uniform', value: 'uniform' },
          { option_label: 'zeros', value: 'zeros' },
          { option_label: 'ones', value: 'ones' },
          { option_label: 'constant', value: 'constant' },
          { option_label: 'normal', value: 'normal' },
        ],
        placeholder_text: 'Select kernel_initializer',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'select',
        name: 'optimizer',
        label: 'optimizer',
        required: false,
        data: 'adam',
        select_options: [
          { option_label: 'adam', value: 'adam' },
          { option_label: 'sgd', value: 'sgd' },
          { option_label: 'rmsprop', value: 'rmsprop' },
          { option_label: 'adagrad', value: 'adagrad' },
          { option_label: 'adadelta', value: 'adadelta' },
          { option_label: 'adamax', value: 'adamax' },
          { option_label: 'nadam', value: 'nadam' },
        ],
        placeholder_text: 'Select optimizer',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        disable: true,
        data: 0.01,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'epochs',
        label: 'epochs',
        required: false,
        data: 100,
        gs_data: '50,100',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'batch_size',
        label: 'batch_size',
        required: false,
        data: 32,
        gs_data: '32,50',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'XGBoost Classification',
    fields: [
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 3,
        gs_data: '3,4,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        bo_data: '0.1,1.0',
        data: 0.1,
        gs_data: '0.1,0.01,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '100,900',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: 'radio',
      //   name: 'silent',
      //   label: 'silent',
      //   required: false,
      //   data: true,
      //   radio_btns: [
      //     { radio_label: 'true', value: true },
      //     { radio_label: 'false', value: false },
      //   ],
      // },
      {
        type: 'number',
        name: 'colsample_bytree',
        label: 'colsample_bytree',
        required: false,
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'gamma',
        label: 'gamma',
        required: false,
        bo_data: '0.0,1.0',//'0.0,9.0',
        data: 0,
        gs_data: '0.5,1,1.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'subsample',
        label: 'subsample',
        required: false,
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        bo_data: '0.5,1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'reg_alpha',
        label: 'reg_alpha',
        required: false,
        bo_data: '0.1,5.0',//'0.1,9.0',
        data: 0,
        gs_data: '0,1,2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'scale_pos_weight',
        label: 'scale_pos_weight',
        required: false,
        bo_data: '0.1,5.0',//'0.1,9.0',
        data: 1,
        gs_data: '0,1,2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'XGBoost Regression',
    fields: [
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,5',//'3,10',
        data: 3,
        gs_data: '3,4,5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        bo_data: '0.1,0.5',//'0.000001, 0.9',
        data: 0.1,
        gs_data: '0.1,0.01,0.001',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '50,500',
        data: 100,
        gs_data: '50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      }, {
        type: 'number',
        name: 'colsample_bytree',
        label: 'colsample_bytree',
        required: false,
        bo_data: '0.0, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*(, [0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'gamma',
        label: 'gamma',
        required: false,
        bo_data: '0.1, 2.0',
        data: 0,
        gs_data: '0.5,1,1.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*(, [0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'subsample',
        label: 'subsample',
        required: false,
        bo_data: '0.1, 1.0',
        data: 1,
        gs_data: '0.6,0.8',//'0.6,0.8,1.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*(, [0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'reg_alpha',
        label: 'reg_alpha',
        required: false,
        data: 0,
        gs_data: '0,1,2',
        bo_data: '0.1,5.0',//'0.1,9.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'scale_pos_weight',
        label: 'scale_pos_weight',
        required: false,
        bo_data: '0,3',
        data: 1,
        gs_data: '0,1,2',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'LightGBM Classification',
    fields: [
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        bo_data: '0.1, 1.0',
        data: 0.1,
        gs_data: '0.01,0.1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*(, [0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'boosting_type',
        label: 'boosting_type',
        required: true,
        data: 'gbdt',
        gs_data: ['gbdt'],
        select_options: [
          { option_label: 'gbdt', value: 'gbdt' },
          { option_label: 'dart', value: 'dart' },
          { option_label: 'goss', value: 'goss' },
        ],
        placeholder_text: 'Select boosting_type',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          // "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '20,50',//'20,900',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'num_leaves',
        label: 'num_leaves',
        required: false,
        bo_data: '3,30',
        data: 31,
        gs_data: '30,31,32',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '3,5',//'3,20',
        data: 1,
        gs_data: '1,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "number",
      //   name: "min_data",
      //   label: "min_data",
      //   required: false,
      //   data: 50,
      //   gs_data: "50,100",
      // },
      // {
      //   type: "number",
      //   name: "sub_feature",
      //   label: "sub_feature",
      //   required: false,
      //   data: 0.5,
      //   gs_data: "0.3,0.5,0.7",
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'LightGBM Regression',
    fields: [
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        bo_data: '0.1,0.5',//'0.000001, 0.9',
        data: 0.1,
        gs_data: '0.01,0.1',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'select',
        name: 'boosting_type',
        label: 'boosting_type',
        required: true,
        data: 'gbdt',
        gs_data: ['gbdt'],
        select_options: [
          { option_label: 'gbdt', value: 'gbdt' },
          { option_label: 'dart', value: 'dart' },
          { option_label: 'goss', value: 'goss' },
        ],
        placeholder_text: 'Select boosting_type',
        sub_ui_elemets: [],
        validators: {
          "required": true,
          // "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        bo_data: '50,500',
        data: 100,
        gs_data: '50,100',//'50,100,200',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'num_leaves',
        label: 'num_leaves',
        required: false,
        bo_data: '30,50',
        data: 31,
        gs_data: '30,31,32',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '1,10',
        data: 1,
        gs_data: '1,7',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      // {
      //   type: "number",
      //   name: "min_data",
      //   label: "min_data",
      //   required: false,
      //   data: 50,
      //   gs_data: "50,100",
      // },
      // {
      //   type: "number",
      //   name: "sub_feature",
      //   label: "sub_feature",
      //   required: false,
      //   data: 0.5,
      //   gs_data: "0.3,0.5,0.7",
      // },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Arima',
    fields: [
      {
        type: 'number',
        name: 'p',
        label: 'p',
        placeholder_text: 'Auto-regressive terms',
        required: false,
        data: 1,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'd',
        label: 'd',
        placeholder_text: 'Non-seasonal differences',
        required: false,
        data: 1,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'q',
        label: 'q',
        placeholder_text: 'Moving-Average terms',
        required: false,
        data: 1,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'Arimax',
    fields: [
      {
        type: 'number',
        name: 'ar',
        label: 'ar',
        placeholder_text: 'Auto-regressive terms',
        required: false,
        data: 1,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'ma',
        label: 'ma',
        placeholder_text: 'Non-seasonal differences',
        required: false,
        data: 1,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'integ',
        label: 'integ',
        placeholder_text: 'Moving-Average terms',
        required: false,
        data: 0,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'Sarimax',
    fields: [
      {
        type: 'text',
        name: 'order',
        label: 'order(p,d,q)',
        placeholder_text: '',
        required: false,
        data: '1,0,0',
        gs_data: '2,1,1',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(,[0-9]+){2})$"
        }
      },
      {
        type: 'text',
        name: 'seasonal_order',
        label: 'seasonal order(p,d,q,s)',
        placeholder_text: '',
        required: false,
        data: '0,0,0,0',
        gs_data: '1,1,1,1',
        validators: {
          "required": true,
          "pattern": "^([0-9]+(,[0-9]+){3})$"
        }
      },
      {
        type: 'radio',
        name: 'enforce_stationarity',
        label: 'enforce_stationarity',
        required: false,
        data: true,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
      {
        type: 'radio',
        name: 'enforce_invertibility',
        label: 'enforce_invertibility',
        required: false,
        data: false,
        radio_btns: [
          { radio_label: 'true', value: true },
          { radio_label: 'false', value: false },
        ],
        validators: {
          "required": true
        }
      },
    ],
    isBOSupported: false,
  }, {
    algoName: 'Prophet',
    fields: [
      {
        type: 'select',
        name: 'seasonality_mode',
        label: 'seasonality_mode',
        validators: {
          required: false,
        },
        data: 'additive',
        gs_data: ['additive', 'multiplicative'],
        select_options: [
          { option_label: 'additive', value: 'additive' },
          { option_label: 'multiplicative', value: 'multiplicative' },
        ]
      },
      {
        type: 'text',
        name: 'seasonality_prior_scale',
        label: 'seasonality_prior_scale',
        required: false,
        data: '10.0',
        placeholder_text: 'Some value',
        gs_data: '0.01, 10',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
      {
        type: 'text',
        name: 'holidays_prior_scale',
        label: 'holidays_prior_scale',
        required: false,
        data: '10.0',
        placeholder_text: 'Some value',
        gs_data: '0.01, 10',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
      {
        type: 'text',
        name: 'changepoint_prior_scale',
        label: 'changepoint_prior_scale',
        required: false,
        data: '0.05',
        placeholder_text: 'Some value',
        gs_data: '0.001, 0.5',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },
    ],
    isBOSupported: true,
  }, {
    algoName: 'Random Forest',
    fields: [
      {
        type: 'number',
        name: 'lags',
        label: 'lags',
        required: true,
        bo_data: '',
        data: 10,
        gs_data: '',
        validators: {
          "required": true,
          "min": 1,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'lags_past_covariates',
        label: 'lags_past_covariates',
        required: true,
        bo_data: '',
        data: 10,
        gs_data: '',
        validators: {
          "required": true,
          "min": 1,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      }, {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: true,
        bo_data: '',
        data: 100,
        gs_data: '',
        validators: {
          "required": true,
          "min": 1,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'text',
        name: 'max_depth',
        label: 'max_depth',
        required: false,
        bo_data: '',//'1,5',
        data: 'None',
        gs_data: '', //'1.0, 2.0, 3.0, 4.0, 5.0',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*(,[0-9]+(\.[0-9]+)*)*|None)$"
        }
      },]
  }, {
    algoName: 'Linear Regression Ts',
    fields: [
      {
        type: 'number',
        name: 'lags',
        label: 'lags',
        required: true,
        bo_data: '',
        data: 10,
        gs_data: '',
        validators: {
          "required": true,
          "min": 1,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'lags_past_covariates',
        label: 'lags_past_covariates',
        required: true,
        bo_data: '',
        data: 10,
        gs_data: '',
        validators: {
          "required": true,
          "min": 1,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },]
  }, {
    algoName: 'Agglomerative',
    fields: [
      {
        type: 'text',
        name: 'affinity',
        label: 'affinity',
        required: true,
        bo_data: '',
        data: 'euclidean',
        gs_data: '',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'select',
        name: 'linkage',
        label: 'linkage',
        required: true,
        data: 'ward',
        select_options: [
          { option_label: 'ward', value: 'ward' },
          { option_label: 'complete', value: 'complete' },
          { option_label: 'average', value: 'average' },
          { option_label: 'single', value: 'single' },
        ],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
    ]
  },
  {
    algoName: 'DBSCAN',
    fields: [
      {
        type: 'number',
        name: 'eps',
        label: 'eps',
        required: true,
        bo_data: '',
        data: 0.5,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'min_samples',
        label: 'min_samples',
        required: true,
        bo_data: '',
        data: 5,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'leaf_size',
        label: 'leaf_size',
        required: true,
        bo_data: '',
        data: 30,
        gs_data: '',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'text',
        name: 'metric',
        label: 'metric',
        required: true,
        bo_data: '',
        data: 'euclidean',
        gs_data: '',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'text',
        name: 'metric_params',
        label: 'metric_params',
        required: true,
        bo_data: '',
        data: 'None',
        gs_data: '',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'text',
        name: 'p',
        label: 'p',
        required: true,
        bo_data: '',
        data: 'None',
        gs_data: '',
        validators: {
          "required": true,
          "minLength": 2,
          "maxLength": 200,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'select',
        name: 'algorithm',
        label: 'algorithm',
        required: true,
        data: 'auto',
        select_options: [
          { option_label: 'auto', value: 'auto' },
          { option_label: 'ball_tree', value: 'ball_tree' },
          { option_label: 'kd_tree', value: 'kd_tree' },
          { option_label: 'brute', value: 'brute' },
        ],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+(_[0-zA-Z]+)*)$"
        }
      },
    ],
    isBOSupported: false,
  },
  {
    algoName: 'LSTM',
    fields: [
      {
        type: 'select',
        name: 'optimizer',
        label: 'optimizer',
        required: true,
        data: 'adam',
        select_options: [
          { option_label: 'adam', value: 'adam' },
          { option_label: 'sgd', value: 'sgd' },
          { option_label: 'rmsprop', value: 'rmsprop' },
          { option_label: 'adagrad', value: 'adagrad' },
          { option_label: 'adadelta', value: 'adadelta' },
          { option_label: 'adamax', value: 'adamax' },
          { option_label: 'nadam', value: 'nadam' },
        ],
        placeholder_text: 'Select optimizer',
        disable: true,
        sub_ui_elemets: [],
        validators: {
          "required": true,
          "pattern": "^([a-zA-Z]+)$"
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        disable: true,
        data: 0.001,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'dropout',
        label: 'dropout',
        required: false,
        disable: true,
        data: 0.2,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(\.[0-9]+)*)$"
        }
      },
      {
        type: 'number',
        name: 'hidden_layers',
        label: 'hidden_layers',
        required: false,
        disable: true,
        data: 3,
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+)$"
        }
      },
      {
        type: 'number',
        name: 'epochs',
        label: 'epochs',
        required: false,
        data: 50,
        gs_data: '50,100',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
      {
        type: 'number',
        name: 'batch_size',
        label: 'batch_size',
        required: false,
        data: 32,
        gs_data: '32,50',
        validators: {
          "required": true,
          "min": 0,
          "saasMax": 2000,
          "entMax": 3000,
          "pattern": "^([0-9]+(,[0-9]+(\.[0-9]+)*)*)$"
        }
      },
    ],
    isBOSupported: false,
  },
];
