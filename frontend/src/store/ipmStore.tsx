import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import {GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box,  ListItemButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Visibility } from '@mui/icons-material';

export default class IpmStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/ipm-sgf';
    rootStore: IRootStore;
    rowData: GridRowsProp[] = [];
    columns: GridColDef[] = [
        
        { field: 'nb_agents', headerName: 'Nb agents', width: 150 },
        { field: 'nb_de_mois', headerName: 'Nb de mois', width: 150 },
        { field: 'cotisation_adherant', headerName: 'Cotisation adherant', width: 150, },
        { field: 'cotisation_employeur', headerName: 'Cotisation employeur', width: 300, },
        { field: 'total_cotisations', headerName: 'Cotisation Total', width: 200, },
        { 
            field: 'actions', 
            headerName: 'Action', 
            width: 200, 
            sortable: false, 
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                 <Tooltip title="Visualiser la  facture">
                        <ListItemButton sx={{ width: 'auto' }} component={Link} to={`detail/${params.row.id}`}>
                            <Visibility color='success' />
                        </ListItemButton>
                    </Tooltip>
                <Tooltip title="Editer ipm">
                <ListItemButton sx={{ width: 'auto' }} component={Link} to={`edit/${params.row.id}`}>
                  <EditIcon color='success'/>
                </ListItemButton>
                </Tooltip>
                <Tooltip title="Supprimer ipm">
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
           listIpm: action,
           setRowData: action,
           createData: action,
           getData: action,
           updateData: action
        });
        this.rootStore = rootStore
    }
    
    listIpm = async () => {
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
            console.log("Les donnees d'ipms", response.data.data);
            const data = response.data;
            
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {

                this.setRowData(response.data.data);
                return Promise.resolve(data.data);
            }
        } catch (error: any) {
            console.error("Erreur de recuperation:", error);
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
            
            console.log("HTTP Status:", response.data);
            const data = response.data;
            console.log("Response Data:", data);
            
            if (data.error) {
                this.rootStore.alertStore.open( {status: 'error',  message: data.message } )
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            }else{
                // toast.success('Ipm creer avec succès!', {
                //     position: "top-center", // Affichage au milieu en haut
                //     autoClose: 5000,        // Ferme la notification automatiquement après 5 secondes
                //     hideProgressBar: false, // Affiche la barre de progression
                //     closeOnClick: true,     // La notification se ferme si on clique dessus
                //     draggable: true,        // Permet de glisser pour fermer la notification
                //     progress: undefined,
                //     style: {
                //         marginTop: '50px' // Ajuste cette valeur pour descendre la notification
                //       },   // Permet de garder la progression par défaut
                //   });
                  this.rootStore.showNotification('success','Ipm creer avec succès!');
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
            console.log('Data ipm:', data);
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
        postData.id = id;
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
                return Promise.reject(data);
            }else{
                toast.success('Ipm mis a jour avec succès!', {
                    position: "top-center", // Affichage au milieu en haut
                    autoClose: 5000,        // Ferme la notification automatiquement après 5 secondes
                    hideProgressBar: false, // Affiche la barre de progression
                    closeOnClick: true,     // La notification se ferme si on clique dessus
                    draggable: true,        // Permet de glisser pour fermer la notification
                    progress: undefined,
                    style: {
                        marginTop: '50px' // Ajuste cette valeur pour descendre la notification
                    },   // Permet de garder la progression par défaut   // Permet de garder la progression par défaut
                });
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
    //     const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    //     const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;
    //     try {
    //         const response = await axios.delete(`${this.BASE_URL}/${id}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${this.rootStore.authStore.token}`,
    //                 'Content-Type': 'application/json',
    //                 'X-CSRF-TOKEN': csrfToken
    //             },
    //         });
            
    //         console.log("HTTP Status:", response.status);
    //         const data = response.data;
    //         console.log("Response Data:", data);
            
    //         if (data.error) {
    //             this.rootStore.handleError(response.status, data.message, data);
    //             return Promise.reject(data);
    //         }else{
    //             this.setRowData(this.rowData.filter(
    //                 (e:any)=> e.idUser != e.id))
    //             this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
    //            this.listIpm();
    //             return Promise.resolve(data);
    //         }
    //     } catch (error: any) {
    //         this.rootStore.handleError(419,"something went wrong",error)
    //     }
    // }
    deleteDialog = async (params: any) => {
        console.log('deleteDialog called with:', params);
    
        // Essayer d'accéder à l'ID de l'utilisateur
        const ipmId = params.row.id; // Ajuste si nécessaire
        console.log('Ipm ID:', ipmId);
    
        this.rootStore.dialogStore.openDialog({
            confirm: async () => {
                console.log('Confirmation action triggered');
                // Filtrer la ligne supprimée sans toucher à la base de données
                const updatedRowData = this.rowData.filter((row: any) => row.idUser !== ipmId);
                // Mettre à jour les données affichées
                this.setRowData(updatedRowData);
                // Afficher une notification de succès
                // toast.success('Ipm retiré de l\'affichage avec succès!', {
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
                this.rootStore.showNotification('success','Ipm retiré de l\'affichage avec succès!')
                // Fermer la boîte de dialogue après la confirmation
                this.rootStore.dialogStore.closeDialog();
            },
            dialogText: "Êtes-vous sûr de vouloir supprimer cet ipm ?"
        });
    };
    
}