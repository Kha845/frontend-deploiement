import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface DepotDialogProps {
    open: boolean;
    onClose: () => void;
    depots: { id: number; nom: string; adresse: string }[];
}
const  DepotDialog: React.FC<DepotDialogProps> = ({ open, onClose, depots }) => {
     // On limite les affichages à 10 compartiments pour respecter votre demande
     const displayedDepots = depots.slice(0, 10);
    return (
        <Dialog open={open} onClose={onClose}   sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}>
            <DialogTitle style={{textAlign: 'center', color: 'green'}}>Liste des depots de chaque stockeur</DialogTitle>
            <DialogContent>
            <TableContainer component={Paper}>
            <Table style={{ width: '100%' }} >
                <TableHead>
                    <TableRow>
                    <TableCell >Nom</TableCell>
                        {/* Ligne des numéros de compartiment */}
                        {displayedDepots.map((comp) => (
                            <TableCell key={comp.id} align="center">
                                {`${comp.nom}`}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    <TableRow>Adresse</TableRow>
                        {/* Ligne des volumes */}
                        {displayedDepots.map((comp) => (
                            <TableCell key={comp.id} align="center">
                                {comp.adresse}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DepotDialog;
