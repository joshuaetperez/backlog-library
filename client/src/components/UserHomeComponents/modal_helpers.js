const createDefaultErrorState = () => {
  return {
    titleLengthError: null,
    titleExistsError: null,
    categoryInvalidError: null,
    statusInvalidError: null,
    priorityInvalidError: null,
    notesLengthError: null,
  };
};

const createErrorState = (errorArray) => {
  const errorState = createDefaultErrorState();
  for (const error of errorArray) {
    switch (error.msg) {
      case errorMessages.titleLengthErrorMessage:
        errorState.titleLengthError = true;
        break;
      case errorMessages.titleExistsErrorMessage:
        errorState.titleExistsError = true;
        break;
      case errorMessages.categoryInvalidErrorMessage:
        errorState.categoryInvalidError = true;
        break;
      case errorMessages.statusInvalidErrorMessage:
        errorState.statusInvalidError = true;
        break;
      case errorMessages.priorityInvalidErrorMessage:
        errorState.priorityInvalidError = true;
        break;
      case errorMessages.notesLengthErrorMessage:
        errorState.notesLengthError = true;
        break;
      default:
        break;
    }
  }
  return errorState;
};

const errorMessages = {
  titleLengthErrorMessage: 'Title must contain between 1 and 100 characters',
  titleExistsErrorMessage:
    'Title already exists in this category with this user',
  categoryInvalidErrorMessage: 'Category is invalid',
  statusInvalidErrorMessage: 'Status is invalid',
  priorityInvalidErrorMessage: 'Priority is invalid',
  notesLengthErrorMessage: 'Notes cannot be more than 1000 characters',
};

module.exports = {
  createDefaultErrorState,
  createErrorState,
  errorMessages,
};
