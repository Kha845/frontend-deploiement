import React, { useState } from 'react';
import { Button } from '@mui/material';
import MotifDialog from './motifDialog';
import { useStore } from '../../../../store/rootStore';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
const FactureActions: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { rootStore: { factureStore } } = useStore();
  const { updateData ,renvoyer} = factureStore;
  const { id } = useParams();

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmitMotif = async (motif: string) => {
    console.log('Motif soumis :', motif);
    if (id && motif) {
        // Effectuer la mise à jour des données
        const resData = await updateData(id,  motif);
        console.log("Response Data: ", resData);
        renvoyer(id);
      }
  };

  return (
    <div style={{position: 'absolute',top: '20%',margin: 0, width: '100%', maxWidth: 'none',marginLeft:'50%'}}
      >
      <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
        Ouvrir le popup
      </Button>
      <MotifDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitMotif}
      />
    </div>
  );
};

export default observer(FactureActions);
