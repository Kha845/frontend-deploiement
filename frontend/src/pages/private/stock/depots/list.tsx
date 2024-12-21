/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Button, Card, CardContent, Typography, TextField } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import SearchIcon from '@mui/icons-material/Search';

// Définition de l'interface pour les lignes
interface DepotRow {
  id: number;
  nom: string;
}
const paginationModel = { page: 0, pageSize: 5 };

const DepotList = () => {
  const { rootStore: { depotStore } } = useStore();
  const [searchValue, setSearchValue] = React.useState('');

  const initTable = async () => {
    try {
      await depotStore.depotsList();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };

  React.useEffect(() => {
    initTable();
  }, []);

  // Filtrer les données en fonction de la valeur de recherche
  const filteredRows: DepotRow [] = (depotStore.rowData as unknown as DepotRow []).filter((row) => {
    if (!searchValue) return true;
    return row.nom.toLowerCase().includes(searchValue.toLowerCase())
  });

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' className='text-center' color='success'>
          La liste des depots
        </Typography>
        <Box display="flex" justifyContent="center" marginBottom={2} alignItems="center">
          <Box display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ width: '400px', marginRight: 0.5,
                '& .MuiOutlinedInput-root': {
                      height: '35px',  // Ajustez la hauteur totale ici
                      fontSize: '0.875rem', // Optionnel : ajuster la taille du texte pour correspondre
                }}}
            />
            <Button variant='contained' color='success' sx={{ marginLeft: 0.5 }}>
              Rechercher
              <SearchIcon />
            </Button>
          </Box>
        </Box>

        <Paper sx={{ height: 500, width: '110%' }}>
          <DataGrid
            rows={filteredRows}
            columns={depotStore.columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.id} // Spécifier quelle propriété utiliser comme identifiant
            sx={{ border: 0, width: '100%' }}
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default observer(DepotList);
