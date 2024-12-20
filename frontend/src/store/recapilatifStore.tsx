import {makeObservable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
export default class RecapilatifStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/dashboard-recapitulatif';
    rootStore: IRootStore;

    constructor(rootStore: IRootStore){
        makeObservable(this, {
            getDataFacturePaye:action,
            getDataFactureImpayee: action,
            getDataPayeePartiellement: action,
            getDataPaiementEnCours: action,
        });
        this.rootStore = rootStore
    }
    
    getDataFacturePaye = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/facture-payee', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les factures payees' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de création:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataFactureImpayee = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/facture-impayee', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les factures impayees' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataPayeePartiellement = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/facture-payee-partiellement', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les factures payee partiellement' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation des donnees:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataPaiementEnCours = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/facture-payee-en-cours', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les factures de paiement en cours' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation des donnees:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }

}