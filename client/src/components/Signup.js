function Signup() {
  return (
    <div class="container-fluid bg-light d-flex flex-column justify-content-center flex-grow-1">
      <div class="container bg-white p-5">
        <h3 class="mb-5">Sign up</h3>
        <form>
          <div class="mb-3">
            <label for="email" class="form-label">
              Email
            </label>
            <input type="email" class="form-control" id="email" />
          </div>
          <div class="mb-3">
            <label for="username" class="form-label">
              Username
            </label>
            <input type="username" class="form-control" id="username" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>
            <input type="password" class="form-control" id="password" />
          </div>
          <div class="mb-3">
            <label for="confirm-password" class="form-label">
              Confirm Password
            </label>
            <input
              type="confirm-password"
              class="form-control"
              id="confirm-password"
            />
          </div>
          <div class="mt-4 mb-3 text-center">
            <button
              type="submit"
              class="btn btn-primary rounded-pill w-100 p-2"
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
