export const ADV_ALGORITHMS_FORM_FIELDS: Array<any> = [
  {
    algoName: 'Boosting-Regression',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        data: 50,
        gs_data: '50,100,500',
        bo_data: '50,500',
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        data: 1.0,
        gs_data: '0.01, 0.1,1.0',
        bo_data: '0.01,1.0',
        validators: {
          "required": true
        }
      },
      {
        type: 'select',
        name: 'loss',
        label: 'loss',
        required: true,
        data: 'linear',
        gs_data: ['linear', 'square', 'exponential'],
        select_options: [
          { option_label: 'linear', value: 'linear' },
          { option_label: 'square', value: 'square' },
          { option_label: 'exponential', value: 'exponential' },
        ],
        placeholder_text: 'Select loss',
        validators: {
          "required": true
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Boosting-Classification',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        data: 50,
        gs_data: '50,100,500',
        bo_data: '50,500',
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'learning_rate',
        label: 'learning_rate',
        required: false,
        data: 1.0,
        gs_data: '0.01, 0.1,1.0',
        bo_data: '0.01,1.0',
        validators: {
          "required": true
        }
      },
      {
        type: 'select',
        name: 'algorithm',
        label: 'algorithm',
        required: true,
        data: 'SAMME.R',
        gs_data: ['SAMME.R'],
        select_options: [
          { option_label: 'SAMME.R', value: 'SAMME.R' },
          { option_label: 'SAMME', value: 'SAMME' },
        ],
        placeholder_text: 'Select loss',
        validators: {
          "required": true
        }
      },
    ],
    isBOSupported: true,
  },
  {
    algoName: 'Bagging-Regression',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        data: 10,
        gs_data: '10,50,100',
        bo_data: '10,100',
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'max_samples',
        label: 'max_samples',
        required: false,
        data: 1.0,
        gs_data: '0.5,0.7,1.0',
        bo_data: '0.5,1.0',
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 1.0,
        gs_data: '0.5,0.7,1.0',
        bo_data: '0.5,1.0',
        validators: {
          "required": true
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
          "required": true
        }
      },
      {
        type: 'radio',
        name: 'oob_score',
        label: 'oob_score',
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
    algoName: 'Bagging-Classification',
    fields: [
      {
        type: 'number',
        name: 'n_estimators',
        label: 'n_estimators',
        required: false,
        data: 10,
        gs_data: '10,50,100',
        bo_data: '10,100',
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'max_samples',
        label: 'max_samples',
        required: false,
        data: 1.0,
        gs_data: '0.5,0.7,1.0',
        bo_data: '0.5,1.0',
        validators: {
          "required": true
        }
      },
      {
        type: 'number',
        name: 'max_features',
        label: 'max_features',
        required: false,
        data: 1.0,
        gs_data: '0.5,0.7,1.0',
        bo_data: '0.5,1.0',
        validators: {
          "required": true
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
          "required": true
        }
      },
      {
        type: 'radio',
        name: 'oob_score',
        label: 'oob_score',
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
    algoName: 'GridSearchCV-Regression',
    fields: [
      {
        type: 'select',
        name: 'scoring',
        label: 'scoring',
        required: true,
        data: 'None',
        gs_data: [
          'explained_variance',
          'neg_mean_absolute_error',
          'neg_mean_squared_error',
          'neg_mean_squared_log_error',
          'neg_median_absolute_error',
        ],
        select_options: [
          { option_label: 'explained_variance', value: 'explained_variance' },
          { option_label: 'None', value: 'None' },
          { option_label: 'neg_mean_absolute_error', value: 'neg_mean_absolute_error' },
          { option_label: 'neg_mean_squared_error', value: 'neg_mean_squared_error' },
          { option_label: 'neg_mean_squared_log_error', value: 'neg_mean_squared_log_error' },
          { option_label: 'neg_median_absolute_error', value: 'neg_median_absolute_error' },
          { option_label: 'r2', value: 'r2' },
        ],
        placeholder_text: 'Select loss',
        validators: {
          "required": true
        }
      },
      { type: 'text', name: 'fit_params', label: 'fit_params', required: false, data: 'None',validators: {
        "required": true
      } },
      {
        type: 'radio',
        name: 'iid',
        label: 'iid',
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
      {
        type: 'text',
        name: 'error_score',
        label: 'error_score',
        required: false,
        data: 'raise-deprecating',
        validators: {
          "required": true
        }
      },
      { type: 'number', name: 'verbose', label: 'verbose', required: false, data: 0,validators: {
        "required": true
      } },
      {
        type: 'radio',
        name: 'return_train_score',
        label: 'return_train_score',
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
    ],
    isBOSupported: true,
  },
  {
    algoName: 'GridSearchCV-Classification',
    fields: [
      {
        type: 'select',
        name: 'scoring',
        label: 'scoring',
        required: true,
        data: 'None',
        gs_data: ['None', 'accuracy', 'f1', 'precision', 'recall'],
        select_options: [
          { option_label: 'None', value: 'None' },
          { option_label: 'accuracy', value: 'accuracy' },
          { option_label: 'f1', value: 'f1' },
          { option_label: 'precision', value: 'precision' },
          { option_label: 'recall', value: 'recall' },
        ],
        placeholder_text: 'Select loss',
        validators: {
          "required": true
        }
      },
      { type: 'text', name: 'fit_params', label: 'fit_params', required: false, data: 'None' },
      {
        type: 'radio',
        name: 'iid',
        label: 'iid',
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
      {
        type: 'text',
        name: 'error_score',
        label: 'error_score',
        required: false,
        data: 'raise-deprecating',
        validators: {
          "required": true
        }
      },
      { type: 'number', name: 'verbose', label: 'verbose', required: false, data: 0,validators: {
        "required": true
      } },
      {
        type: 'radio',
        name: 'return_train_score',
        label: 'return_train_score',
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
    ],
    isBOSupported: true,
  },
];
