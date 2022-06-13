function UserHome() {
  const getUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/user', {
        credentials: 'include',
      });
      console.log(response);
      const jsonData = await response.json();
      console.log(jsonData);
    } catch (err) {
      console.log(err.message);
    }
  };

  const onLogOut = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      window.location = '/';
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container-fluid bg-light py-3 d-flex flex-grow-1 justify-content-center">
      <div className="container-fluid bg-light d-flex flex-column justify-content-center flex-grow-1 p-0">
        <div>Welcome to your Home Page!</div>
        <button onClick={getUser}>Check Login Status</button>
        <button onClick={onLogOut}>Log Out</button>
      </div>
    </div>
  );
}

export default UserHome;
