/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    emetteur: Yup.string(),
    destinataire: Yup.string(),
    reference: Yup.string().required('Reference est requis'),
    UniteDeMesure: Yup.string().required('Unite de mesure est requis'),
    date: Yup.date().required('Date est requis'),
    idBonLivraison: Yup.number(),
    idBonCommande: Yup.number(),
    idModePaiement:  Yup.number(),
    designations: Yup.array().of(
        Yup.object().shape({
            designation: Yup.string().required('Designation est requis'),
            quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
            prixUnitaire: Yup.number().required('Prix unitaire est requis').min(0, 'Prix unitaire ne peut pas être négatif'),
            montant: Yup.number().required('Montant est requis').min(0, 'Montant ne peut pas être négatif')
        })
    )
});
interface BonDeCommande {
    idBonDeCommande: number;
    numeroBonDeCommande: number;
}
interface ModeDePaiement {
    idModePaiement: number;
    typePaiement: string;
}

const FactureCreate = () => {
    const navigate = useNavigate();
    const { rootStore: { factureStore , authStore} } = useStore();
    const { createData,} = factureStore;
   
    // Utiliser useState pour la gestion de la boîte de dialogue
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [bonDeCommandes, setBonDeCommande] = useState<BonDeCommande[]>([]);
    const [modeDePaiements, setModeDePaiements] = useState<ModeDePaiement[]>([]);
    const { handleSubmit, control, formState: { errors }, reset, setValue, watch} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reference: "",
            destinataire: "",
            emetteur: "SGF",
            designations: [{ designation: "", quantite: 0, prixUnitaire: 0, montant: 0 }],
            UniteDeMesure: "",
            date: new Date(),
            idBonLivraison: 2,
            idBonCommande: 2,
            idModePaiement: 1,
           
        },
    });
     // Utiliser useFieldArray pour gérer plusieurs désignations
     const { fields, append, remove } = useFieldArray({
        control,
        name: 'designations'
    });
  

    // Fonction pour récupérer la liste des modes de paiement
    const fetchModeDePaiement = async () => {
        try {
            const response = await factureStore.getListModeDePaiement();
            setModeDePaiements(response); // Assurez-vous d'adapter cette ligne selon la structure de votre réponse
        } catch (error) {
            console.error('Erreur lors de la récupération des modes de paiement:', error);
        }
    };
    useEffect(() => {
        fetchModeDePaiement();
    }, []);
    useEffect(() => {
        // Fonction asynchrone pour récupérer le numéro de bon de livraison
        const fetchNumeroReference = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/v1/factures/generate-numero-reference`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${authStore.token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
    
                // Assure que le numéro de reference est défini dans la réponse avant de le définir
                if (response.data?.reference) {
                    setValue("reference", response.data.reference);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du numéro de reference :", error);
            }
    };
    
    fetchNumeroReference(); // Appel initial pour générer le numéro
    
    }, [setValue, authStore.token]);

     // Fonction pour calculer le montant de chaque désignation
     const calculateMontant = (index: number) => {
        const prixUnitaire = watch(`designations.${index}.prixUnitaire`);
        const quantite = watch(`designations.${index}.quantite`);
        const montant = prixUnitaire * quantite;
        setValue(`designations.${index}.montant`, parseFloat(montant.toFixed(2)));
    };
    const onSubmit = async (data: any) => {
        // Convertir la date au format 'YYYY-MM-DD'
        if (data.date) {
            data.date = new Date(data.date).toISOString().split('T')[0];
            setValue('date',data.date)
        }
        // Normalisation des données avant envoi
        if (Array.isArray(data.designations)) {
            data.designations = data.designations.map((item: any) => ({
                designation: item.designation,
                quantite: item.quantite,
                prixUnitaire: item.prixUnitaire,
                montant: item.montant
            }));
        }
        setFormData(data); // Stocker les données pour la boîte de dialogue
        setOpenDialog(true); // Ouvrir la boîte de dialogue
    };
    // Confirmer la création du facture
    const handleConfirm = async () => {
        try {
            const resMessage = await createData(formData); 
            toast.success('Facture cree avec succès!', {
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
    return (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Creation de facture SGF
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="success" textAlign='center' sx={{marginTop:'10px'}}>
                            Désignations
                            </Typography>
                            {fields.map((field, index) => (
                            <Grid container spacing={3} key={field.id}>
                           <Grid item xs={3} sm={4}>
                                <Controller
                                    name={`designations.${index}.designation`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                        select
                                        label="Designation"
                                        variant="filled"
                                        fullWidth
                                        {...field}
                                        error={!!errors.designations}
                                        helperText={errors.designations ? errors.designations.message : ''}
                                      >
                                        <MenuItem value="Gazoil">Gazoil</MenuItem>
                                        <MenuItem value="Super">Super</MenuItem>
                                        <MenuItem value="Diesel">Diesel</MenuItem>
                                      </TextField>
                                    )}
                                />
                                </Grid>
                                <Grid item xs={2}>
                                <Controller
                                    name={`designations.${index}.quantite`}
                                    control={control}
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Quantité"
                                        variant="filled"
                                        fullWidth
                                        error={!!errors.designations?.[index]?.quantite}
                                        helperText={errors.designations?.[index]?.quantite?.message}
                                        onBlur={() => calculateMontant(index)}
                                    />
                                    )}
                                />
                                </Grid>
                                <Grid item xs={2}>
                                <Controller
                                    name={`designations.${index}.prixUnitaire`}
                                    control={control}
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Prix Unitaire"
                                        variant="filled"
                                        fullWidth
                                        error={!!errors.designations?.[index]?.prixUnitaire}
                                        helperText={errors.designations?.[index]?.prixUnitaire?.message}
                                        onBlur={() => calculateMontant(index)}
                                    />
                                    )}
                                />
                                </Grid>
                                <Grid item xs={2}>
                                <Controller
                                    name={`designations.${index}.montant`}
                                    control={control}
                                    render={({ field }) => (
                                    <TextField {...field} label="Montant" variant="filled" fullWidth disabled error={!!errors.designations?.[index]?.montant} />
                                    )}
                                />
                                </Grid>
                                <Grid item xs={1}>
                                <Button variant="contained" color="error" onClick={() => remove(index)}>Supprimer</Button>
                                </Grid>
                            </Grid>
                            ))}
                             <Grid item xs={1} sm={6} sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'10px'}}>
                             <Button  variant="contained" color="success" onClick={() => append({ designation: "", quantite: 0, prixUnitaire: 0, montant: 0 })}>
                                    Ajouter une désignation
                             </Button>
                            </Grid>   
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
                                        InputProps={{
                                            readOnly: true, // Champ en lecture seule
                                          }}
                                        error={!!errors.reference}
                                        helperText={errors.reference ? errors.reference.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled" margin="normal">
                <InputLabel>Unité De Mesure</InputLabel>
                <Controller
                  name="UniteDeMesure"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Unité De Mesure"
                      fullWidth
                      value="litre" // Fixe la valeur à "litre"
                      disabled // Désactive la saisie
                    >
                      <MenuItem value="litre">Litre</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
                        
                        {/* <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="filled" margin="normal" error={!!errors.UniteDeMesure}>
                            <InputLabel>Unité De Mesure</InputLabel>
                            <Controller
                                name="UniteDeMesure"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Unité De Mesure"
                                        fullWidth
                                    >
                                        <MenuItem value="litre">Litre</MenuItem>
                                        <MenuItem value="hectolitre">Hectolitre</MenuItem>
                                        <MenuItem value="metre cube">Mètre Cube</MenuItem>
                                        <MenuItem value="tonne">Tonne</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.UniteDeMesure && (
                                <FormHelperText>{errors.UniteDeMesure.message}</FormHelperText>
                            )}
                        </FormControl>
                        </Grid> */}
                        {/* <Grid item xs={12} sm={4}>
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
                        </Grid> */}

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

                        {/* <Grid item xs={12} sm={4}>
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
                        </Grid> */}
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="destinataire"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Destinataire "
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.destinataire }
                                        helperText={errors.destinataire ? errors.destinataire.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid xs={12} sm={6} sx={{display:'flex',justifyContent:'center'}}>
                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Enregistrer
                    </Button>
                    <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
                    </Button>
                    </Grid>
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

export default observer(FactureCreate);
