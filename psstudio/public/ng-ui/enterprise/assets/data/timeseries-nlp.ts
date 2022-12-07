/**
 * NLP languages
 */
export const NLP_LANGUAGES: Array<string> = ['English', 'Portuguese'];

/**
 * NLP feature counts
 */
export const NLP_FEATURE_COUNTS: Array<number> = [50, 100, 150, 200];

/**
 * Resampling constants
 */
export const RESAMPLING_CONSTANTS: Array<any> = [
  { desc: 'Business day frequency', value: 'B', index: 3 },
  { desc: 'Custom business day frequency (experimental)', value: 'C' },
  { desc: 'Calendar day frequency', value: 'D', index: 3 },
  { desc: 'Weekly frequency', value: 'W', index: 4 },
  { desc: 'Month end frequency', value: 'M', index: 6 },
  //{ desc: 'Semi-month end frequency (15th and end of month)', value: 'SM', index:5 },
  //{ desc: 'Business month end frequency', value: 'BM', index:6 },
  { desc: 'Custom business month end frequency', value: 'CBM' },
  { desc: 'Month start frequency', value: 'MS', index: 6 },
  //{ desc: 'Semi-month start frequency (1st and 15th)', value: 'SMS', index:5 },
  //{ desc: 'Business month start frequency', value: 'BMS', index:6 },
  { desc: 'Custom business month start frequency', value: 'CBMS' },
  //{ desc: 'Quarter end frequency', value: 'Q', index:7 },
  //{ desc: 'Business quarter end frequency', value: 'BQ', index:7 },
  //{ desc: 'Quarter start frequency', value: 'QS', index:7 },
  //{ desc: 'Business quarter start frequency', value: 'BQS', index:7 },
  { desc: "Year end frequency", value: "A", index: 8 },
  //{ desc: "Business year end frequency", value: "BA", index: 8 },
  { desc: "Year start frequency", value: "AS", index: 8 },
  //{ desc: "Business year start frequency", value: "BAS", index: 8 },
  { desc: "Business hour frequency", value: "BH", index: 2 },
  { desc: 'Hourly frequency', value: 'H', index: 2 },
  { desc: 'Minutely frequency', value: 'T', index: 1 },
];

/**
 * Method constants
 */
export const METHOD_CONSTANTS: Array<any> = [
  { desc: 'Backward fill', value: 'bfill' },
  // { desc: 'Count of values', value: 'count' },
  { desc: 'Forward fill', value: 'ffill' },
  { desc: 'First valid data value', value: 'first' },
  { desc: 'Last valid data value', value: 'last' },
  { desc: 'Maximum data value', value: 'max' },
  { desc: 'Mean of values in time range', value: 'mean' },
  { desc: 'Median of values in time range', value: 'median' },
  { desc: 'Minimum data value', value: 'min' },
  //{ desc: 'Number of unique values', value: 'nunique' },
  //{ desc: "Opening value, highest value, lowest value, closing value", value: "ohlc" },
  { desc: 'Same as forward fill', value: 'pad' },
  { desc: 'Standard deviation of values', value: 'std' },
  { desc: 'Sum of values', value: 'sum' },
  { desc: 'Variance of values', value: 'var' },
];

/**
 * Frequencies constant
 */
export const FREQUENCIES: Array<number> = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30,
];
