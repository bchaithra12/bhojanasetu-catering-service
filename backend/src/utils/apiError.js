const getValidationMessage = (error) =>
  Object.values(error.errors || {})
    .map((fieldError) => fieldError.message)
    .join('. ');

export const sendApiError = (res, error, fallbackMessage) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Request body contains invalid JSON.'
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: getValidationMessage(error) || 'Please check the submitted fields.'
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path || 'field'} value.`
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    const fieldLabel = field ? field.replace(/([A-Z])/g, ' $1').toLowerCase() : 'Value';
    return res.status(409).json({
      success: false,
      message: `${fieldLabel} is already in use.`
    });
  }

  if (Number.isInteger(error.status) && error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({
      success: false,
      message: error.message || fallbackMessage
    });
  }

  console.error(error.stack || error);
  return res.status(500).json({
    success: false,
    message: fallbackMessage
  });
};
