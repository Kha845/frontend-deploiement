/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';

// // Définition de l'interface pour les lignes
 interface IpmRow {
    id: number;
    nb_agents: number;
    nb_de_mois: number,
    cotisation_adherant: number,
    cotisation_employeur: number,
    total_cotisations: number,
 }
const paginationModel = { page: 0, pageSize: 5 };

const IpmList = () => {
    const { rootStore: { ipmStore } } = useStore();
    const [data,setData] = React.useState<IpmRow | null>(null);

    const initTable = async () => {
        try {
           const ipmData =  await ipmStore.listIpm();
           console.log('les donnees ipm', ipmData);
           setData(ipmData);
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la table:", error);
        }
    };

    React.useEffect(() => {
        initTable();
    }, [])
        // Créer une version triée des données sans muter l'original
     const sortedRows = React.useMemo(() => {
            return ipmStore.rowData.slice().sort((a: any, b: any) => b.id - a.id);
        }, [ipmStore.rowData]);

     if (!data) {
            console.log('data:',data);
            return <Box textAlign='center' mt={5} marginLeft='790px'><CircularProgress /></Box>;
     }
    return (
        <Box sx={{ marginLeft: '210px' }}>
            <Box>
                <Typography variant='h4' className='text-center' color='success'>
                    La liste d'ipm
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
                <Button variant="contained" component={Link} to={'create'} color='success'>
                    Nouveau IPM
                </Button>
                <Box display="flex" alignItems="center">
                    {/* <TextField
                        variant="outlined"
                        placeholder="Rechercher..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        sx={{
                            width: '500px', marginRight: 1, '& .MuiOutlinedInput-root': {
                                height: '35px',  // Ajustez la hauteur totale ici
                                fontSize: '0.875rem', // Optionnel : ajuster la taille du texte pour correspondre
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    /> */}
                </Box>
            </Box>
            <Paper sx={{ height: 500, width: '100%', display: { xs: 2, sm: 6 } }}>
                <DataGrid
                    rows={sortedRows }
                    columns={ipmStore.columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    getRowId={(row) => row.id} // Spécifier quelle propriété utiliser comme identifiant
                    sx={{ border: 0, width: '100%' }}
                />
            </Paper>
        </Box>
    );
};

export default observer(IpmList);
