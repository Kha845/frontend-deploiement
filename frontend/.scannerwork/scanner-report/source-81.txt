/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AnyCnameRecord } from 'dns';

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    reference: Yup.string(),
    emetteur: Yup.string().nullable(),
    destinataire: Yup.string().nullable(),
    idStockeur: Yup.number().nullable(),
    format: Yup.string().nullable(),
    cumul_cfa_noir: Yup.number().nullable(),
    cumul_cfa_blanc: Yup.number().nullable(),
    cumul_total: Yup.number().nullable(),
    designations: Yup.array().of(
        Yup.object().shape({
            designation: Yup.string().required('Designation est requis'),
            // quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
            prixUnitaire: Yup.number().required('Prix unitaire est requis').min(0, 'Prix unitaire ne peut pas être négatif'),
            montant: Yup.number().required('Montant est requis').min(0, 'Montant ne peut pas être négatif'),
            devise: Yup.string().required('Devise est requis'),
            volume_ambiant: Yup.number().required(),
            volume_a_15_kg: Yup.number().nullable(),
            taux_blanc: Yup.number().nullable(),
            taux_noir: Yup.number().nullable(),
            montant_blanc: Yup.number().nullable(),
            montant_noir: Yup.number().nullable(),
        })
    ),
    UniteDeMesure: Yup.string().required('Unite de mesure est requis'),
    temperature: Yup.string(),
    etat: Yup.string(),
    date: Yup.date().required('Date est requis'),
    idBonLivraison: Yup.number().nullable(),
    idBonCommande: Yup.number().nullable(),
    idModePaiement: Yup.array()
        .of(Yup.number())
        .min(1, 'Vous devez sélectionner au moins un mode de paiement')
        .nullable(),
});
interface BonDeLivraison {
    idBonDeLivraison: number;
    numeroBonDeLivraison: number;
}
interface ModeDePaiement {
    idModePaiement: number;
    typePaiement: string;
}
interface Stockeur {
    idStokeur: number;
    nom: string;
}
const EditFacture = () => {
    const navigate = useNavigate();
    const { rootStore: { factureStore } } = useStore();
    const { updateData, getData } = factureStore;
    // Utiliser useState pour la gestion de la boîte de dialogue
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [bonDeLivraisons, setBonDeLivraisons] = useState<BonDeLivraison[]>([]);
    // const [bonDeCommandes, setBonDeCommandes] = useState<BonDeCommande[]>([]);
    const [modeDePaiements, setModeDePaiements] = useState<ModeDePaiement[]>([]);
    const [stockeur, setStockeurs] = useState<Stockeur[]>([]);
    const { id } = useParams();
    const { handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reference: "",
            emetteur: " ",
            idStockeur: 13,
            format: " ",
            designations: [{
                designation: "",
                // quantite: 0,
                prixUnitaire: 0,
                montant: 0, devise: "",
                volume_ambiant: 0,
                volume_a_15_kg: 0,
                taux_blanc: 0,
                taux_noir: 0,
                montant_blanc: 0,
                montant_noir: 0
            }],
            UniteDeMesure: "",
            date: new Date(),
            idBonLivraison: 1,
            idBonCommande: 1,
            idModePaiement: [],
            temperature: " ",
            etat: "",
            destinataire: " "
        },
    });
    // Fonction pour récupérer la liste des bons de livraisons
    const fetchBonDeLivraison = async () => {
        try {
            const response = await factureStore.getListBonDeLivraison();
            setBonDeLivraisons(response); // Assurez-vous d'adapter cette ligne selon la structure de votre réponse
        } catch (error) {
            console.error('Erreur lors de la récupération des bons de livraison:', error);
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
    const fetchStockeur = async () => {
        try {
            const response = await factureStore.getListStockeur();
            setStockeurs(response);
        } catch (error) {
            console.error('Erreur lors de la récupération des stockeurs:', error);
        }
    };
    useEffect(() => {
        fetchBonDeLivraison();
        fetchModeDePaiement();
        fetchStockeur();
    }, []);
    const onSubmit = async (data: any) => {
        if (data.date) {
            data.date = new Date(data.date).toISOString().split('T')[0];
        }
        setFormData(data);
        setOpenDialog(true); // Ouvrir la boîte de dialogue uniquement si pas d'erreurs
    };
    // Confirmer la mise a jour de la facture
    const handleConfirm = async () => {
        try {
            if (id && formData) {
                // Effectuer la mise à jour des données
                const resData = await updateData(id, formData);
                console.log("Response Data: ", resData);
                navigate('/accueil/transaction/facture')
            } else {
                navigate(-1);
            }
        } catch (error: any) {
            console.log("Erreur lors de la mise à jour :", error);
        } finally {
            setOpenDialog(false); // Fermer la boîte de dialogue après la mise à jour
        }
    };
    // Utiliser useFieldArray pour gérer plusieurs désignations
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'designations'
    });
    // Fonction pour calculer le montant de chaque désignation
    const calculateMontant = (index: number) => {
        const prixUnitaire = watch(`designations.${index}.volume_ambiant`);
        const quantite = watch(`designations.${index}.volume_ambiant`);
        const montant = prixUnitaire * quantite;
        setValue(`designations.${index}.montant`, parseFloat(montant.toFixed(2)));
    };
    const handleCancel = () => {
        setOpenDialog(false); // Fermer la boîte de dialogue
    };
    // Initialiser le formulaire avec les données existantes
    const initForm = async () => {
        try {
            if (id) {
                const resData = await getData(id);
                console.log("response data", resData)
                let designations = resData.data.designations;
                if (typeof designations === "string") {
                    designations = JSON.parse(designations);
                }
                const modePaiementIds = Array.isArray(resData.data.idModePaiement)
                ? resData.data.idModePaiement
                : [resData.data.idModePaiement]; // Force en tableau si nécessaire
     
                reset({
                    emetteur: resData.data.emetteur || "",
                    destinataire: resData.data.destinataire,
                    cumul_cfa_noir: resData.cumul_cfa_noir,
                    cumul_cfa_blanc: resData.cumul_cfa_blanc,
                    cumul_total: resData.cumul_total,
                    designations: designations.map((item: any) => ({
                        designation: item.designation || "",
                        prixUnitaire: item.prixUnitaire || 0,
                        montant: item.montant || 0,
                        devise: item.devise || "",
                        taux_blanc: item.taux_blanc || 0,
                        taux_noir: item.taux_noir || 0,
                        montant_blanc: item.montant_blanc || 0,
                        montant_noir: item.montant_noir || 0,
                        volume_ambiant: item.volume_ambiant ,
                        volume_a_15_kg: item.volume_a_15_kg,
                })),
                    reference: resData.data.reference || "",
                    UniteDeMesure: resData.data.UniteDeMesure || "",
                    date: resData.data.date || "",
                    format: resData.data.format || "",
                    idBonLivraison: resData.data.idBonLivraison ?? null,
                    idStockeur: resData.data.idStockeur || null,
                    etat: resData.data.etat || 0,
                    temperature: resData.data.temperature || 0,
                    idModePaiement:  modePaiementIds
                });
            }
            else {
                navigate(-1); // Retourner si aucun ID n'est présent
            }
        } catch (error) {
            console.log("Erreur de telechargement des donnees", error);
        }
    };
    useEffect(() => {
        initForm();
    }, [id]);
    // Calcul du cumul total
    const calculateCumuleTotale = () => {
        const designations = watch("designations") || [];
        const total = designations.reduce((acc, designation) => {
            const montantNoir = Number(designation.montant_noir) || 0;
            const montantBlanc = Number(designation.montant_blanc) || 0;
            return acc + montantNoir + montantBlanc;
        }, 0);
        console.log('montant total', total);
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
    }, [ designations.map(item => item.montant_noir), 
        designations.map(item => item.montant_blanc)]);
    return (
        <Card sx={{ marginLeft: '160px' }}>
            <CardContent>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Edition de facture
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="success" textAlign='center' sx={{ marginTop: '10px' }}>
                                Désignations
                            </Typography>
                            {fields.map((field, index) => (
                                <Grid container spacing={3} key={field.id}>
                                    {/* Désignation */}
                                    <Grid item xs={3} sm={4}>
                                        <Controller
                                            name={`designations.${index}.designation`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Designation"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.designation}
                                                    helperText={errors.designations?.[index]?.designation?.message || ''}
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
                                                    />
                                                )}
                                            />
                                    </Grid>
                                    {/* Prix Unitaire */}
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
                                                    helperText={errors.designations?.[index]?.prixUnitaire?.message || ''}
                                                    onBlur={() => calculateMontant(index)}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Montant */}
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.montant`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Montant"
                                                    variant="filled"
                                                    fullWidth
                                                    disabled
                                                    error={!!errors.designations?.[index]?.montant}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Devise */}
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.devise`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Devise"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.devise}
                                                    helperText={errors.designations?.[index]?.devise?.message || ''}
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
                                 
                                 
                                    {/* Bouton Supprimer */}
                                    <Grid item xs={1}>
                                        <Button variant="contained" color="error" onClick={() => remove(index)}>
                                            Supprimer
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}

                            <Grid item xs={1} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                                <Button variant="contained" color="success" onClick={() => append({ designation: "", prixUnitaire: 0, montant: 0, devise: "" , volume_ambiant:0,volume_a_15_kg:0,taux_blanc:0,taux_noir:0})}>
                                    Ajouter une désignation
                                </Button>
                            </Grid>
                        </Grid>
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
                                name="destinataire"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="destinataire"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.destinataire}
                                        helperText={errors.destinataire ? errors.destinataire.message : ''}
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
                                name="temperature"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Temperature"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.temperature}
                                        helperText={errors.temperature ? errors.temperature.message : ''}
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
                                        type="date de la facture"
                                        error={!!errors.date}
                                        helperText={errors.date ? errors.date.message : ''}
                                        InputLabelProps={{
                                            shrink: true, // Pour faire en sorte que le label ne chevauche pas le champ
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={4}>
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
                                                    {bonCommande.numeroBonDeCommande} 
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.idBonCommande && <p style={{ color: 'red' }}>{errors.idBonCommande.message}</p>}
                                    </FormControl>
                                )}
                            />
                        </Grid> */}

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
                                name="idStockeur"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idStockeur}>
                                        <InputLabel id="depot-select-label">Sélectionnez le depot</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="depot-select-label"
                                            value={field.value !== undefined ? field.value : ""} // Assurez-vous que la valeur est définie
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} // Gère le changement de valeur
                                            fullWidth
                                        >
                                            {stockeur.map((stockeur) => (
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
                    <Grid xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                            Mise a jour
                        </Button>
                        <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                            Retour
                        </Button>
                    </Grid>
                </form>
            </CardContent>
            {/* Boîte de dialogue de confirmation */}
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirmer la mise a jour</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment mettre a jour cette facture?
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

export default observer(EditFacture);