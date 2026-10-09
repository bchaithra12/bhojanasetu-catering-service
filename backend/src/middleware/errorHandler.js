import { sendApiError } from '../utils/apiError.js';

export const errorHandler = (err, req, res, next) => {
  sendApiError(res, err, 'Something went wrong. Please try again.');
};

export default errorHandler;
