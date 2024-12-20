/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    reference: Yup.string().required('Reference est requis'),
    emetteur: Yup.string().required('Emetteur est requis'),
    idDepot: Yup.number(),
    format: Yup.string().required('Format est requis'),
    designation: Yup.string().required('Designation est requis'),
    montant: Yup.number().required('Montant est requis'),
    prixUnitaire: Yup.number().required('Prix unitaire est requis'),
    produit: Yup.string().required('Produit est requise'),
    quantite: Yup.number().required('Quantite est requis'),
    etat: Yup.string(),
    UniteDeMesure: Yup.string().required('Unite de mesure est requis'),
    taxe: Yup.number(),
    date: Yup.date().required('Date est requis'),
    idBonLivraison: Yup.number(),
    idBonCommande: Yup.number(),
    idModePaiement:  Yup.number()  ,
});
interface BonDeLivraison {
    idBonDeLivraison: number;
    numeroBonDeLivraison: number;
}
interface BonDeCommande {
    idBonDeCommande: number;
    numeroBonDeCommande: number;
}
interface ModeDePaiement {
    idModePaiement: number;
    typePaiement: string;
}
interface Depot{
    idDepot: number;
    nom: string;
}
const FactureSave = () => {
    const navigate = useNavigate();
    const { rootStore: { factureStore } } = useStore();
    const { createData } = factureStore;
    // Utiliser useState pour la gestion de la boîte de dialogue
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [bonDeLivraisons, setBonDeLivraison] = useState<BonDeLivraison[]>([]);
    const [bonDeCommandes, setBonDeCommande] = useState<BonDeCommande[]>([]);
    const [modeDePaiements, setModeDePaiements] = useState<ModeDePaiement[]>([]);
    const [depots, setDepots] = useState<Depot[]>([]);
    const { handleSubmit, control, formState: { errors }, reset, setValue, getValues } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reference: "",
            emetteur: "",
            idDepot: 13,
            format: "",
            designation: "",
            montant: 0,
            prixUnitaire: 0,
            produit: "",
            quantite: 0,
            UniteDeMesure: "",
            date: new Date(),
            idBonLivraison: 2,
            idBonCommande: 2,
            idModePaiement: 1,
            taxe: 0,
            etat: ""
        },
    });
    // Fonction pour récupérer la liste des bons de livraisons
    const fetchBonDeLivraison = async () => {
        try {
            const response = await factureStore.getListBonDeLivraison();
            setBonDeLivraison(response); // Assurez-vous d'adapter cette ligne selon la structure de votre réponse
        } catch (error) {
            console.error('Erreur lors de la récupération des bons de livraison:', error);
        }
    };

    // Fonction pour récupérer la liste des bons de commandes
    const fetchBonDeCommande = async () => {
        try {
            const response = await factureStore.getListBonDeCommande();
            setBonDeCommande(response); // Assurez-vous d'adapter cette ligne selon la structure de votre réponse
        } catch (error) {
            console.error('Erreur lors de la récupération bons de commande:', error);
        }
    };
    // Fonction pour récupérer la liste des modes de paiement
    const fetchModeDePaiement = async () => {
        try {
            const response = await factureStore.getListModeDePaiement();
            setModeDePaiements(response); // Assurez-vous d'adapter cette ligne selon la structure de votre réponse
        } catch (error) {
            console.error('Erreur lors de la récupération des modes de paiement:', error);
        }
    };
        // Fonction pour récupérer la liste des depots
    const fetchDepots = async () => {
            try {
                const response = await factureStore.getListStockeur();
                setDepots(response); 
            } catch (error) {
                console.error('Erreur lors de la récupération des modes de paiement:', error);
            }
        };
    useEffect(() => {
        fetchBonDeLivraison();
        fetchBonDeCommande();
        fetchModeDePaiement();
        fetchDepots();
    }, []);
    // Gestion de la soumission
    const onSubmit = async (data: any) => {
        // Convertir la date au format 'YYYY-MM-DD'
        if (data.date) {
            data.date = new Date(data.date).toISOString().split('T')[0];
            setValue('date',data.date)
        }
        setFormData(data); // Stocker les données pour la boîte de dialogue
        setOpenDialog(true); // Ouvrir la boîte de dialogue
    };
    // Confirmer la création du bon de commande
    const handleConfirm = async () => {
        try {
            const resMessage = await createData(formData); 
            console.log(resMessage);
            reset();
            setOpenDialog(false); // Fermer la boîte de dialogue
        } catch (error: any) {
            console.log(error);
        }
    };
    // Annuler la création de l'utilisateur
    const handleCancel = () => {
        setOpenDialog(false); // Fermer la boîte de dialogue
    };
    // Fonction pour calculer le montant
    const calculateMontant = (quantite: number, prixUnitaire: number, format: string, taxe: number) => {
        let montant = quantite * prixUnitaire;

        // Appliquer la taxe si le format est commercial
        if (format === 'commercial') {
            montant += (montant * (taxe / 100)); // Ajoute la taxe en pourcentage
        }

        return montant;
    };
    return (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom color='success'>
                    Enregistrement d'une nouvelle facture
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                            <Controller
                                name="emetteur"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Emetteur"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.emetteur}
                                        helperText={errors.emetteur ? errors.emetteur.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="designation"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Designation"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.designation}
                                        helperText={errors.designation ? errors.designation.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="reference"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Reference"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.reference}
                                        helperText={errors.reference ? errors.reference.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="produit"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Produit"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.produit}
                                        helperText={errors.produit ? errors.produit.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="quantite"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Quantite"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.quantite}
                                        helperText={errors.quantite ? errors.quantite.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="UniteDeMesure"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Unite De Mesure"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.UniteDeMesure}
                                        helperText={errors.UniteDeMesure ? errors.UniteDeMesure.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="prixUnitaire"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Prix Unitaire"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.prixUnitaire}
                                        helperText={errors.prixUnitaire ? errors.prixUnitaire.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="taxe"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Taxe"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.taxe}
                                        helperText={errors.taxe ? errors.taxe.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="format"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth variant="filled" margin="normal" error={!!errors.format}>
                                        <InputLabel>Format</InputLabel>
                                        <Select
                                            {...field}
                                            label="Format"
                                            onChange={(e) => {
                                                field.onChange(e); // Mettre à jour le champ avec la nouvelle valeur
                                                const quantite = getValues("quantite") || 0; // Récupérer la quantité actuelle
                                                const prixUnitaire = getValues("prixUnitaire") || 0; // Récupérer le prix unitaire actuel
                                                const taxe = getValues("taxe") || 0; // Récupérer la taxe actuelle
                                                // Recalculer le montant basé sur le format sélectionné
                                                setValue("montant", calculateMontant(quantite, prixUnitaire, e.target.value, taxe));
                                            }}
                                        >
                                            <MenuItem value="industriel">Industriel</MenuItem>
                                            <MenuItem value="commercial">Commercial</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.format ? errors.format.message : ''}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="montant"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Montant"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        type='number'
                                        InputProps={{
                                            readOnly: true, // Rendre ce champ en lecture seule
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="date"
                                control={control}
                                defaultValue={new Date()} // Assurez-vous que la valeur par défaut est bien définie
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Date"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        type="date"
                                        error={!!errors.date}
                                        helperText={errors.date ? errors.date.message : ''}
                                        InputLabelProps={{
                                            shrink: true, // Pour faire en sorte que le label ne chevauche pas le champ
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="idBonCommande"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idBonCommande}>
                                        <InputLabel id="bonCommande-select-label">Sélectionnez numero BC</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="bonCommande-select-label"
                                            fullWidth
                                        >
                                            {bonDeCommandes.map((bonCommande: any) => (
                                                <MenuItem key={bonCommande.id} value={bonCommande.id}>
                                                    {bonCommande.numeroBonDeCommande} {/* Remplacez par l'attribut que vous souhaitez afficher */}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.idBonCommande && <p style={{ color: 'red' }}>{errors.idBonCommande.message}</p>}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="idBonLivraison"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idBonLivraison}>
                                        <InputLabel id="bonLivraison-select-label">Sélectionnez numero BL</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="bonLivraison-select-label"
                                            fullWidth
                                        >
                                            {bonDeLivraisons.map((bonlivraison: any) => (
                                                <MenuItem key={bonlivraison.id} value={bonlivraison.id}>
                                                    {bonlivraison.numeroBonDeLivraison} {/* Remplacez par l'attribut que vous souhaitez afficher */}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.idBonLivraison && <p style={{ color: 'red' }}>{errors.idBonLivraison.message}</p>}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                            name="idModePaiement"
                            control={control}
                            
                            render={({ field }) => (
                                <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idModePaiement}>
                                    <InputLabel id="modePaiement-select-label">Sélectionnez un mode de paiement</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="modePaiement-select-label"
                                        value={field.value !== undefined ? field.value : ""} // Assurez-vous que la valeur est définie
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} // Gère le changement de valeur
                                        fullWidth
                                    >
                                        {modeDePaiements.map((modePaiement) => (
                                            <MenuItem key={modePaiement.idModePaiement} value={modePaiement.idModePaiement}>
                                                {modePaiement.typePaiement}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idModePaiement && <p style={{ color: 'red' }}>{errors.idModePaiement.message}</p>}
                                </FormControl>
                            )}
                        />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Controller
                            name="idDepot"
                            control={control}
                            render={({ field }) => (
                                <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idDepot}>
                                    <InputLabel id="depot-select-label">Sélectionnez le depot</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="depot-select-label"
                                        value={field.value !== undefined ? field.value : ""} // Assurez-vous que la valeur est définie
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} // Gère le changement de valeur
                                        fullWidth
                                    >
                                        {depots.map((depot) => (
                                            <MenuItem key={depot.idDepot} value={depot.idDepot}>
                                                {depot.nom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idModePaiement && <p style={{ color: 'red' }}>{errors.idModePaiement.message}</p>}
                                </FormControl>
                            )}
                        />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="etat"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Etat"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.etat}
                                        helperText={errors.etat ? errors.etat.message : ''}
                                    >
                                        <MenuItem value="Payee">Payée</MenuItem>
                                        <MenuItem value="Impayee">Impayée</MenuItem>
                                        <MenuItem value="Payee Partiellement">Payée Partiellement</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Enregistrer
                    </Button>
                    <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
                    </Button>
                </form>
            </CardContent>
            {/* Boîte de dialogue de confirmation */}
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirmer la création</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment créer cette facture ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} color="success">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default observer(FactureSave);
