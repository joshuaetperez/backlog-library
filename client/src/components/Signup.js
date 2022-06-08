import {useState} from 'react';

function createDefaultErrorState() {
  return {
    emailExistsError: null,
    usernameExistsError: null,
    usernameLengthError: null,
    passwordLengthError: null,
    confirmPasswordLengthError: null,
    confirmPasswordNoMatchError: null,
  };
}

const errorMessages = {
  emailExistsErrorMessage: 'Email address is already in use',
  usernameExistsErrorMessage: 'Username is already in use',
  usernameLengthErrorMessage:
    'Username cannot be empty and must contain 20 characters or less',
  passwordLengthErrorMessage: 'Password must contain at least 6 characters',
  confirmPasswordLengthErrorMessage:
    'Confirmation password must contain at least 6 characters',
  confirmPasswordNoMatchErrorMessage:
    'Confirmation password does not match password',
};

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Client-side form validation
    let errorState = createDefaultErrorState();
    if (username.length > 20) errorState.usernameLengthError = true;
    if (password.length < 6) errorState.passwordLengthError = true;
    if (confirmPassword.length < 6)
      errorState.confirmPasswordLengthError = true;
    if (password !== confirmPassword)
      errorState.confirmPasswordNoMatchError = true;

    // If there is at least one of the following errors, display error messages on the form without making a server request
    if (
      errorState.usernameLengthError === true ||
      errorState.passwordLengthError === true ||
      errorState.confirmPasswordLengthError === true ||
      errorState.confirmPasswordNoMatchError === true
    ) {
      setErrorObj(errorState);
      return;
    }

    // Server-side form validation
    errorState = createDefaultErrorState();
    try {
      const body = {email, username, password, confirmPassword};
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      const errorArray = jsonData.errors;
      // If there is at least one of the following errors, display error messages on the form
      if (errorArray !== undefined) {
        for (let error of errorArray) {
          switch (error.msg) {
            case errorMessages.emailExistsErrorMessage:
              errorState.emailExistsError = true;
              break;
            case errorMessages.usernameExistsErrorMessage:
              errorState.usernameExistsError = true;
              break;
            case errorMessages.usernameLengthErrorMessage:
              errorState.usernameLengthError = true;
              break;
            case errorMessages.passwordLengthErrorMessage:
              errorState.passwordLengthError = true;
              break;
            case errorMessages.confirmPasswordLengthErrorMessage:
              errorState.confirmPasswordLengthError = true;
              break;
            case errorMessages.confirmPasswordNoMatchErrorMessage:
              errorState.confirmPasswordNoMatchError = true;
              break;
            default:
              break;
          }
        }
        setErrorObj(errorState);
      } else {
        window.location = '/home';
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container-fluid bg-light d-flex flex-column justify-content-center flex-grow-1 p-0">
      <div className="container bg-white p-5">
        <h3 className="mb-5">Sign up</h3>
        <form onSubmit={onSubmitForm}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errorObj['emailExistsError'] !== null && (
              <div id="email-exists-error">
                <span className="material-icons">error</span>
                {errorMessages.emailExistsErrorMessage}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="username"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errorObj['usernameExistsError'] !== null && (
              <div id="username-exists-error">
                <span className="material-icons">error</span>
                {errorMessages.usernameExistsErrorMessage}
              </div>
            )}
            {errorObj['usernameLengthError'] !== null && (
              <div id="username-length-error">
                <span className="material-icons">error</span>
                {errorMessages.usernameLengthErrorMessage}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorObj['passwordLengthError'] !== null && (
              <div id="password-length-error">
                <span className="material-icons">error</span>
                {errorMessages.passwordLengthErrorMessage}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errorObj['confirmPasswordLengthError'] !== null && (
              <div id="confirm-password-length-error">
                <span className="material-icons">error</span>
                {errorMessages.confirmPasswordLengthErrorMessage}
              </div>
            )}
            {errorObj['confirmPasswordNoMatchError'] !== null && (
              <div id="confirm-password-no-match-error">
                <span className="material-icons">error</span>
                {errorMessages.confirmPasswordNoMatchErrorMessage}
              </div>
            )}
          </div>
          <div className="mt-4 mb-3 text-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill w-100 p-2"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
