// src/constants/subMenus.js
import {
    Home,
    Storage,
    LocalShipping,
    LocalGasStation,
    Summarize,
    OilBarrel,
    EvStation,
    Warehouse,
    LocalConvenienceStore,
    CarRepair,
    BakeryDiningRounded,
    Category,
    Assignment,
    Payment,
    ReceiptLong,
    Storefront,
    Group,
    Settings,
    AirportShuttle,
} from '@mui/icons-material';

type SubMenuKeys = "Tableau de bord" | "Stock" | "Client" | "Facture" | "Réseau d'approvisionnement" | "Accueil";

const subMenus: Record<SubMenuKeys, { label: string; path: string; icon: JSX.Element }[]> = {
    "Tableau de bord": [
        { label: "SenStock", path: "/tableau-de-bord/senstock", icon: <OilBarrel /> },
        { label: "DOT", path: "/tableau-de-bord/dot", icon: <EvStation /> },
        { label: "ORYX", path: "/tableau-de-bord/oryx", icon: <LocalGasStation /> },
        { label: "RECAPILATIF", path: "/tableau-de-bord/recapilatif", icon: <Summarize /> },
    ],
    "Stock": [
        { label: "Stockeur", path: "/stock/stockeur", icon: <Storage /> },
        { label: "Dépôt", path: "/stock/depot", icon: <Warehouse /> },
    ],
    "Client": [
        { label: "Station Service", path: "/client/station-service", icon: <LocalConvenienceStore /> },
        { label: "Garage Automobile", path: "/client/garage-automobile", icon: <CarRepair /> },
        { label: "Boulangerie", path: "/client/boulangerie", icon: <BakeryDiningRounded /> },
        { label: "Autre", path: "/client/autre", icon: <Category /> },
    ],
    "Facture": [
        { label: "Bon de livraison", path: "/facture/bon-livraison", icon: <LocalShipping /> },
        { label: "Bon de commande", path: "/facture/bon-commande", icon: <Assignment /> },
        { label: "Mode de Paiement", path: "/facture/mode-paiement", icon: <Payment /> },
        { label: "Facture", path: "/facture/facture", icon: <ReceiptLong /> },
    ],
    "Réseau d'approvisionnement": [
        { label: "Fournisseurs", path: "/reseau-approvisionnement/fournisseurs", icon: <Storefront /> },
        { label: "Utilisateurs", path: "/reseau-approvisionnement/utilisateurs", icon: <Group /> },
        { label: "Configuration", path: "/reseau-approvisionnement/configuration", icon: <Settings /> },
        { label: "Camions", path: "/reseau-approvisionnement/camions", icon: <AirportShuttle /> },
    ],
    "Accueil": [
        { label: "Home", path: "/accueil", icon: <Home /> },
    ],
};

export default subMenus;
