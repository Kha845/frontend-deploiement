import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface CompartimentDialogProps {
    open: boolean;
    onClose: () => void;
    compartiments: { id: number; volume_compartiment: string; numCompartiment: number }[];
}
const CompartimentDialog: React.FC<CompartimentDialogProps> = ({ open, onClose, compartiments }) => {
     // On limite les affichages à 10 compartiments pour respecter votre demande
     const displayedCompartiments = compartiments.slice(0, 10);
    return (
        <Dialog open={open} onClose={onClose}   sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}>
            <DialogTitle style={{textAlign: 'center', color: 'green'}}>Liste des Compartiments(L)</DialogTitle>
            <DialogContent>
            <TableContainer component={Paper}>
            <Table style={{ width: '100%' }} >
                <TableHead>
                    <TableRow>
                    <TableCell >N°C</TableCell>
                        {/* Ligne des numéros de compartiment */}
                        {displayedCompartiments.map((comp) => (
                            <TableCell key={comp.id} align="center">
                                {`${comp.numCompartiment}`}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    <TableRow>VC</TableRow>
                        {/* Ligne des volumes */}
                        {displayedCompartiments.map((comp) => (
                            <TableCell key={comp.id} align="center">
                                {comp.volume_compartiment}
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

export default CompartimentDialog;
