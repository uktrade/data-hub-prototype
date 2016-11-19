module.exports = (req, res, next) => {
  const formErrors = req.flash('error');

  res.locals.messages = {
    success: req.flash('success-message'),
    error: req.flash('error-message'),
  };

  if (formErrors && formErrors.length) {
    res.locals.messages.formErrors = formErrors;
  }

  next();
};
