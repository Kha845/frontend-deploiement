import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
// import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
interface FactureRow {
  id: number;
  reference: string;
}
const paginationModel = { page: 0, pageSize: 5 };
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  motif: Yup.string().required('Motif'),
});
const ReceptionFactureList = () => {
  const { rootStore: { factureStore } } = useStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [data, setData] = React.useState<FactureRow | null>(null);
  const [motifText, setMotifText] = React.useState('');
  const { id } = useParams();
  const { control, formState: { errors },reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      motif: "",
    },
  });
  const initTable = async () => {
    try {
      const resData = await factureStore.factureLists();
      setData(resData);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };

  React.useEffect(() => {
    initTable();
  }, []);

  if (!data) {
    console.log('data:', data);
    return <Box textAlign='center' mt={5} marginLeft='790px'><CircularProgress /></Box>;
  }
  // Filtrer les données en fonction de la valeur de recherche
  const filteredRows: FactureRow[] = (factureStore.rowData as unknown as FactureRow[]).filter((row) => {
    if (!searchValue) return true;
    return row.reference.toLowerCase().includes(searchValue.toLowerCase())

  });
  return (
    <Box sx={{ paddingRight: '0px' }}>
      <Box display="flex" justifyContent="center" marginBottom={2} alignItems="center">
        <Typography variant='h4' className='text-center' color='success'>
          La liste des factures envoyées par l'agent comptable
        </Typography>
      </Box>
      <Paper sx={{ height: 450, width: '112%', }}>
        <DataGrid
          rows={filteredRows.sort((a, b) => b.id - a.id)}
          columns={factureStore.columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          getRowId={(row) => row.id}
          sx={{ border: 0, width: '100%' }}
        />
      </Paper>
    <Box>
      <Dialog open={factureStore.openMotifDialog} onClose={factureStore.closeDialog}  >
        <DialogTitle>Motif de renvoi</DialogTitle>
        <DialogContent>
          <Controller
            name="motif"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline // Ajoute le mode "textarea"
                rows={2} // Nombre de lignes visibles du textarea
                label="Saisir le motif"
                variant="filled"
                fullWidth
                margin="normal"
                error={!!errors.motif}
                helperText={errors.motif ? errors.motif.message : ''}
                sx={{ width: '400px', height: '56px' }}
                value={motifText}
                onChange={(e) => setMotifText(e.target.value)}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={factureStore.closeDialog} color="success">
            Annuler
          </Button>
          <Button
            onClick={() => factureStore.renvoyerAvecMotif(factureStore.factureId, motifText)}
            color="success"
            variant="contained"
            disabled={!motifText.trim()} // Désactiver si le motif est vide
          >
            Envoyer
          </Button>
          
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default observer(ReceptionFactureList);
