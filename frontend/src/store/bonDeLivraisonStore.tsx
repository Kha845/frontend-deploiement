import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios , {AxiosResponse} from 'axios';
import {GridColDef } from '@mui/x-data-grid';
import { Box, ListItemButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link} from 'react-router-dom';
interface BonDeLivraisonRow {
    id: number;
    destinataire: string;
    designations: string; // On suppose que "designations" est une chaîne JSON
    UniteDeMesure: string;
    numeroBonDeLivraison: number;
}
export default class BonDeLivraisonStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/bons-de-livraison';
    rootStore: IRootStore;
    rowData: BonDeLivraisonRow[] = [];

    private parseDesignations = (designations: string): any[] =>{
        try {
            const parsed = JSON.parse(designations);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Erreur de parsing de designations:', e);
            return [];
        }
    }
    renderDesignations = (params: any): string => {
        const designations = this.parseDesignations(params.row.designations);
        return designations.map((item: { designation: string }) => item.designation).join(', ');
    };
    
    renderQuantite = (params: any): string => {
        const designations = this.parseDesignations(params.row.designations);
        return designations.map((item: { quantite: number }) => item.quantite).join(', ');
    };
    
    
    renderActions = (params: any) => {
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                <Tooltip title="Editer bon de livraison">
                    <ListItemButton sx={{ width: 'auto' }} component={Link} to={`edit/${params.row.id}`}>
                        <EditIcon color="success" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Supprimer bon de livraison">
                    <ListItemButton onClick={() => this.deleteDialog(params)}>
                        <DeleteIcon className="text-red-600" />
                    </ListItemButton>
                </Tooltip>
            </Box>
        );
    };
    private notify= (type: 'success' | 'error', message: string): void =>{
        this.rootStore.showNotification(type, message);
    }
    private  makeRequest = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any,csrfToken?:string | null): Promise<AxiosResponse<any>> => {
        const headers = {
            'Authorization': `Bearer ${this.rootStore.authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        };
        return  axios({ method, url, data, headers });
    }
    
    columns: GridColDef[] = [
        { field: 'destinataire', headerName: 'Destinataire', width: 200 },
        {
            field: 'designations', headerName: 'Designation', width: 400,
            renderCell:  this.renderDesignations 
        },
        {
            field: 'quantite', headerName: 'Quantite', width: 250,
            renderCell: this.renderQuantite
        },
        { field: 'UniteDeMesure', headerName: 'Unite de mesure', width: 150, },
        { field: 'numeroBonDeLivraison', headerName: 'N BL', width: 100, },
        { 
            field: 'actions', 
            headerName: 'Action', 
            width: 200, 
            sortable: false, 
            filterable: false,
            renderCell: this.renderActions,}
        
    ];
    constructor(rootStore: IRootStore){
        makeObservable(this, {
           rowData: observable,
           columns: observable,
           bonDeLivraisonLists:action,
        
           setRowData: action,
           createData: action,
           getData: action,
           updateData: action,
           deleteDialog: action
        });
        this.rootStore = rootStore;
       
    }
    bonDeLivraisonLists = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
            const response = await this.makeRequest('get',this.BASE_URL + '/list');
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('les donnees de livraison' , response.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {

                this.setRowData(response.data.data);
                return Promise.resolve(data);
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
            const response = await this.makeRequest('post',this.BASE_URL+'/creat', postData,csrfToken);
            // const response = await axios.post(this.BASE_URL+'/creat', postData, {
            //     headers: {
            //         'Authorization': `Bearer ${this.rootStore.authStore.token}`,
            //         'Content-Type': 'application/json',
            //         'X-CSRF-TOKEN': csrfToken
            //     },
            // });
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);
            
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            }else{
                this.notify('success','Bon de livraison cree avec succès!');
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
                return Promise.reject(error.message ||'Aucune réponse du serveur.');
            } else {
                console.error("Erreur Axios:", error.message);
                this.notify('error','Erreur de creation de bon de livraison!');
                // this.rootStore.showNotification('error','Erreur de creation de bon de livraison!')
                // toast.error('Erreur de creation de bon de livraison!', {
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
                this.rootStore.handleError(500, error.message, error);
                return Promise.reject(error.message || 'Aucune réponse du serveur.');
            }
        }
    }
    getData = async (id: number | string ) =>{
                    try {
                        const response = await this.makeRequest('get',`${this.BASE_URL}/${id}`);
                        // const response = await axios.get(`${this.BASE_URL}/${id}`, {
                        //     headers: {
                        //         'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                        //         'Content-Type': 'application/json',
                        //     },
                        // });
                        console.log("HTTP Status:", response.status);

                        const data = response.data;
                        console.log(response.data)
                        if (data.error) {
                            this.rootStore.handleError(response.status, data.message, data);
                            throw new Error(data.message); // Ajoutez un rejet explicite ici
                        } else {
                            return response.data;
                        }
                    } catch (error: any) {
                        if (error.response && error.response.status === 500) {
                            this.rootStore.handleError(500, 'Erreur serveur', error.response.data);
                            throw new Error('Erreur serveur'); // Rejet avec le message attendu
                        }
                        this.rootStore.handleError(419, 'something went wrong', error);
                        throw new Error('something went wrong');
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
                            this.rootStore.showNotification('success','Bon de livraison mis a jour avec  avec succès!')
                            return Promise.resolve(data);
                        }
                    } catch (error: any) {
                        console.error("Erreur :", error);
                        this.rootStore.showNotification('error','Erreur lors de la mise à jour!')
                            throw {
                                error: true,
                                message: error.response?.data?.message || "Erreur lors de la mise à jour!",
                            };
                            
                    }
    }
    setRowData(values: BonDeLivraisonRow[]){
        this.rowData = values;
    }
    deleteDialog = async (params: any) => {
        try {
            console.log('deleteDialog called with:', params);
            
            if (!params || !params.row || !params.row.id) {
                console.error('Invalid params passed to deleteDialog');
                return;
            }
    
            const bonDeLivraisonId = params.row.id;
            console.log('Bon de livraison ID:', bonDeLivraisonId);
    
            this.rootStore.dialogStore.openDialog({
                confirm: async () => {
                    const updatedRowData = this.rowData.filter((row: any) => row.id !== bonDeLivraisonId);
    
                    if (updatedRowData.length === this.rowData.length) {
                        console.error('No matching Bon de livraison found for deletion');
                        this.rootStore.showNotification('error', 'Aucune ligne trouvée à supprimer.');
                        return;
                    }
    
                    this.setRowData(updatedRowData);
                    this.rootStore.showNotification('success', 'Bon de livraison retiré de l\'affichage avec succès!');
                    this.rootStore.dialogStore.closeDialog();
                },
                dialogText: "Êtes-vous sûr de vouloir supprimer cet bon de livraison ?",
            });
        } catch (error) {
            console.error('Error in deleteDialog:', error);
            this.rootStore.showNotification('error', 'Une erreur est survenue lors de la suppression du bon de livraison.');
        }
    };    
  
}