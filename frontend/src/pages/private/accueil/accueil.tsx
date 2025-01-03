import { useEffect, useState } from 'react';
import { useStore } from '../../../store/rootStore';
import imageAccueil from '/images/stockeur-removebg-preview.png';
import { motion } from 'framer-motion';

const Home = () => {
  const [userInfo, setUserInfo] = useState<{ prenom: string; nom: string; roles: string[] } | null>(null);
  const { rootStore: { authStore } } = useStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = authStore.getUserInfo(); // Récupérer les infos de l'utilisateur
      setUserInfo(userData); // Stocker les infos localement dans le state
    };
    fetchUserInfo();
  }, [authStore]);

  const animationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='presentation' style={{marginLeft:'400px'}}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animationVariants}
        transition={{ duration: 0.5 }} // Durée de l'animation
        style={{ textAlign: 'center', margin: '20px 0', color: 'green' }}
      >
        {userInfo && (
          <h2 className='font-bold'>
            <span className='text-yellow-400 text-xl'>Bienvenue, </span> {userInfo.prenom} {userInfo.nom}!
            <h2 >
              <span className='text-yellow-400'>Rôle: </span>{userInfo.roles && userInfo.roles.length > 0 ? userInfo.roles.join(', ') : 'Aucun rôle'}
            </h2>
          </h2>
        )}
      </motion.div>
      <img src={imageAccueil} alt="Logo" />
    </div>
  );
}

export default Home;
