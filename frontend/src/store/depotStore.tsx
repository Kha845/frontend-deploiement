import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import {GridColDef,GridValidRowModel } from '@mui/x-data-grid';

export default class DepotStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/stockeurs';
    rootStore: IRootStore;
    rowData: GridValidRowModel[] = []; 

    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50},
        { field: 'nom', headerName: 'Nom', width: 600 },
        { field: 'adresse', headerName: 'Adresse', width: 580, },
    ];

    constructor(rootStore: IRootStore){
        makeObservable(this, {
           rowData: observable,
           columns: observable,
           depotsList: action,
           setRowData: action,
        });
        this.rootStore = rootStore
    }
    
    depotsList = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/depots', {
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

                this.setRowData(response.data);

                return Promise.resolve(data.message);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    setRowData(data: any) {
        if (Array.isArray(data.data)) {
            this.rowData = data.data.map((d:any) => ({
                id: d.id,
                nom: d.nom,
                adresse: d.adresse,
            }));
        } else {
            console.error('Expected data to be an array, but got:', data);
            this.rowData = []; // ou un tableau vide pour éviter des erreurs
        }
    }    

}