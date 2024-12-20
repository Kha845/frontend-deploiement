import { useState } from 'react';
import CreateCompartiment from './createCompartiment';
import CamionCreate from './createCamion';
import { Typography, Button, Box } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// Définir un type pour les données du camion
interface CamionData {
  immatricule: string;
  marque: string;
  capacite: string;
}

// Définir un type pour les données des compartiments
interface CompartimentData {
  volume_compartiment: number; // Changez le type en number
  numCompartiment: number; // Ajout du numéro de compartiment
}

const CamionEtCompartiment = () => {
  const [camionData, setCamionData] = useState<CamionData | null>(null);
  const [compartiments, setCompartiments] = useState<CompartimentData[]>([]);
  const { rootStore: { camionStore } } = useStore(); // Store pour l'appel API
  const [openDialog, setOpenDialog] = useState(false);

  // Fonction appelée lors de la soumission du formulaire de création du camion
  const handleNext = (data: CamionData) => {
    setCamionData(data); // Stocker les données du camion
  };

  // Fonction appelée lors de la soumission d'un nouveau compartiment
  const handleAddCompartiment = (data: Omit<CompartimentData, 'numCompartiment'>) => {
    const newCompartiment = {
      ...data,
      numCompartiment: compartiments.length + 1, // Génération automatique du numéro de compartiment
    };
    setCompartiments([...compartiments, newCompartiment]); // Ajouter le compartiment
  };

  // Fonction de confirmation pour envoyer les données au store et à l'API
  const handleConfirm = async () => {
    const payload = {
      immatricule: camionData?.immatricule,
      marque: camionData?.marque,
      capacite: camionData?.capacite,
      compartiments: compartiments, // Vérifiez que cela correspond à la structure attendue
    };

    try {
      await camionStore.createData(payload); // Appel API pour créer le camion et les compartiments
      console.log("Payload envoyé : ", payload);
      
      // Réinitialiser les données après la soumission
      setCamionData(null);
      setCompartiments([]);
      setOpenDialog(false); // Fermer la boîte de dialogue après soumission
    } catch (error) {
      console.error('Erreur lors de la création du camion et des compartiments:', error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Fermer la boîte de dialogue sans soumettre
  };

  return (
    <div>
      {!camionData ? (
        <CamionCreate onNext={handleNext} />
      ) : (
        <CreateCompartiment 
          onSubmitCompartiment={handleAddCompartiment} 
          nextCompartimentNumber={compartiments.length + 1} 
          existingVolumes={compartiments.map(compartiment => compartiment.volume_compartiment)} // Ajout des volumes existants
          maxCamionCapacity={parseFloat(camionData.capacite)} // Convertir la capacité en nombre
        />
      )}

      {/* Afficher les compartiments ajoutés */}
      {compartiments.length > 0 && (
        <Box sx={{marginLeft:'700px'}}>
          <Typography variant="h6" textAlign='center'>Compartiments ajoutés :</Typography>
          {compartiments.map((compartiment, index) => (
            <div key={index}>
              <Typography textAlign='center'>Compartiment {compartiment.numCompartiment} : Volume - {compartiment.volume_compartiment}</Typography>
            </div>
          ))}
        </Box>
      )}

      {/* Bouton pour enregistrer le camion et les compartiments */}
      {camionData && (
        <Box mt={2} sx={{display:'flex',justifyContent:'center', marginLeft:'700px'}}>
          <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
            Enregistrer Camion et Compartiments
          </Button>
        </Box>
      )}

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirmer la création</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment créer ce camion et ces compartiments ?
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
    </div>
  );
};

export default CamionEtCompartiment;
