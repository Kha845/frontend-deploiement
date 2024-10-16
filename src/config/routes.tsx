import { Navigate, useRoutes } from 'react-router-dom'
import BaseLayout from '../component/layout/BaseLayout'
import PrivateRoute from '../middleware/PrivateRoute'
import Login from '../pages/guest/login'

const routes = [
    {path: "/", element: <Navigate to = "login"/>},
    {path: "/login", element: <Login/>},
    {path: "/accueil", element: <PrivateRoute element= {<BaseLayout />} />, children: [
        {path: "", element:  <Navigate to = "accueil" />} 
    ]}
        
    ]


const Approutes = () =>{

    const route = useRoutes(routes)

    return route
}

export default Approutes