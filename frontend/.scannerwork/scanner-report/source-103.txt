import {makeObservable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
export default class DotStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/dashboard-dot';
    rootStore: IRootStore;

    constructor(rootStore: IRootStore){
        makeObservable(this, {
           getDataLastInputStockIndustriel:action,
           getDataLastMonthInputStockIndustriel: action,
           getDataLastInputStockCommercial: action,
           getDataLastMonthInputStockCommercial: action,
           getDataLastMonthOutputStock: action,
           getDataLastMonthStateStock: action,
           getDataLastOutputStock: action,
           getDataLastStateStock: action,
        });
        this.rootStore = rootStore
    }
    
    getDataLastInputStockIndustriel = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/dernier-quantite-industriel', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('La derniere entree stock' , response.data)
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
    getDataLastMonthInputStockIndustriel = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/entrees-industrielles-mois', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Tout les entrees industriel d\'un mois' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data.data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataLastInputStockCommercial = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/dernier-quantite-commercial', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les dernieres entre commercial ' , response.data)
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
    getDataLastMonthInputStockCommercial = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/entrees-commercial-mois', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('reponse ' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data.data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation des donnees:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataLastOutputStock = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/derniere-sortie-stock', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('La derniere sortie de stock a senStock ' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation des donnees de sortie de dot:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataLastMonthOutputStock = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/sortie-stock-mois', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les donnees de sortie d\'hydrocarbure pour un mois ' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data.data);
            }
        } catch (error: any) {
            console.error("Erreur de recuperation des donnes de sortie d'hydrocarburant du mois precedent:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataLastStateStock = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/derniere-sortie-stock', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('La derniere sortie de stock au stockeur dot ' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data.data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation des donnees de sortie de dot:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataLastMonthStateStock = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/etat-stock', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
       
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('Les donnees d\'etat de stock' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperations des donnees d'etat de stock:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    getDataLastRecord = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/etat-stock', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("HTTP Status:", response.status);
            const data = response.data;
    
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            }
    
            // Vérifier si les données sont présentes
            if (!data || (!data.quantites_entrees && !data.quantites_sorties && !data.quantites_initiales)) {
                console.warn("Données d'état de stock absentes ou mal structurées.");
                return null;
            }
    
            // Fonction utilitaire pour récupérer le dernier élément basé sur la date
            const getLastRecord = (records: any[]) => {
                if (!Array.isArray(records) || records.length === 0) return null;
                return records.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            };
    
            // Récupérer les derniers enregistrements pour chaque catégorie
            const lastEntree = getLastRecord(data.quantites_entrees);
            const lastSortie = getLastRecord(data.quantites_sorties);
            const lastInitiale = getLastRecord(data.quantites_initiales);
    
            // Structurer les données finales pour affichage ou traitement
            const result = {
                derniereEntree: lastEntree
                    ? {
                          date: lastEntree.date,
                          format: lastEntree.format,
                          quantiteGazoil: lastEntree.quantite_gazoil_entree || 0,
                          quantiteSuper: lastEntree.quantite_super_entree || 0,
                          quantiteDiesel: lastEntree.quantite_diesel_entree || 0,
                          temperature: lastEntree.temperature_initial || null,
                          uniteDeMesure: lastEntree.uniteDeMesure || null,
                      }
                    : null,
                derniereSortie: lastSortie
                    ? {
                          date: lastSortie.date,
                          quantiteGazoil: lastSortie.quantite_gazoil_sortie || 0,
                          quantiteDiesel: lastSortie.quantite_diesel_sortie || 0,
                          quantiteSuper: lastSortie.quantite_super_sortie || 0,
                          uniteDeMesure: lastEntree.uniteDeMesure || null,
                      }
                    : null,
                derniereInitiale: lastInitiale
                    ? {
                        date: lastInitiale.date,
                        quantiteGazoil: lastInitiale.quantite_gazoil_initiale || 0,
                        quantiteDiesel: lastInitiale.quantite_diesel_initiale || 0,
                        quantiteSuper: lastInitiale.quantite_super_initiale || 0,
                        temperature: lastInitiale.temperature_final || null,
                        uniteDeMesure: lastInitiale.uniteDeMesure || null,
                      }
                    : null,
            };
    
            console.log("Données traitées :", result);
    
            return result;
    
        } catch (error: any) {
            console.error("Erreur lors de la récupération des données :", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
            return null;
        }
    };
    
}