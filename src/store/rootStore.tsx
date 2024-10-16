import { createContext , useContext} from 'react';
import AlertStore from './alertStore';
import AuthStore from './authStore';


if(import.meta.env.NODE_ENV === "development"){
    import('mobx-logger').then(({ enableLogging }) => {
        enableLogging();
    }).catch((error) => {
        console.error('Failed to load mobx-logger:', error);
    });
   
}


export interface IRootStore{

    handleError: Function;
    alertStore: AlertStore;
    authStore: AuthStore;
}

export  class RootStore implements IRootStore{

    alertStore: AlertStore;
    authStore: AuthStore;
    constructor() {
        console.log("RootStore");
         this.alertStore = new AlertStore(this);
         this.authStore = new AuthStore(this)
    }
    public handleError = (errorCode: number | null = null, errorMessage: string, errorData: any) =>{
        console.error('Error Data:', errorData);
        if(errorCode === 403){
          //  this.authStore.setIsAuthenticated(false)
            return null;
        };

         this.alertStore.open(
           {status: 'error', 
            message: errorMessage
            } )
    }
}

const rootStoreContext = createContext(
    {
        rootStore: new RootStore()
    }
)
export const useStore  = () => useContext(rootStoreContext)