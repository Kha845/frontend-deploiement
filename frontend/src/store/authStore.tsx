import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';

export default class AuthStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/auth';
    userInfo: { prenom: string; nom: string; roles: string[] } | null = null;
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
            console.log("Attempting login with data:", postData); // Pour voir les données envoyées
    
            // Effectuer une requête POST avec axios
            const response = await axios.post(this.BASE_URL + '/login', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("HTTP Status:", response.status); // Log du statut HTTP
            console.log("Full Response:", response);      // Log de la réponse complète
    
            // Vérifier la présence d'erreurs dans la réponse
            const data = response.data;
            if (data && data.user) {
                const { prenom, nom, roles } = data.user; // Récupérer le tableau de rôles
                this.userInfo = { prenom, nom, roles }; // Mettre à jour userInfo
            } else {
                console.error('Les informations utilisateur sont manquantes dans la réponse API');
            }
            
            if (data.error) {
                console.log("Error in response:", data.error); // Log de l'erreur s'il y en a
                this.rootStore.handleError(response.status, data.error, data);
                return Promise.reject(new Error(data.error));
            } else {
                console.log("Login successful:", data);
                this.setIsAuthenticated(true);
                this.setToken(data.access_token); // Assurez-vous que `access_token` est bien renvoyé
                return Promise.resolve("Connexion réussie !");
            }
    
        } catch (error: any) {
            if (error.response) {
                console.error("HTTP Error:", error.response.status, error.response.statusText);
                this.rootStore.handleError(error.response.status, error.response.data.message, error.response.data);
                return Promise.reject(new Error(error.response.data.message)); 
            } else if (error.request) {
                console.error("No response received from the server", error.request);
                return Promise.reject(new Error("Pas de réponse du serveur"));
            } else {
                console.error("Login Error:", error.message);
                return Promise.reject(new Error("Erreur de connexion"));
            }
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
                this.setIsAuthenticated(false);
                this.setToken(null); // Assurez-vous de supprimer le token ici
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error("Logout Error:", error);
            const errorMessage = error.response?.status
                ? `Request failed with status code ${error.response.status}`
                : error.message || "An error occurred";
            const errorStatus = error.response?.status || 500;
            this.rootStore.handleError(errorStatus, errorMessage, error);
        }
    }
    getUserInfo() {
        return this.userInfo;
      }
}
