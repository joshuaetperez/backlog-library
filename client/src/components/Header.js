function Header() {
  return (
    <div className="navbar bg-info flex-nowrap">
      <div className="container">
        <a className="navbar-brand fs-3 text-wrap bold" href="/">
          Backlog Library
        </a>
        <div className="d-flex gap-2 justify-content-center text-nowrap">
          <button type="button" class="btn btn-secondary">
            Log In
          </button>
          <button type="button" class="btn btn-primary">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
