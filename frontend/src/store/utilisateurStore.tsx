import { makeObservable, observable, action } from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, ListItemButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { Cancel, CheckCircle, Pause, Visibility } from '@mui/icons-material';

export default class utilisateurStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/users';
    rootStore: IRootStore;
    rowData: GridRowsProp[] = [];

    columns: GridColDef[] = [
        { field: 'prenom', headerName: 'Prenom', width: 150 },
        { field: 'nom', headerName: 'Nom', width: 150 },
        { field: 'telephone', headerName: 'Telephone', width: 150, },
        { field: 'email', headerName: 'Email', width: 300, },
        { field: 'adresseSGF', headerName: 'Adresse', width: 200, },
        { field: 'poste', headerName: 'Poste', width: 250, },
        { field: 'matricule', headerName: 'Matricule', width: 150, },
        {
            field: 'etat', headerName: 'Etat',
            width: 70, renderCell: (params) => {
                return params.row.etat === 1 ? (
                    <CheckCircle color="success" />
                ) : (
                    <Cancel color="error" />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    {params.row.etat === 1 ? ( // Si l'utilisateur est actif
                        <Tooltip title="Suspendre l'utilisateur">
                            <IconButton onClick={() => this.suspendUser(params.row.idUser)}>
                                <Pause color="error" /> {/* Icône Pause au lieu de Block */}
                            </IconButton>
                        </Tooltip>
                    ) : ( // Si l'utilisateur est suspendu
                        <Tooltip title="Réactiver l'utilisateur">
                            <IconButton onClick={() => this.reactivateUser(params.row.idUser)}>
                                <Visibility color="success" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Editer l'utilisateur">
                        <ListItemButton sx={{ width: 'auto' }} component={Link} to={`edit/${params.row.idUser}`}>
                            <EditIcon color='success' />
                        </ListItemButton>
                    </Tooltip>
                    <Tooltip title="Supprimer l'utilisateur">
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
            userLists: action,
            setRowData: action,
            createData: action,
            getData: action,
            updateData: action
        });
        this.rootStore = rootStore
    }

    userLists = async () => {
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
            console.log("Les donnees de l\'utilisateurs", response.data.data.users);
            const data = response.data;

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {

                this.setRowData(response.data.data.users);

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
            const response = await axios.post(this.BASE_URL + '/creat', postData, {
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
                this.rootStore.alertStore.open({ status: 'error', message: data.message })
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            } else {
            
                this.rootStore.showNotification('success', 'Utilisateur creer avec succès!')
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

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));

            } else {
                return response.data
            }

        } catch (error: any) {
            this.rootStore.handleError(419, 'something went wrong', error)
        }
    }
    updateData = async (idUser: number | string, postData: any) => {
        postData.idUser = idUser;
        try {
            const response = await axios.put(`${this.BASE_URL}/${idUser}`, postData, {
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

                this.rootStore.showNotification('success', 'Utilisateur mis a jour avec succès!')
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error("Erreur :", error);
            this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
            return { success: false, message: 'Une erreur est survenue lors de la mise à jour.' };
        }
    }

    setRowData(values: GridRowsProp[]) {
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
    //            this.userLists();
    //             return Promise.resolve(data);
    //         }
    //     } catch (error: any) {
    //         this.rootStore.handleError(419,"something went wrong",error)
    //     }
    // }
    deleteDialog = async (params: any) => {
        console.log('deleteDialog called with:', params);

        // Essayer d'accéder à l'ID de l'utilisateur
        const userId = params.row.idUser; // Ajuste si nécessaire
        console.log('User ID:', userId);

        this.rootStore.dialogStore.openDialog({
            confirm: async () => {
                console.log('Confirmation action triggered');
                // Filtrer la ligne supprimée sans toucher à la base de données
                const updatedRowData = this.rowData.filter((row: any) => row.idUser !== userId);

                // Mettre à jour les données affichées
                this.setRowData(updatedRowData);

                // Afficher une notification de succès

                this.rootStore.showNotification('success', 'Utilisateur retiré de l\'affichage avec succès!');

                // Fermer la boîte de dialogue après la confirmation
                this.rootStore.dialogStore.closeDialog();
            },
            dialogText: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        });
    };
    getlist = async (postData: any) => {
        try {

            const response = await axios.post(this.BASE_URL + '/getList', postData, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("HTTP Status:", response.status);

            const data = response.data;
            console.log(data)
            if (data.error) {

                this.rootStore.handleError(response.status, data.message, data);

                return Promise.reject(new Error(data.message));

            } else {
                return Promise.resolve(data.data.users);
            }

        } catch (error: any) {
            this.rootStore.handleError(419, 'something went wrong', error)
        }
    }
    suspendUser = async (id: number | string) => {
        // Vérification de l'ID
        if (typeof id !== 'number' && typeof id !== 'string') {
            console.error('ID utilisateur non valide');
            return;
        }

        console.log("ID utilisateur :", id); // Vérifie si l'ID est correct

        const url = `${this.BASE_URL}/suspend/${id}`;
        console.log("URL de la requête :", url); // Log de l'URL

        try {
            const response = await axios.put(url, {}, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("HTTP Status:", response.status);
            const data = response.data;

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            } else {

                this.rootStore.showNotification('success', 'Utilisateur suspendu avec succès!')
                await this.userLists();
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error('Erreur lors de la suspension:', error.response?.data || error.message);

            this.rootStore.showNotification('error', 'Erreur lors de la suspension de l\'utilisateur.')
            this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
        }
    };

    reactivateUser = async (id: number | string) => {
        try {
            // Requête PUT pour changer l'état de l'utilisateur à 1 (réactiver)
            const response = await axios.put(`${this.BASE_URL}/reactivate/${id}`, { etat: 1 }, {
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
            } else {

                this.rootStore.showNotification('success', 'Utilisateur reactiver avec succès!');
                this.userLists(); // Met à jour la liste des utilisateurs
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error("Erreur de réactivation:", error);
            this.rootStore.showNotification('error', 'Erreur lors de la reactivation de l\'utilisateur.')
            this.rootStore.handleError(500, error.message || "Une erreur est survenue", error);
        }
    }

}