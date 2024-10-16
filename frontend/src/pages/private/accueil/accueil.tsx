import {Typography } from "@mui/material";
import imageAccueil from '/images/stock.jfif';
const Home = () =>{

    return (
        <div>
            <Typography className="text-lg font-bold mb-2 text-green-800">
                Bienvenue Marieme Diop | Comptable
            </Typography>
            <img src={imageAccueil} alt="Logo" style={{ width: '100%', marginBottom: '10px',  }} />
        </div>
    )
}
export default Home;