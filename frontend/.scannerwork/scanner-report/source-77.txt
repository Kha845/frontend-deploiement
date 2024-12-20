/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Définir la validation du formulaire pour un tableau de désignations
const validationSchema = Yup.object().shape({
    reference: Yup.string().required('Reference est requis'),
    emetteur: Yup.string(),
    etat: Yup.string(),
    date: Yup.date().required('Date est requis'),
    idBonCommande: Yup.number(),
    idModePaiement: Yup.number(),
    designations: Yup.array().of(
        Yup.object().shape({
            designation: Yup.string().required('Designation est requis'),
            quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
            prixUnitaire: Yup.number().required('Prix unitaire est requis').min(0, 'Prix unitaire ne peut pas être négatif'),
            montant: Yup.number().required('Montant est requis').min(0, 'Montant ne peut pas être négatif')
        })
    )
});
interface ModeDePaiement {
    idModePaiement: number;
    typePaiement: string;
}

const AutreFacture = () => {
    const navigate = useNavigate();
    const { rootStore: { factureStore, authStore } } = useStore();
    const { createData } = factureStore;

    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
  
    const [modeDePaiements, setModeDePaiements] = useState<ModeDePaiement[]>([]);

    const { handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reference: "",
            emetteur: "SGF",
            etat: "",
            date: new Date(),
            idBonCommande: 2,
            idModePaiement: 1,
            designations: [{ designation: "", quantite: 0, prixUnitaire: 0, montant: 0 }]
        }
    });

    // Utiliser useFieldArray pour gérer plusieurs désignations
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'designations'
    });
    useEffect(() => {
        // Fonction asynchrone pour récupérer le numéro de reference
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
                if (response.data && response.data.reference) {
                    setValue("reference", response.data.reference);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du numéro de reference :", error);
            }
        };
        fetchNumeroReference();
    },[]);
        
    // Fetch des bons de commande et modes de paiement (inchangé)
    useEffect(() => {

        const fetchModeDePaiement = async () => {
            try {
                const response = await factureStore.getListModeDePaiement();
                setModeDePaiements(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des modes de paiement:', error);
            }
        };      
        fetchModeDePaiement();
    }, []);

    // Fonction pour calculer le montant de chaque désignation
    const calculateMontant = (index: number) => {
        const prixUnitaire = watch(`designations.${index}.prixUnitaire`);
        const quantite = watch(`designations.${index}.quantite`);
        const montant = prixUnitaire * quantite;
        setValue(`designations.${index}.montant`, parseFloat(montant.toFixed(2)));
    };

    const onSubmit = async (data: any) => {
        data.date = new Date(data.date).toISOString().split('T')[0];
        
          // Normalisation des données avant envoi
          if (Array.isArray(data.designations)) {
            data.designations = data.designations.map((item: any) => ({
                designation: item.designation,
                quantite: item.quantite,
                prixUnitaire: item.prixUnitaire,
                montant: item.montant
            }));
        }
       console.log('item', data);
        setFormData(data);
        setOpenDialog(true);
    };
    
    
    const handleConfirm = async () => {
        try {
            const resMessage = await createData(formData);
            toast.success('Facture enregistrer avec succès !', {
                position: "top-center",
                autoClose: 5000
            });
            reset();
            setOpenDialog(false);
        } catch (error: any) {
            console.log(error);
        }
    };
    
    return (
        <Card sx={{marginLeft: '150px'}}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="success" textAlign='center'>
            Enregistrement de facture SGF
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" color="success" textAlign='center'>
                  Désignations
                </Typography>
                {fields.map((field, index) => (
                  <Grid container spacing={3} key={field.id}>
                    <Grid item xs={3}>
                      <Controller
                        name={`designations.${index}.designation`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Designation"
                            variant="filled"
                            fullWidth
                            error={!!errors.designations?.[index]?.designation}
                            helperText={errors.designations?.[index]?.designation?.message}
                          />
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
                      <Button variant='contained' color="error" onClick={() => remove(index)}>Supprimer</Button>
                    </Grid>
                  </Grid>
                ))}
                 <Grid item xs={1} sm={6} sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'10px'}}>
                             <Button  variant="contained" color="success" onClick={() => append({ designation: "", quantite: 0, prixUnitaire: 0, montant: 0 })}>
                                    Ajouter une désignation
                             </Button>
                  </Grid> 
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name="reference"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Reference"
                      variant="filled"
                      fullWidth
                      disabled
                      error={!!errors.reference}
                      helperText={errors.reference?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                                        <MenuItem value="Paiement en cours">Paiement en cours</MenuItem>
                                    </TextField>
                                )}
                            />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid xs={12} sm={6} sx={{display:'flex', justifyContent:'center'}}>
                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Enregistrer
                    </Button>
                    <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
                    </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>Confirmez-vous l'enregistrement de cette facture ?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button onClick={handleConfirm} color="primary">Confirmer</Button>
          </DialogActions>
        </Dialog>
      </Card> 
    );
};

export default observer(AutreFacture);
