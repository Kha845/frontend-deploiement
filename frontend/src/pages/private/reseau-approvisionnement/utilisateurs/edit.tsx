import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// Schéma de validation pour le mot de passe
const passwordSchema = Yup.string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .matches(/[@$!%*?&#]/, 'Le mot de passe doit contenir au moins un caractère spécial');

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    prenom: Yup.string().required('Prénom est requis'),
    nom: Yup.string().required('Nom est requis'),
    telephone: Yup.string()
        .required('Téléphone est requis')
        .min(9, 'Le numéro de téléphone doit avoir 9 chiffres')
        .max(12, 'Le numéro de téléphone doit avoir 12 chiffres'),
    email: Yup.string().email("L'email est invalide").required('Email est requis'),
    adresseSGF: Yup.string().required('Adresse est requise'),
    matricule: Yup.string().required('Le matricule est requis'),
    poste: Yup.string().required('Le poste est requis'),
    password: Yup.string()
        .nullable()
        .notRequired(), // Assurez-vous que ce champ est présent dans le sch
});
const EditUtilisateurs = () => {
    const navigate = useNavigate();
    const { rootStore: { utilisateurStore } } = useStore();
    const { getData, updateData } = utilisateurStore;
    const { idUser } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [changePassword, setChangePassword] = useState(false);
    const { handleSubmit, control, formState: { errors }, reset,setError } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            prenom: "",
            nom: "",
            email: "",
            telephone: "",
            matricule: "",
            poste: "",
            adresseSGF: "",
            password: "",
        },
    });
    const options = [
        'DG', 
        'DGA', 
        'Chef Comptable', 
        'Agent Comptable', 
        'Secretaire', 
        'Autre'
      ];
    // Gestion de la soumission
    type ValidationKeys = 'prenom' | 'nom' | 'telephone' | 'email' | 'adresseSGF' | 'matricule' | 'poste' | 'password';
    const onSubmit = async (data: any) => {
        const validationErrors: Record<ValidationKeys, { type: string; message: string } | undefined> = {
            prenom: undefined,
            nom: undefined,
            telephone: undefined,
            email: undefined,
            adresseSGF: undefined,
            matricule: undefined,
            poste: undefined,
            password: undefined,
        };
    
        // Validation manuelle du mot de passe si le changement est activé
        if (changePassword) {
            if (!data.password) {
                validationErrors.password = { type: 'manual', message: 'Le mot de passe est requis lorsque vous le changez' };
            } else {
                try {
                    await passwordSchema.validate(data.password); // Valider avec Yup
                } catch (error: any) {
                    validationErrors.password = { type: 'manual', message: error.errors[0] };
                }
            }
        }
    
        // Mettre à jour l'état des erreurs avec les erreurs de validation manuelle
        if (Object.values(validationErrors).some(error => error !== undefined)) {
            for (const key in validationErrors) {
                // Type assertion pour que TypeScript sache que key est une ValidationKeys
                const validationKey = key as ValidationKeys; 
                if (validationErrors[validationKey]) { // Vérifier si une erreur existe pour la clé
                    setError(validationKey, validationErrors[validationKey]); // Utiliser la clé correctement typée
                }
            }
            return; // Ne pas soumettre le formulaire s'il y a des erreurs
        }
    
        // Continuer avec la soumission des données
        setFormData(data);
        setOpenDialog(true); // Ouvrir la boîte de dialogue uniquement si pas d'erreurs
    };
    
    
    // Confirmer la mise a jour de l'utilisateur
    const handleConfirm = async () => {
        try {
            if (idUser && formData) {
                // Effectuer la mise à jour des données
                const resData = await updateData(idUser, formData);
                console.log("Response Data: ", resData);
                navigate('/accueil/reseau-approvisionnement/utilisateurs')
            } else {
                navigate(-1);
            }
        } catch (error: any) {
            console.log("Erreur lors de la mise à jour :", error);
        } finally {
            setOpenDialog(false); // Fermer la boîte de dialogue après la mise à jour
        }
    };
    // Annuler la création de l'utilisateur
    const handleCancel = () => {
        setOpenDialog(false); // Fermer la boîte de dialogue
    };
    // Initialiser le formulaire avec les données existantes
    const initForm = async () => {
        try {
            if (idUser) {
                const resData = await getData(idUser);
                console.log("response data", resData.data)

                reset(
                    {
                        prenom: resData.data.prenom,
                        nom: resData.data.nom,
                        telephone: resData.data.telephone,
                        adresseSGF: resData.data.adresseSGF,
                        email: resData.data.email,
                        matricule: resData.data.matricule,
                        poste: resData.data.poste
                    }); // Charger les données existantes des utilisateurs
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
    }, [idUser]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Edition Utilisateur
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="prenom"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Prénom"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.prenom}
                                        helperText={errors.prenom ? errors.prenom.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="nom"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nom"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.nom}
                                        helperText={errors.nom ? errors.nom.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="telephone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Numéro de téléphone"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.telephone}
                                        helperText={errors.telephone ? errors.telephone.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.email}
                                        helperText={errors.email ? errors.email.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="adresseSGF"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Adresse"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.adresseSGF}
                                        helperText={errors.adresseSGF ? errors.adresseSGF.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="matricule"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Matricule"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.matricule}
                                        helperText={errors.matricule ? errors.matricule.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Champ pour le mot de passe */}
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel control={
                                <Checkbox
                                    checked={changePassword}
                                    onChange={() => setChangePassword(!changePassword)}
                                />
                            }
                                label="Changer le mot de passe"
                            />
                        </Grid>

                        {changePassword && (
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Mot de passe"
                                            type="password"
                                            variant="filled"
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.password}
                                            helperText={errors.password ? errors.password.message : ''}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="poste"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Poste"
                                            variant="filled"
                                            fullWidth
                                            margin="normal"
                                            select
                                            error={!!errors.poste}
                                            helperText={errors.poste ? errors.poste.message : ''}
                                            value={field.value}  // S'assurer que la valeur est bien prise en compte
                                        >
                                            {options.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                            {!options.includes(field.value) && (
                                                <MenuItem key={field.value} value={field.value}>
                                                {field.value}
                                                </MenuItem>
                                            )}
                                        </TextField>
                                    )}
                                />
                            </Grid>

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
                <DialogTitle>Confirmer la mise a jour</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment mettre a jour cet utilisateur ?
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

export default observer(EditUtilisateurs);