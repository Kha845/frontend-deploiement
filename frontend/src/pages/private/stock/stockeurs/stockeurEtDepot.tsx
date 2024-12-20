import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import StockeurCreate from './creatStockeur';
import  DepotCreate from './createDepot'
// Définir un type pour les données du stockeur
interface StockeurData {
  nom: string;
  telephone: string;
  adresse: string;
}

// Définir un type pour les données des depots
interface DepotData {
  nom: string;
  adresse: string;
}

const StockeurEtDepot = () => {
  const [stockeurData, setStockeurData] = useState<StockeurData | null>(null);
  const [depots, setDepots] = useState<DepotData[]>([]);
  const { rootStore: { stockeurStore } } = useStore(); // Store pour l'appel API
  const [openDialog, setOpenDialog] = useState(false);

  const handleNext = (data: StockeurData) => {
    setStockeurData(data); // Stocker les données du stockeur
  };

  const handleAddDepot = (data: DepotData) => {
    const newDepot = {
      ...data,
      nom: data.nom, // Génération automatique du numero de dépôt
    };
    setDepots([...depots, newDepot]); // Ajouter le depot avec le numéro généré
  };;

  const handleConfirm = async () => {
    const payload = {
      nom: stockeurData?.nom,
      telephone: stockeurData?.telephone,
      adresse: stockeurData?.adresse,
      depots: depots, // Vérifiez que cela correspond à la structure attendue
    };

    try {
      await stockeurStore.createData(payload); // Appel API pour créer le camion et les compartiments
      console.log("Payload envoyé : ", payload);
      
      // Réinitialiser les données après la soumission
      setStockeurData(null);
      setDepots([]);
      setOpenDialog(false); // Fermer la boîte de dialogue après soumission
    } catch (error) {
      console.error('Erreur lors de la création du stockeur et des depots:', error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Fermer la boîte de dialogue sans soumettre
  };

  return (
    <div>
      {!stockeurData ? (
        <StockeurCreate onNext={handleNext} />
      ) : (
        < DepotCreate onSubmitDepot={handleAddDepot} />
      )}

      {/* Afficher les compartiments ajoutés */}
      {depots.length > 0 && (
        <Box sx={{marginLeft: '650px'}}>
          <Typography variant="h6" textAlign='center'>Depots ajoutés :</Typography>
          {depots.map((depot, index) => (
            <div key={index}>
              Nom Depot : {depot.nom}, Adresse : {depot.adresse}
            </div>
          ))}
        </Box>
      )}

       {/* Box pour le bouton de soumission */}
       {stockeurData && (
        <Box mt={2} sx={{marginLeft: '650px'}}> {/* mt={2} pour ajouter une marge en haut */}
          <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
            Enregistrer Stockeur et Depots
          </Button>
        </Box>
      )}

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirmer la création</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment créer ce stockeur et ces depots ?
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

export default StockeurEtDepot;
