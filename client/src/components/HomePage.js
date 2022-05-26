function HomePage() {
  return (
    <div className="container-fluid bg-light py-3 d-flex flex-grow-1 align-center-self justify-content-center">
      <div className="card container my-3 px-0 bg-info bg-gradient rounded-4 card-height">
        <div className="card-body text-center">
          <h5 className="card-title my-3 fs-2">Your Personal Backlog</h5>
          <h6 className="card-subtitle mb-4 fs-4 text-muted">
            Keep track of what you want to do next!
          </h6>
          <p className="card-text fs-4 text-muted">
            Backlog Library can be used to keep track of the following
            categories:
          </p>
          <div class="container d-grid gap-3 fs-4 bold-m">
            <div class="row">
              <div class="col-sm">Movies</div>
              <div class="col-sm">TV Shows</div>
            </div>
            <div class="row">
              <div class="col-sm">Anime</div>
              <div class="col-sm">Manga</div>
            </div>
            <div class="row">
              <div class="col-sm">Video Games</div>
              <div class="col-sm">Books</div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary rounded-4">
          Make an account!
        </button>
      </div>
    </div>
  );
}

export default HomePage;
