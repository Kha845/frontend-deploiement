/* eslint-disable react-refresh/only-export-components */
import { Box, Toolbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

const Fournisseurs = () => {
    return (
        <Box component="main" style={{ marginTop: '0px', width:'100%'}}> {/* Ajuster les marges et padding ici */}
                <Toolbar sx={{ minHeight: '40px' }} /> {/* Diminuez la hauteur du Toolbar si nécessaire */}
                <Outlet />
        </Box>
    );
};

export default observer(Fournisseurs);
