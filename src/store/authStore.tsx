import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
export default class AuthStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/auth';

    isAuthenticated: boolean = false;
    token: string|null = null;
    rootStore: IRootStore;
    constructor(rootStore: IRootStore){
        makeObservable(this, {
            isAuthenticated: observable,
            token: observable,
            setIsAuthenticated: action,
            setToken: action,
            login: action,
            logout: action
        });
        this.rootStore = rootStore
    }
    setIsAuthenticated = (value: boolean) => {
            this.isAuthenticated = value;
            if(!value) this.setToken(null);
    }
    setToken = (value: string | null) => {
            if (value) {
                localStorage.setItem("_token", value);
            } else{
                localStorage.removeItem("_token");
            }
             this.token = value;
    }
    
  

    login = async (postData: any) => {
        
        try {
            // Effectuer une requête POST avec axios
            const response = await axios.post(this.BASE_URL + '/login', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("HTTP Status:", response.status); // Log du statut HTTP
    
            // Vérifier la présence d'erreurs dans la réponse
            const data = response.data;
            console.log(data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));

            } else {
                this.setIsAuthenticated(true);
                this.setToken(data.access_token);
                return Promise.resolve("Connexion réussie !");
            }
    
        } catch (error: any) {
            if (error.response) {
                // Si l'erreur est liée à la réponse HTTP
                console.error("HTTP Error: ", error.response.status, error.response.statusText);
                this.rootStore.handleError(error.response.status, error.response.data.message, error.response.data);
                return Promise.reject(new Error(error.data.message));
            } else if (error.request) {
                // Si la requête a été envoyée mais aucune réponse n'a été reçue
                console.error("No response received from the server", error.request);
                return Promise.reject(new Error("Pas de réponse du serveur"));
            } else {
                // Erreur dans la configuration de la requête ou autre
                console.error("Login Error:", error.message);
                return Promise.reject(new Error("Erreur de connexion")); 
            }
    
             //this.rootStore.handleError(419, "something goes wrong", error);
        }
    }
    logout = async () => {
        try {
            if (!this.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.post(this.BASE_URL + '/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);
    
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            } else {
                this.setIsAuthenticated(false); // Set to false after logout
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Logout Error:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    
}
