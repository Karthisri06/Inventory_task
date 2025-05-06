
const LogoutButton = () => {
  const handleLogout = () => {
 
    localStorage.removeItem('token'); 
   
    window.location.href = '/';
  };

  return (
    <button className="btn btn-danger w-100 mt-4" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
