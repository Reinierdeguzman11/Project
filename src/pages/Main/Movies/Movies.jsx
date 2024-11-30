import { Outlet } from 'react-router-dom';

const Movies = () => {
  return (
    <>
      <h1>Movies Page</h1>
      <Outlet />
    </>
  );
};

export default Movies;