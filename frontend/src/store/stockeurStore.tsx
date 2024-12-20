/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeObservable, observable, action } from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import { GridRowsProp, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { Box, ListItemButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default class StockeurStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/stockeurs';
    rootStore: IRootStore;
    rowData: GridValidRowModel[] = []; 
    
    columns: GridColDef[] = [
        { field: 'nom', headerName: 'Nom', width: 250 },
        { field: 'telephone', headerName: 'Telephone', width: 150 },
        { field: 'adresse', headerName: 'Adresse', width: 250 },

        {
            field: 'actions',
            headerName: 'Action',
            width: 250,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Tooltip title="Editer stockeur">
                        <ListItemButton sx={{ width: 'auto' }} component={Link} to={`edit/${params.row.idStokeur}`}>
                            <EditIcon color='success' />
                        </ListItemButton>
                    </Tooltip>
                    <Tooltip title="Supprimer stockeur">
                        <ListItemButton onClick={() => this.deleteDialog(params)}>
                            <DeleteIcon className='text-red-600' />
                        </ListItemButton>
                    </Tooltip>
                </Box>
            )
        },
    ];
    constructor(rootStore: IRootStore) {
        makeObservable(this, {
            rowData: observable,
            columns: observable,
            stockeursList: action,
            setRowData: action,
            createData: action,
            getData: action,
            updateData: action,
            // deleteData: action
        });
        this.rootStore = rootStore;
    }

    stockeursList = async () => {
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
            const data = response.data.data;
            console.log('Les données du stockeur et ses depots', response.data);
            
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                 // Vérifiez que les données contiennent le tableau attendu
                if (Array.isArray(data)) {
                    this.setRowData(data); // Passez le tableau `data` à setRowData
                } else {
                    console.error("Expected data to be an array, but got:", data);
                }
                return Promise.resolve(data);
            }

        } catch (error: any) {
            console.error("Erreur lors de la récupération des camions:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
        }
    }

    createData = async (postData: any) => {
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;        

        try {
            const response = await axios.post(this.BASE_URL + '/creat', postData, {
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
            } else {
                this.rootStore.showNotification('success','Stockeur créé avec succès!');
                return Promise.resolve(data);
            }

        } catch (error: any) {
            if (error.response) {
                console.error("Erreur Axios Response:", error.response.data);
                const serverMessage = error.response.data.message || 'Une erreur est survenue lors de la requête.';
                this.rootStore.handleError(error.response.status, serverMessage, error.response.data);
                return Promise.reject(serverMessage);
            } else if (error.request) {
                console.error("Erreur Axios Request:", error.request);
                this.rootStore.handleError(500, "Aucune réponse du serveur", error.request);
                return Promise.reject('Aucune réponse du serveur.');
            } else {
                console.error("Erreur Axios:", error.message);
                // toast.error('Erreur de création de stockeur!', {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     draggable: true,
                //     style: {
                //         marginTop: '50px'
                //     },
                // });
                this.rootStore.showNotification('error','Erreur de création de stockeur!');
                this.rootStore.handleError(500, error.message, error);
                return Promise.reject(error.message);
            }
        }
    }

    getData = async (id: number | string) => {
        try {
            const response = await axios.get(`${this.BASE_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log(response.data);
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                return response.data;
            }

        } catch (error: any) {
            this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
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
                return Promise.reject(data);
            } else {
                this.rootStore.alertStore.open({ status: 'success', message: data.message });
                // toast.success('Stockeur mis à jour avec succès!', {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     draggable: true,
                //     style: {
                //         marginTop: '50px'
                //     },
                // });
               
                this.rootStore.showNotification('success','Stockeur mis à jour avec succès!');
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
        }
    }

    // deleteData = async (id: number) => {
    //     try {
    //         const response = await axios.delete(`${this.BASE_URL}/${id}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${this.rootStore.authStore.token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         console.log("HTTP Status:", response.status);
    //         const data = response.data;

    //         if (data.error) {
    //             this.rootStore.handleError(response.status, data.message, data);
    //             return Promise.reject(data);
    //         } else {
    //             toast.success('Stockeur supprimé avec succès!', {
    //                 position: "top-center",
    //                 autoClose: 5000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 draggable: true,
    //                 style: {
    //                     marginTop: '50px'
    //                 },
    //             });
    //             return Promise.resolve(data);
    //         }
    //     } catch (error: any) {
    //         console.error("Erreur lors de la suppression:", error);
    //         this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
    //     }
    // }

    setRowData(data: any) {
        if (Array.isArray(data)) {
            this.rowData = data.map(s => ({
                idStokeur: s.idStokeur,
                nom: s.nom,
                telephone: s.telephone,
                adresse: s.adresse,
                depots: s.depots,
            }));
        } else {
            console.error('Expected data to be an array, but got:', data);
            this.rowData = []; // ou un tableau vide pour éviter des erreurs
        }
    }    
    deleteDialog = async (params: any) => {
        console.log('deleteDialog called with:', params);
    
        // Essayer d'accéder à l'ID du camion
        const stockeurId = params.row.idStokeur; // Ajuste si nécessaire
        console.log('Stockeur ID:', stockeurId);
    
        this.rootStore.dialogStore.openDialog({
            confirm: async () => {
                console.log('Confirmation action triggered');
                // Filtrer la ligne supprimée sans toucher à la base de données
                const updatedRowData = this.rowData.filter((row: any) => row.id !== stockeurId);
            
                // Mettre à jour les données affichées
                this.setRowData(updatedRowData);
            
                // Afficher une notification de succès
                // toast.success('Stockeur retiré de l\'affichage avec succès!', {
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
                this.rootStore.showNotification('success','Stockeur retiré de l\'affichage avec succès!')
                // Fermer la boîte de dialogue après la confirmation
                this.rootStore.dialogStore.closeDialog();
            },
            dialogText: "Êtes-vous sûr de vouloir supprimer cet stockeur ?"
        });
    };
}
