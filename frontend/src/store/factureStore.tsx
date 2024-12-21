import { makeObservable, observable, action } from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Badge, Box, Button, ListItemButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Cancel, Visibility } from '@mui/icons-material';

import 'jspdf-autotable';
import { Chip } from '@mui/material';

export default class FactureStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/factures';
    rootStore: IRootStore;
    rowData: GridRowsProp[] = [];
    tva = 0.18;
    openMotifDialog = false; // Contrôle l'ouverture du dialog
    motifText = ''; // Contient le texte du motif
    loading = false;
    factureId: string | number | null = null; // ID de la facture à renvoyer
    openDialog = (id: number | string) => {
        this.openMotifDialog = true;
        this.factureId = id;
        console.log('ID de la facture:', id); // Vérifier si l'ID est passé correctement
        console.log('Ouverture du dialog:', this.openMotifDialog); // Vérifie l'état de l'ouverture du dialog

    };
    closeDialog = () => {
        this.openMotifDialog = false;
        this.motifText = ''; // Réinitialiser le motif lorsque le dialog est fermé
    };
    setMotifText = (text: string) => {
        this.motifText = text;
    };

    columns: GridColDef[] = [
        { field: 'reference', headerName: 'Reference', width: 100 },
        { field: 'status', headerName: 'Status', width: 100 },
        {
            field: 'designations', headerName: 'Designation', width: 200,
            renderCell: (params) => {
                // Vérifier si designations est une chaîne JSON et la parser
                let designations = [];
                try {
                    // On essaie de parser la chaîne JSON en tableau
                    designations = Array.isArray(JSON.parse(params.row.designations)) ? JSON.parse(params.row.designations) : [];
                } catch (e) {
                    // Si une erreur de parsing se produit, on garde un tableau vide
                    console.error('Erreur de parsing de designations:', e);
                }
                return designations.map((item: { designation: string }) => item.designation).join(', ');
            },
        },
        {
            field: 'format', headerName: 'Format', width: 150,
            renderCell: (params) => {
                const format = params.row?.format;
                return format ? format : "-";
            },
        },
        // {
        //     field: 'prixUnitaire', headerName: 'P-Unitaire', width: 100,
        //     renderCell: (params) => {
        //         let designations = [];
        //         try {
        //             designations = Array.isArray(JSON.parse(params.row.designations)) ? JSON.parse(params.row.designations) : [];
        //         } catch (e) {
        //             console.error('Erreur de parsing de designations:', e);
        //         }
        //         return designations.map((item: { prixUnitaire: number }) => item.prixUnitaire.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })).join(', ');
        //     },
        // },
        // {
        //     field: 'volume_ambiant', headerName: 'Quantite volume ambiant', width: 100,
        //     renderCell: (params) => {
        //         let designations = [];
        //         try {
        //             designations = Array.isArray(JSON.parse(params.row.designations)) ? JSON.parse(params.row.designations) : [];
        //         } catch (e) {
        //             console.error('Erreur de parsing de designations:', e);
        //         }
        //         return designations.map((item: { volume_ambiant: number }) => item.volume_ambiant).join(', ');
        //     },
        // },
        // {
        //     field: 'montant', headerName: 'Montant', width: 100,
        //     renderCell: (params) => {
        //         let designations = [];
        //         try {
        //             designations = Array.isArray(JSON.parse(params.row.designations)) ? JSON.parse(params.row.designations) : [];
        //         } catch (e) {
        //             console.error('Erreur de parsing de designations:', e);
        //         }
        //         return designations.map((item: { montant: number }) => item.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })).join(', ');
        //     },
        // },
        // { field: 'montant_total', headerName: 'Total HT', width: 100 },
        // {
        //     field: 'montantTVA', headerName: 'TVA', width: 100,
        //     renderCell: (params) => {
        //         const tva = 0.18;
        //         return (params.row.montant_total * tva);
        //     }
        // },
        // {
        //     field: 'montantTTC', headerName: 'Total TTC', width: 100,
        //     renderCell: (params) => {
        //         const tva = 0.18;
        //         const montantTTC = (params.row.montant_total * tva) + params.row.montant_total;
        //         return montantTTC;
        //     },
        // },
        // { field: 'UniteDeMesure', headerName: 'Unite de mesure', width: 100 },
        { field: 'date', headerName: 'Date', width: 100 },
        {
            field: 'etat',
            headerName: 'État',
            width: 300,
            renderCell: (params) => {
                const etat = params.row.etat;

                switch (etat) {
                    case 'Impayee':
                        return <Chip label="Impayée" color="error" variant="outlined" style={{ fontWeight: 'bold' }} />;
                    case 'Payee Partiellement':
                        return <Chip label="Payée Partiellement" color="warning" variant="outlined" style={{ fontWeight: 'bold' }} />;
                    case 'Payee':
                        return <Chip label="Payée" color="success" variant="outlined" style={{ fontWeight: 'bold' }} />;
                    default:
                        return <Chip label="Inconnu" color="default" variant="outlined" style={{ fontWeight: 'bold' }} />;
                }
            },
        },
        {
            field: 'idModePaiement',
            headerName: 'Mode Paiement',
            width: 200, // Largeur ajustée pour inclure plus de contenu
            renderCell: (params) => {
                // Récupérer les détails des modes de paiement associés
                const modePaiementDetails = params.row?.modesPaiement; // Tableau des modes de paiement

                if (Array.isArray(modePaiementDetails) && modePaiementDetails.length > 0) {
                    // Construire une chaîne combinant typePaiement, date et heure
                    return modePaiementDetails
                        .map((mode) => {
                            // Assurez-vous que les champs existent avant de les utiliser
                            const type = mode.typePaiement || '-';
                            return `${type}`; // Format des détails
                        })
                        .join(', '); // Joindre les modes avec une virgule
                }

                return "-"; // Valeur par défaut si aucun mode n'est trouvé
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 350,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Tooltip title="Visualiser la  facture">
                        <ListItemButton sx={{ width: 'auto' }} component={Link} to={`detail/${params.row.id}`}>
                            <Visibility color='success' />
                        </ListItemButton>
                    </Tooltip>
                    {params.row.status === 'En attente' && ( // Si la facture  est approuvee
                        <Button variant='contained' color='success' onClick={() => this.approuver(params.row.id)}>
                            Approuver
                        </Button>
                    )}
                    {params.row.status === 'En attente' && (
                        <>
                            <Button
                                variant="outlined"
                                style={{ color: 'red' }}
                                onClick={() => this.openDialog(params.row.id)}
                            >
                                Renvoyer
                            </Button>
                        </>
                    )}
                </Box>
            ),
        },
    ];
    columnsEnvoieFacture: GridColDef[] = [
        { field: 'reference', headerName: 'Reference', width: 200 },
        {
            field: 'status',
            headerName: 'Statut',
            width: 80,
            renderCell: (params) => {
                // Si le statut est "rejetée", on ajoute un badge rouge
                if (params.value === 'rejetée') {
                    return (
                        <Badge
                            badgeContent="Rejeté"
                            color="error"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Cancel style={{ color: 'red' }} />
                        </Badge>
                    );
                }
            }
        },
        {
            field: 'designations', headerName: 'Designation', width: 300,
            renderCell: (params) => {
                // Vérifier si designations est une chaîne JSON et la parser
                let designations = [];
                try {
                    // On essaie de parser la chaîne JSON en tableau
                    designations = Array.isArray(JSON.parse(params.row.designations)) ? JSON.parse(params.row.designations) : [];
                } catch (e) {
                    // Si une erreur de parsing se produit, on garde un tableau vide
                    console.error('Erreur de parsing de designations:', e);
                }
                return designations.map((item: { designation: string }) => item.designation).join(', ');
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
                    <Tooltip title="Visualiser la  facture">
                        <ListItemButton sx={{ width: 'auto' }} component={Link} to={`detail/${params.row.id}`}>
                            <Visibility color='success' />
                        </ListItemButton>
                    </Tooltip>
                    <Tooltip title="Recreer la facture facture">
                        <ListItemButton sx={{ width: 'auto' }} component={Link} to={`edit/${params.row.id}`}>
                            <EditIcon color='success' />
                        </ListItemButton>
                    </Tooltip>
                </Box>
            ),
        },
        { field: 'motif', headerName: 'Motif', width: 100 },
    ];
    constructor(rootStore: IRootStore) {
        makeObservable(this, {
            openMotifDialog: observable,
            motifText: observable,
            rowData: observable,
            columns: observable,
            factureLists: action,
            // renderMotifDialog:action,
            setRowData: action,
            createData: action,
            getData: action,
            updateData: action,
            // getListCamions: action,
            // handlePrintInvoice: action,
            // getListBonDeCommande: action,
            getListBonDeLivraison: action,
            getListModeDePaiement: action,
            getListStockeur: action,
            approuver: action,
            renvoyerAvecMotif: action,
            facture_rejetees: action,
            openDialog: action,
            closeDialog: action,
            setMotifText: action,
            factureId: observable,

        });
        this.rootStore = rootStore;
    }
    factureLists = async () => {
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
            console.log('reponse ', response.data)
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
    facture_rejetees = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
            const response = await axios.get(this.BASE_URL + '/facture-rejetees', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log('reponse ', response.data.data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {
                this.setRowData(response.data.data);
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error("Erreur de recuperation de factures rejetes:", error);
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

            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                this.rootStore.alertStore.open({ status: 'error', message: data.message })
                return Promise.reject(data);
            } else {
                // this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
                // Afficher une notification de succès
                this.rootStore.showNotification('success','Facture cree avec  succès');
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
                this.rootStore.showNotification('error','Erreur de creation de fournisseur!');
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
            console.log(response.data)
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
                this.rootStore.alertStore.open({ status: 'error', message: data.message })
                return Promise.reject(data);
            } else {
                // this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
                // toast.success('Facture mis a jour avec  avec succès!', {
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
                this.rootStore.showNotification('success','Facture mis a jour avec  avec succès!');
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
    // deleteData = async (id: number | string) => {
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
    //         } else {
    //             this.setRowData(this.rowData.filter(
    //                 (e: any) => e.id != e.id))
    //             this.rootStore.alertStore.open({ status: 'success', message: data.message })
    //             this.factureLists();
    //             return Promise.resolve(data);
    //         }
    //     } catch (error: any) {
    //         this.rootStore.handleError(419, "something went wrong", error)
    //     }
    // }
    //delete
    deleteDialog = async (params: any) => {
        console.log('deleteDialog called with:', params);

        this.rootStore.dialogStore.openDialog({
            confirm: async () => {
                console.log('Confirmation action triggered');
                // Filtrer la ligne supprimée sans toucher à la base de données
                const updatedRowData = this.rowData.filter((row: any) => row.id !== params.row.id);

                // Mettre à jour les données affichées
                this.setRowData(updatedRowData);

                // Afficher une notification de succès
                toast.success('Facture retiré de l\'affichage avec succès!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                        marginTop: '50px'
                    },
                });

                // Fermer la boîte de dialogue après la confirmation
                this.rootStore.dialogStore.closeDialog();
            },
            dialogText: "Êtes-vous sûr de vouloir supprimer cette facture ?"
        });
    };
    // getListCamions = async () => {
    //     try {
    //         if (!this.rootStore.authStore.token) {
    //             this.rootStore.handleError(401, "Token manquant", {});
    //             return Promise.reject(new Error("Token manquant"));
    //         }

    //         const response = await axios.get(this.BASE_URL + '/camions', {
    //             headers: {
    //                 'Authorization': `Bearer ${this.rootStore.authStore.token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const { data } = response;

    //         if (data.error) {
    //             this.rootStore.handleError(response.status, data.message, data);
    //             return Promise.reject(new Error(data.message));
    //         }

    //         // Extraction des immatricules des camions
    //         if (Array.isArray(data.data)) {
    //             const camions = data.data.map((camion: any) => ({
    //                 id: camion.id,
    //                 immatricule: camion.immatricule
    //             }));
    //             return Promise.resolve(camions);
    //         } else {
    //             console.error("Expected data to be an array, but got:", data.data);
    //             return Promise.reject(new Error("Les données reçues ne sont pas sous forme de tableau."));
    //         }
    //     } catch (error: any) {
    //         console.error("Erreur lors de la récupération des camions:", error);
    //         this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
    //         return Promise.reject(error);
    //     }
    // };
    // handlePrintInvoice = (row: any) => {
    //     console.log('row:', row.id);
    //     // Initialisation de jsPDF
    //     const doc = new jsPDF() as jsPDFWithPlugin;
    //     // Obtenir la largeur du document
    //     const docWidth = doc.internal.pageSize.width;

    //     // Ajouter l'image en haut à gauche
    //     const imgWidth = 20; // largeur de l'image
    //     const imgHeight = 20; // hauteur de l'image
    //     // Calculer la position X pour placer l'image à droite
    //     const xPos = docWidth - imgWidth - 10; // 10 est la marge à partir du bord droit
    //     // Placer l'image à droite
    //     doc.addImage(imageLogo, 'PNG', xPos, 10, imgWidth, imgHeight, 'MEDIUM');

    //     // Définir les informations à afficher dans l'en-tête
    //     const headerText = `
    //     SERIGNE GUEYE & FILS (S.G.F – S.A.R.L)
    //     Siège : Touba Mosquée / Daaray Cheikh Manoumbé
    //     Tél.: (+ 221) 33 975 13 85  Registre du Commerce : 2002-B-1455
    //     Fax : (+ 221) 33 975 02 49  NINEA : 2165365/2G2
    //     BP : 500 – TOUBA  ECOBANK : 06010052801017
    //     E-mail : sgf@sgf.sn
    //     `;

    //     doc.setTextColor(0, 0, 0); // Définit la couleur du texte à noir
    //     doc.setFontSize(10); // Définir la taille de la police
    //     doc.text(headerText, 5, 10, { align: 'left', lineHeightFactor: 1.5 });

    //     // Informations de base en haut (date, émetteur, référence)
    //     doc.setFontSize(10);
    //     doc.text(`Date : ${row.date}`, 14, 70);
    //     doc.text(`Émetteur : ${row.emetteur}`, 14, 75);
    //     doc.text(`Référence : ${row.reference}`, 14, 80);

    //     // Initialisation d'un tableau pour afficher les désignations
    //     const productTable: any[] = [];

    //     // Vérification si `row.designations` est une chaîne JSON ou un objet
    //     let designationsParsed: any = row.designations;

    //     try {
    //         // Si `designations` est une chaîne JSON, nous la transformons en objet
    //         if (typeof designationsParsed === 'string') {
    //             designationsParsed = JSON.parse(designationsParsed);
    //         }
    //     } catch (error) {
    //         console.error('Erreur de parsing JSON pour les designations', error);
    //         designationsParsed = [];
    //     }

    //     // Vérification si `designationsParsed` est un tableau d'objets
    //     if (Array.isArray(designationsParsed)) {
    //         designationsParsed.forEach((designation: any) => {
    //             // Ajout de chaque désignation avec ses informations dans le tableau
    //             productTable.push([
    //                 designation.designation || '',  // Nom de la désignation
    //                 designation.quantite || 0,  // Quantité
    //                 designation.prixUnitaire || 0,  // Prix unitaire
    //                 designation.montant || 0  // Montant
    //             ]);
    //         });
    //     }

    //     // Ajouter le tableau des produits au PDF
    //     doc.autoTable({
    //         head: [['Désignation', 'Quantité', 'Prix Unitaire', 'Montant']],
    //         body: productTable,
    //         startY: 85, // Le tableau commence après les informations de base
    //         theme: 'grid',
    //     });

    //     // Accéder à la position finale du tableau pour y ajouter la tva, ttc,ht
    //     const finalY = (doc as any).lastAutoTable.finalY + 10;
    //     doc.setFontSize(12);

    //     // Texte à afficher pour tva,ttc,ht
    //     const taxText = `TVA  : 18%`;
    //     const amountHtText = `Montant Total (HT) : ${row.montant_total}`;
    //     const amountTTCText = `Montant Total (TTC) : ${(row.montant_total * 0.18) + row.montant_total}`;
    //     const amountTVAText = `Montant TVA : ${(row.montant_total * 0.18)}`;

    //     // Calculer la largeur du texte
    //     const taxTextWidth = doc.getTextWidth(taxText);
    //     const amountHtTextWidth = doc.getTextWidth(amountHtText);
    //     const amountTTCTextWidth = doc.getTextWidth(amountTTCText);
    //     const amountTVATextWidth = doc.getTextWidth(amountTVAText);
    //     // Largeur de la page (en mm)
    //     const pageWidth = doc.internal.pageSize.getWidth();

    //     // Calculer la position X pour aligner le texte à droite
    //     const taxX = pageWidth - taxTextWidth - 10; // Marge de 10px
    //     const amountHtX = pageWidth - amountHtTextWidth - 10; // Marge de 10px
    //     const amountTTCtX = pageWidth - amountTTCTextWidth - 5; // Marge de 10px
    //     const amountTVAX = pageWidth - amountTVATextWidth - 8; // Marge de 10px

    //     // Ajouter le texte aligné à droite pour la TVA et le montant total
    //     doc.text(taxText, taxX, finalY, { align: 'right' });
    //     doc.text(amountHtText, amountHtX, finalY + 20);
    //     doc.text(amountTTCText, amountTTCtX, finalY + 30);
    //     doc.text(amountTVAText, amountTVAX, finalY + 40);
    //     // Enregistrer le PDF avec le nom 'facture_<id>.pdf'
    //     doc.save(`facture_${row.id}.pdf`);
    // };
    getListBonDeLivraison = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject(new Error("Token manquant"));
            }

            const response = await axios.get(this.BASE_URL + '/bons-de-livraison', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const { data } = response;

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            }

            // Extraction des immatricules des camions
            if (Array.isArray(data.data)) {
                const bonDeLivraisons = data.data.map((bonLivraison: any) => ({
                    id: bonLivraison.id,
                    numeroBonDeLivraison: bonLivraison.numeroBonDeLivraison
                }));
                return Promise.resolve(bonDeLivraisons);
            } else {
                console.error("Expected data to be an array, but got:", data.data);
                return Promise.reject(new Error("Les données reçues ne sont pas sous forme de tableau."));
            }
        } catch (error: any) {
            console.error("Erreur lors de la récupération des bons de livraisons:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
            return Promise.reject(error);
        }
    };
    // getListBonDeCommande = async () => {
    //     try {
    //         if (!this.rootStore.authStore.token) {
    //             this.rootStore.handleError(401, "Token manquant", {});
    //             return Promise.reject(new Error("Token manquant"));
    //         }

    //         const response = await axios.get(this.BASE_URL + '/bons-de-commande', {
    //             headers: {
    //                 'Authorization': `Bearer ${this.rootStore.authStore.token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const { data } = response;

    //         if (data.error) {
    //             this.rootStore.handleError(response.status, data.message, data);
    //             return Promise.reject(new Error(data.message));
    //         }

    //         // Extraction des immatricules des camions
    //         if (Array.isArray(data.data)) {
    //             const bonDeCommandes = data.data.map((bonDeCommande: any) => ({
    //                 id: bonDeCommande.id,
    //                 numeroBonDeCommande: bonDeCommande.numeroBonDeCommande
    //             }));
    //             return Promise.resolve(bonDeCommandes);
    //         } else {
    //             console.error("Expected data to be an array, but got:", data.data);
    //             return Promise.reject(new Error("Les données reçues ne sont pas sous forme de tableau."));
    //         }
    //     } catch (error: any) {
    //         console.error("Erreur lors de la récupération des bons de commande:", error);
    //         this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
    //         return Promise.reject(error);
    //     }
    // };
    getListModeDePaiement = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject(new Error("Token manquant"));
            }

            const response = await axios.get(this.BASE_URL + '/modes-de-paiement', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const { data } = response;

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            }
            // Extraction des immatricules des camions
            if (Array.isArray(data.data)) {
                const modesPaiement = data.data.map((modePaiement: any) => ({
                    idModePaiement: modePaiement.id,
                    typePaiement: modePaiement.typePaiement
                }));
                return Promise.resolve(modesPaiement);
            } else {
                console.error("Expected data to be an array, but got:", data.data);
                return Promise.reject(new Error("Les données reçues ne sont pas sous forme de tableau."));
            }
        } catch (error: any) {
            console.error("Erreur lors de la récupération des modes de paiement:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
            return Promise.reject(error);
        }
    };
    getListStockeur = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject(new Error("Token manquant"));
            }

            const response = await axios.get(this.BASE_URL + '/stockeurs', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const { data } = response;

            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            }

            if (Array.isArray(data.data)) {
                console.log('les donnees de stockeur', data.data)
                const stockeurs = data.data.map((stockeur: any) => ({
                    idStokeur: stockeur.idStokeur,
                    nom: stockeur.nom
                }));
                return Promise.resolve(stockeurs);
            } else {
                console.error("Expected data to be an array, but got:", data.data);
                return Promise.reject(new Error("Les données reçues ne sont pas sous forme de tableau."));
            }
        } catch (error: any) {
            console.error("Erreur lors de la récupération des depots:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "Une erreur s'est produite", error);
            return Promise.reject(error);
        }
    };
    // createDataPassageAvecFrais = async (postData: any) => {
    //     const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    //     const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;
    //     try {
    //         const response = await axios.post(this.BASE_URL + '/creat', postData, {
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
    //         } else {
    //             //this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
    //             // Afficher une notification de succès
    //             return Promise.resolve(data);
    //         }

    //     } catch (error: any) {
    //         // Vérifie si l'erreur provient d'Axios et possède une réponse HTTP
    //         if (error.response) {
    //             console.error("Erreur Axios Response:", error.response.data);
    //             // Gérer les erreurs spécifiques retournées par le serveur
    //             const serverMessage = error.response.data.message || 'Une erreur est survenue lors de la requête.';
    //             this.rootStore.handleError(error.response.status, serverMessage, error.response.data);
    //             return Promise.reject(serverMessage);
    //         } else if (error.request) {
    //             // Lorsque la requête est envoyée mais qu'aucune réponse n'est reçue
    //             console.error("Erreur Axios Request:", error.request);
    //             this.rootStore.handleError(500, "Aucune réponse du serveur", error.request);
    //             return Promise.reject('Aucune réponse du serveur.');
    //         } else {
    //             // Erreur lors de la configuration de la requête
    //             console.error("Erreur Axios:", error.message);
    //             toast.error('Erreur de creation de passage avec frais!', {
    //                 position: "top-center",
    //                 autoClose: 5000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 style: {
    //                     marginTop: '50px'
    //                 },
    //             });
    //             this.rootStore.handleError(500, error.message, error);
    //             return Promise.reject(error.message);
    //         }
    //     }
    // }
    approuver = async (id: number | string) => {
        // Vérification de l'ID
        if (typeof id !== 'number' && typeof id !== 'string') {
            console.error('ID facture non valide');
            return;
        }

        console.log("ID facture :", id); // Vérifie si l'ID est correct

        const url = `${this.BASE_URL}/approuver/${id}`;
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
                // this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            } else {
                toast.success('Facture approuvee avec succès!', {
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
                await this.factureLists();
                return Promise.resolve(data);
            }
        } catch (error: any) {
            console.error('Erreur lors de l\'approbation:', error.response?.data || error.message);
            toast.error('Erreur lors de l\'approbation de la facture.', {
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
            // this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
        }
    };
    renvoyerAvecMotif = async (id: number | string | null, motif: string) => {
        if (!id || !motif.trim()) {
            toast.error("ID ou motif invalide.");
            return;
        }
        try {
            this.loading = true; // Activer le loader

            const response = await axios.put(
                `${this.BASE_URL}/rejeter/${id}`,
                { motif },
                {
                    headers: {
                        Authorization: `Bearer ${this.rootStore.authStore.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("HTTP Status:", response.status);
            const data = response.data;

            if (data.error) {
                toast.error(data.message || "Erreur inconnue lors du renvoi.");
                return Promise.reject(new Error(data.message));
            }

            // toast.success('Facture rejete avec succès!', {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     draggable: true,
            //     progress: undefined,
            //     style: {
            //         marginTop: '50px',
            //     },
            // });
            this.rootStore.showNotification('success','Facture rejete avec succès!');
            this.openMotifDialog = false;
            this.factureLists(); // Mettre à jour la liste des factures
            return Promise.resolve(data);

        } catch (error: any) {
            if (error.response) {
                console.error("Erreur serveur:", error.response.data);
                toast.error(error.response.data.message || 'Erreur serveur.');
            } else if (error.request) {
                console.error("Aucune réponse du serveur:", error.request);
                // toast.error('Impossible de contacter le serveur.');
                this.rootStore.showNotification('error','Impossible de contacter le serveur.');
                this.openMotifDialog;
            } else {
                console.error("Erreur inattendue:", error.message);
                this.rootStore.showNotification('error','Erreur inattendue.');
                // toast.error('Erreur inattendue.');
            }
        } finally {
            this.loading = false; // Désactiver le loader
        }
    };
}