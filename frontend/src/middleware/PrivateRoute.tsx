import { observer } from "mobx-react-lite"
import React from "react"
import { Navigate } from "react-router-dom";
import { useStore } from "../store/rootStore";

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute: React.FC<{element: JSX.Element}> = ({element})=>{

   const { rootStore: { authStore } } = useStore()
    
   const isAuthenticated = authStore.isAuthenticated;

    if(!isAuthenticated){
        return <Navigate to="/login" />
    }

    return element
}

export default observer(PrivateRoute)