
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/Public/LoginPage/LoginPage';
import RegisterPage from './pages/Public/RegisterPage/RegisterPage';
import Main from './pages/Main/Main';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Lists from './pages/Main/Movies/List/List';
import Forms from './pages/Main/Movies/Form/Form';
import Movies from './pages/Main/Movies/Movies';
import Cast from './pages/Main/Movies/Cast/Cast'; 
import Photos from './pages/Main/Movies/Photos/Photos'; 
import Videos from './pages/Main/Movies/Videos/Videos';  

const router = createBrowserRouter([
  
{ path: '/',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage/>,
  },
  
  {
    path: '/main',
    element: <Main />,
    children: [
      
      {
        path: '/main/dashboard',
         element: <Dashboard />,
       },
      {
        path: '/main/movies',
        element: <Movies/>,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Forms />,
            children: [
              {
                path: 'cast',
                element: <Cast/>,
              },
              {
                path: 'photos',
                element: <Photos/>,
              },
              {
                path: 'videos',
                element: <Videos/>,
              },
            ],
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;