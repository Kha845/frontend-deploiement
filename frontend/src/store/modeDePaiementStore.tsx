import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import {GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, ListItemButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { Link} from 'react-router-dom';

export default class ModeDePaiementStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/modes-de-paiement';
    rootStore: IRootStore;
    rowData: GridRowsProp[] = [];
    columns: GridColDef[] = [
        { field: 'typePaiement', headerName: 'Type', width: 250 },
        { field: 'date', headerName: 'Date', width: 200, },   
        { field: 'heure', headerName: 'Heure', width: 200, },
        { 
            field: 'actions', 
            headerName: 'Action', 
            width: 200, 
            sortable: false, 
            filterable: false,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                <Tooltip title="Editer mode de paiement">
                <ListItemButton sx={{ width: 'auto' }} component={Link} to={`edit/${params.row.id}`}>
                  <EditIcon color='success'/>
                </ListItemButton>
                </Tooltip>
                <Tooltip title="Supprimer mode de paiement">
                <ListItemButton onClick={() => this.deleteDialog(params)}>
                  <DeleteIcon className='text-red-600'/>
                </ListItemButton>
                </Tooltip>
              </Box>
            )
          },
        
    ];

    constructor(rootStore: IRootStore){
        makeObservable(this, {
           rowData: observable,
           columns: observable,
           modeDePaiementLists:action,
           setRowData: action,
           createData: action,
           getData: action,
           updateData: action
        });
        this.rootStore = rootStore
    }
    
    modeDePaiementLists = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/list', {
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
                this.setRowData(response.data.data);
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de recuperation des donnees:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }

    createData = async (postData: any) => {

        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;        
    
        try {
            const response = await axios.post(this.BASE_URL+'/creat', postData, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
            });
            
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);
            
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            }else{
               
                this.rootStore.showNotification('success','Le mode de paiement cree avec succès!');
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            // Vérifie si l'erreur provient d'Axios et possède une réponse HTTP
            if (error.response) {
                console.error("Erreur Axios Response:", error.response.data);
                // Gérer les erreurs spécifiques retournées par le serveur
                const serverMessage = error.response.data.message || 'Une erreur est survenue lors de la requête.';
                this.rootStore.handleError(error.response.status, serverMessage, error.response.data);
                return Promise.reject(serverMessage);
            } else if (error.request) {
                // Lorsque la requête est envoyée mais qu'aucune réponse n'est reçue
                console.error("Erreur Axios Request:", error.request);
                this.rootStore.handleError(500, "Aucune réponse du serveur", error.request);
                return Promise.reject('Aucune réponse du serveur.');
            } else {
                // Erreur lors de la configuration de la requête
                console.error("Erreur Axios:", error.message);
                // toast.error('Erreur de creation de fournisseur!', {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     draggable: true,
                //     progress: undefined,
                //     style: {
                //         marginTop: '50px'
                //     },
                // });
                this.rootStore.showNotification('error','Erreur de creation de fournisseur!')
                this.rootStore.handleError(500, error.message, error);
                return Promise.reject(error.message);
            }
        }
    }
    

//view

getData = async (id: number | string ) =>{
    try {
        
        const response = await axios.get(`${this.BASE_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("HTTP Status:", response.status);

        const data = response.data;
        console.log(response.data)
        if (data.error) {
            this.rootStore.handleError(response.status, data.message, data);
            return Promise.reject(new Error(data.message));

        } else {
            return response.data
        }

    } catch (error: any) {
        this.rootStore.handleError(419,'something went wrong',error)
    }
}

updateData = async (id: number | string, postData: any) => {
    try {
        const response = await axios.put(`${this.BASE_URL}/${id}`, postData, {
            headers: {
                'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("HTTP Status:", response.status);
        const data = response.data;
        console.log("Response Data:", data);

        if (data.error) {
            this.rootStore.handleError(response.status, data.message, data);
            this.rootStore.alertStore.open( {status: 'error',   message: data.message } )
            return Promise.reject(data);
        }else{
            // this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
            // toast.success('Mode de paiement mis a jour avec  avec succès!', {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     draggable: true,
            //     progress: undefined,
            //     style: {
            //         marginTop: '50px'
            //     },
            // });
            this.rootStore.showNotification('success','Mode de paiement mis a jour avec  avec succès!');
            return Promise.resolve(data);
        }
    } catch (error: any) {
        console.error("Erreur :", error);
        this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
        return { success: false, message: 'Une erreur est survenue lors de la mise à jour.' };
    }
}

setRowData(values: GridRowsProp[]){
        this.rowData = values;
}

// deleteData = async (id: number | string)=>{
//         const csrfMeta = document.querySelector('meta[name="csrf-token"]');
//         const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;
//         try {
//             const response = await axios.delete(`${this.BASE_URL}/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${this.rootStore.authStore.token}`,
//                     'Content-Type': 'application/json',
//                     'X-CSRF-TOKEN': csrfToken
//                 },
//             });
            
//             console.log("HTTP Status:", response.status);
//             const data = response.data;
//             console.log("Response Data:", data);
            
//             if (data.error) {
//                 this.rootStore.handleError(response.status, data.message, data);
//                 return Promise.reject(data);
//             }else{
//                 this.setRowData(this.rowData.filter(
//                     (e:any)=> e.id != e.id))
//                this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
//                this.modeDePaiementLists();
//                 return Promise.resolve(data);
//             }
//         } catch (error: any) {
//             this.rootStore.handleError(419,"something went wrong",error)
//         }
// }
    //delete
deleteDialog = async (params: any) => {
        console.log('deleteDialog called with:', params);
    
        // Essayer d'accéder à l'ID de mode de paiement
        const modeDePaiementId = params.row.id; // Ajuste si nécessaire
        console.log('Bon de commande ID:',  modeDePaiementId);
    
        this.rootStore.dialogStore.openDialog({
            confirm: async () => {
                console.log('Confirmation action triggered');
                // Filtrer la ligne supprimée sans toucher à la base de données
                const updatedRowData = this.rowData.filter((row: any) => row.id !==  modeDePaiementId);
            
                // Mettre à jour les données affichées
                this.setRowData(updatedRowData);
            
                // Afficher une notification de succès
                // toast.success('Mode de paiement retiré de l\'affichage avec succès!', {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     draggable: true,
                //     progress: undefined,
                //     style: {
                //         marginTop: '50px'
                //     },
                // });
                // Fermer la boîte de dialogue après la confirmation
                this.rootStore
                this.rootStore.dialogStore.closeDialog();
            },
            dialogText: "Êtes-vous sûr de vouloir supprimer cet mode de paiement ?"
        });
};

}