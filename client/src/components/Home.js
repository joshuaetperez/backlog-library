function Home() {
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
      const response = await fetch('http://localhost:5000/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log(response);
      const textData = await response.text();
      console.log(textData);

      const newResponse = await fetch('http://localhost:5000/user', {
        credentials: 'include',
      });
      console.log(newResponse);
      const jsonData = await newResponse.json();
      console.log(jsonData);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="container-fluid bg-light d-flex flex-column justify-content-center flex-grow-1 p-0">
      <div>Welcome to your Home Page!</div>
      <button onClick={getUser}>Check Login Status</button>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
}

export default Home;
