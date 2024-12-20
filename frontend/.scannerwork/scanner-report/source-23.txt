/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, TextField, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';
import SearchIcon from '@mui/icons-material/Search';
import CompartimentDialog from './CompartimentDialog';

// Définition de l'interface pour les lignes
interface CamionRow {
  id: number;
  marque: string;
}
const paginationModel = { page: 0, pageSize: 5 };

const CamionList = () => {
  const { rootStore: { camionStore } } = useStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCompartiments, setSelectedCompartiments] = React.useState([]);

  const initTable = async () => {
    try {
      await camionStore.camionsLists();
      console.log('les donnes de camion row data',camionStore.rowData)
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };

  React.useEffect(() => {
    initTable();
  }, []);

  // Filtrer les données en fonction de la valeur de recherche
  const filteredRows: CamionRow[] = (camionStore.rowData as unknown as CamionRow[]).filter((row) => {
    if (!searchValue) return true;
    return row.marque.toLowerCase().includes(searchValue.toLowerCase())
  });
  const handleOpenDialog = (compartiments:any) => {
    setSelectedCompartiments(compartiments);
    setDialogOpen(true);
};
  return (
    <Box sx={{marginLeft:'120px'}}>
      <Box display="flex" justifyContent="center" marginBottom={2} alignItems="center">
        <Typography variant='h4' className='text-center' color='success'>
          La liste des camions citernes et leurs compartiment
        </Typography>
      </Box>
        <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
          <Button variant="contained" component={Link} to={'create'}
           color='success' sx={{marginRight: 20, width: '300px'}}>
            Nouveau Camion
          </Button>
          <Box display="flex" alignItems="center">
          <TextField 
              variant="outlined"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
                      sx={{ width: '500px', marginRight: 1,'& .MuiOutlinedInput-root': {
                            height: '35px',  // Ajustez la hauteur totale ici
                            fontSize: '0.875rem', // Optionnel : ajuster la taille du texte pour correspondre
                        },}}
                      InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Paper sx={{ height: 500, width: '105%' }}>
          <DataGrid
             rows={filteredRows.sort((a, b) => b.id - a.id)}
            columns={[
              {
                field: 'immatricule', // Colonne pour l'immatricule
                headerName: 'Immatricule',
                width: 150
              },
              {
                field: 'marque', // Colonne pour la marque
                headerName: 'Marque',
                width: 150
              },
              {
                field: 'compartiments', // Colonne pour les compartiments
                headerName: 'Compartiments',
                width: 250,
                renderCell: (params) => (
                  <Button color='success' onClick={() => handleOpenDialog(params.row.compartiments)}>
                    Voir Compartiments
                  </Button>
                )
              },
              // Ajoutez ensuite les autres colonnes qui ne sont pas mentionnées dans l'ordre spécifique
              ...camionStore.columns.filter(col => col.field !== 'immatricule' && col.field !== 'marque' && col.field !== 'compartiments')
            ]}            
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.id} // Spécifier quelle propriété utiliser comme identifiant
            sx={{ border: 0, width: '100%' }}
          />
        </Paper>
        <CompartimentDialog 
                    open={dialogOpen} 
                    onClose={() => setDialogOpen(false)} 
                    compartiments={selectedCompartiments} 
           />
    </Box>
  );
};

export default observer(CamionList);
