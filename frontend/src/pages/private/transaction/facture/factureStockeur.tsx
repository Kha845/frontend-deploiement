/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    reference: Yup.string().required('Reference est requis'),
    idStockeur: Yup.number(),
    etat: Yup.string(),
    cumul_cfa_noir: Yup.number().nullable(),
    cumul_cfa_blanc: Yup.number().nullable(),
    cumul_total: Yup.number().nullable(),
    UniteDeMesure: Yup.string().required('Unite de mesure est requis'),
    date: Yup.date().required('Date est requis'),
    idModePaiement: Yup.array()
                            .of(Yup.number())
                            .min(1, 'Vous devez sélectionner au moins un mode de paiement')
                            .required('Mode de paiement est requis'),
    // temperature: Yup.string(),
    designations: Yup.array().of(
        Yup.object().shape({
            designation: Yup.string().required('Designation est requis'),
            // quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
            prixUnitaire: Yup.number().required('Prix unitaire est requis').min(0, 'Prix unitaire ne peut pas être négatif'),
            montant: Yup.number().required('Montant est requis').min(0, 'Montant ne peut pas être négatif'),
            devise: Yup.string().required('Devise est requis'),
            volume_ambiant: Yup.number().required('Volume ambiant est requis').min(1, 'Quantité doit être au moins 1'),
            volume_a_15_kg: Yup.number().nullable(),
            taux_blanc: Yup.number().nullable(),
            taux_noir: Yup.number().nullable(),
            montant_blanc: Yup.number().nullable(),
            montant_noir: Yup.number().nullable(),
        })
    )
    
});
interface ModeDePaiement {
    idModePaiement: number;
    typePaiement: string;
}
interface Stockeur{
    idStokeur: number;
    nom: string;
}
const FactureStockeur = () => {
    const navigate = useNavigate();
    const { rootStore: { factureStore } } = useStore();
    const { createData } = factureStore;
    // Utiliser useState pour la gestion de la boîte de dialogue
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [modeDePaiements, setModeDePaiements] = useState<ModeDePaiement[]>([]);
    const [stockeurs, setStockeur] = useState<Stockeur[]>([]);
    const { handleSubmit, control, formState: { errors }, reset, setValue,watch } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reference: "",
            designations: [
                { designation: "", 
                //   quantite: 0, 
                  prixUnitaire: 0, 
                  montant: 0, 
                  devise: "" ,
                  volume_ambiant: 0,
                  volume_a_15_kg: 0,
                  taux_blanc: 0,
                  taux_noir: 0,
                  montant_blanc: 0,
                  montant_noir: 0}],
                    UniteDeMesure: "litre",
                    date: new Date(),
                    idModePaiement:  [],
                    etat: "",
                    idStockeur: 0,
        },
    });
     // Utiliser useFieldArray pour gérer plusieurs désignations
     const { fields, append, remove } = useFieldArray({
        control,
        name: 'designations'
    });
       // Fonction pour calculer le montant de chaque désignation
       const calculateMontant = (index: number) => {
        const prixUnitaire = watch(`designations.${index}.prixUnitaire`);
        const quantite = watch(`designations.${index}.volume_ambiant`);
        const montant = prixUnitaire * quantite;
        setValue(`designations.${index}.montant`, parseFloat(montant.toFixed(2)));
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
        const fetchStockeurs = async () => {
                try {
                    const response = await factureStore.getListStockeur();
                    setStockeur(response); 
                    console.log('les donnes de stockeurs',response);
                } catch (error) {
                    console.error('Erreur lors de la récupération des stockeurs:', error);
                }
            };
        // Calcul du cumul total
        const calculateCumuleTotale = () => {
            const designations = watch("designations") || [];
            const total = designations.reduce((acc, designation) => {
                const montantNoir = Number(designation.montant_noir)|| 0;
                const montantBlanc = Number(designation.montant_blanc) || 0;
                return acc + montantNoir + montantBlanc;
            }, 0);
            console.log('montant total',total);
            return parseFloat(total.toFixed(2));
        };
    
        // Calcul du cumul CFA (Taux Noir)
        const calculateCumuleCfaNoir = () => {
            const designations = watch("designations") || [];
            const totalCfaNoir = designations.reduce((acc, designation) => {
                const montantNoir = Number(designation.montant_noir) || 0;
                
                return acc + montantNoir;
            }, 0);
            return parseFloat(totalCfaNoir.toFixed(2));
        };

        // Calcul du cumul CFA (Taux Blanc)
        const calculateCumuleCfaBlanc = () => {
            const designations = watch("designations") || [];
            const totalCfaBlanc = designations.reduce((acc, designation) => {
                const montantBlanc = Number(designation.montant_blanc) || 0;
            
                return acc + montantBlanc;
            }, 0);
            return parseFloat(totalCfaBlanc.toFixed(2));
        };
    const designations = watch("designations") || [];

    useEffect(() => {
      // Vérifie si tous les montants sont valides (remplis et positifs, par exemple)
      const areMontantsValid = designations.every((item: any) => 
        item.montant_noir !== undefined && 
        item.montant_blanc !== undefined
      );
    
      if (areMontantsValid) {
        setValue("cumul_total", calculateCumuleTotale());
        setValue("cumul_cfa_noir", calculateCumuleCfaNoir());
        setValue("cumul_cfa_blanc", calculateCumuleCfaBlanc());
      }
    }, [
      designations.map(item => item.montant_noir), 
      designations.map(item => item.montant_blanc)
    ]);
    // Gestion de la soumission
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
                montant: item.montant,
                devise: item.devise,
                volume_ambiant: item.volume_ambiant,
                volume_a_15_kg: item.volume_a_15_kg,
                taux_blanc: item. taux_blanc,
                taux_noir: item.taux_noir,
                montant_blanc: item.montant_blanc,
                montant_noir: item.montant_noir,
            }));
        }
        setFormData(data); // Stocker les données pour la boîte de dialogue
        setOpenDialog(true); // Ouvrir la boîte de dialogue
    };
    // Confirmer la création du bon de commande
    const handleConfirm = async () => {
        try {
            const resMessage = await createData(formData); 
            toast.success('Facture stockeur enregistrer avec succès!', {
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
    const getPrixUnitaire = (designation: string): number => {
        switch (designation) {
          case "Gazoil":
            return 755;
          case "Super":
            return 990;
          case "Diesel":
            return 1000;
          default:
            return 0; // Valeur par défaut si aucune correspondance
        }
      };
      useEffect(()=>{
            fetchModeDePaiement();
            fetchStockeurs();
          },[])
    return (
        <Card sx={{marginLeft: '150px'}}>
            <CardContent>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Enregistrement d'une nouvelle facture stockeur et frais de passage SGF
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                            <Typography variant="h6" color="success" textAlign='center'>
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
                                        onChange={(event) => {
                                            const selectedDesignation = event.target.value;
                                            field.onChange(event); // Met à jour la désignation 
                                            // Définir le prix unitaire automatiquement
                                            const prixUnitaire = getPrixUnitaire(selectedDesignation);
                                            setValue(`designations.${index}.prixUnitaire`, prixUnitaire);
                                          }}
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
                                                name={`designations.${index}.volume_ambiant`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        type='number'
                                                        {...field}
                                                        label="Quantité volume ambiant"
                                                        variant="filled"
                                                        fullWidth
                                                        error={!!errors.designations?.[index]?.volume_ambiant}
                                                        helperText={errors.designations?.[index]?.volume_ambiant?.message}
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
                                        InputProps={{
                                            readOnly: true, // Empêche la saisie manuelle
                                          }}
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
                                <Grid item xs={2}>
                                <Controller
                                    name={`designations.${index}.devise`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select // Important : indique que le champ est un menu déroulant
                                            label="Devise"
                                            variant="filled"
                                            fullWidth
                                            error={!!errors.designations?.[index]?.devise}
                                            helperText={errors.designations?.[index]?.devise?.message}
                                        >
                                            <MenuItem value="FCFA">FCFA</MenuItem>
                                            <MenuItem value="DOLLAR">DOLLAR</MenuItem>
                                            <MenuItem value="EURO">EURO</MenuItem>
                                        </TextField>
                                    )}
                                />
                                </Grid>
                                    
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.volume_a_15_kg`}
                                            control={control}
                                            
                                            render={({ field }) => (
                                                <TextField
                                                    type='number'
                                                    {...field}
                                                    label="Quantite volume a 15"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.volume_a_15_kg}
                                                    helperText={errors.designations?.[index]?.volume_a_15_kg?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.taux_blanc`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Taux blanc"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.taux_blanc}
                                                    helperText={errors.designations?.[index]?.taux_blanc?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.taux_noir`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Taux noir"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.taux_noir}
                                                    helperText={errors.designations?.[index]?.taux_noir?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.montant_noir`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Montant noir"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.montant_noir}
                                                    helperText={errors.designations?.[index]?.montant_noir?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.montant_blanc`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Montant blanc"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.montant_blanc}
                                                    helperText={errors.designations?.[index]?.montant_blanc?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                <Grid item xs={1}>
                                <Button  variant="contained" color="error" onClick={() => remove(index)}>Supprimer</Button>
                                </Grid>
                            </Grid>
                            ))}
                            <Grid item xs={1} sm={6} sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'10px'}}>
                             <Button  variant="contained" color="success" onClick={() => append(
                                { designation: "", volume_ambiant: 0, 
                                prixUnitaire: 0, montant: 0, devise: "", 
                                volume_a_15_kg: 0, taux_blanc:0,taux_noir:0 })}>
                                    Ajouter une désignation
                             </Button>
                            </Grid>
                        </Grid>

                        {/* Cumul total */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Cumul CFA Noir"
                                value={watch("cumul_cfa_noir")}
                                fullWidth
                                variant="filled"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Cumul CFA Blanc"
                                value={watch("cumul_cfa_blanc")}
                                fullWidth
                                variant="filled"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Cumul Total"
                                value={watch("cumul_total")}
                                fullWidth
                                variant="filled"
                                disabled
                            />
                        </Grid>
                    <Grid item xs={12} sm={4}>
                        <Controller
                            name="idStockeur"
                            control={control}
                            render={({ field }) => (
                                <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idStockeur}>
                                    <InputLabel id="stockeur-select-label">Sélectionnez nom stockeur</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="stockeur-select-label"
                                        value={field.value !== undefined ? field.value : ""} // Assurez-vous que la valeur est définie
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} // Gère le changement de valeur
                                        fullWidth
                                    >
                                         {stockeurs.map((stockeur) => (
                                            <MenuItem key={stockeur.idStokeur} value={stockeur.idStokeur}>
                                                {stockeur.nom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idStockeur && <p style={{ color: 'red' }}>{errors.idStockeur.message}</p>}
                                </FormControl>
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
                    <Grid item xs={12} sm={3}>
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
                      disabled // Désactive la saisie
                    >
                      <MenuItem value="litre">Litre</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
                    <Grid item xs={12} sm={4}>
                            <Controller
                                name="date"
                                control={control}
                                defaultValue={new Date()} // Assurez-vous que la valeur par défaut est bien définie
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Date de la facture"
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
                                name="idModePaiement"
                                control={control}
                                defaultValue={[]} // La valeur initiale doit être un tableau
                                render={({ field }) => (
                                    <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idModePaiement}>
                                        <InputLabel id="modePaiement-select-label">Sélectionnez un mode de paiement</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="modePaiement-select-label"
                                            multiple // Active la sélection multiple
                                            value={field.value || []} // Toujours un tableau
                                            onChange={(e) => field.onChange(e.target.value)} // Met à jour avec le tableau sélectionné
                                            fullWidth
                                        >
                                            {modeDePaiements.map((modePaiement) => (
                                                <MenuItem key={modePaiement.idModePaiement} value={modePaiement.idModePaiement}>
                                                    {modePaiement.typePaiement}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.idModePaiement && (
                                            <p style={{ color: 'red' }}>{errors.idModePaiement.message}</p>
                                        )}
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
                                        <MenuItem value="Paiement en cours">Paiement en cours</MenuItem>
                                    </TextField>
                                )}
                            />
                     </Grid>
                    </Grid>
                    <Grid xs={12} sm={6} sx={{display:'flex',justifyContent:'center'}}>
                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Envoyer
                    </Button>
                    <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
                    </Button>
                    </Grid>
                </form>
            </CardContent>
            {/* Boîte de dialogue de confirmation */}
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirmer l'enregistrement</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment enregistrer  cette facture ?
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

export default observer(FactureStockeur);
