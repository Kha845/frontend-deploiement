import { Button, InputAdornment,TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useStore } from '../../store/rootStore';
import { Navigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import logoImageUrl from '/images/logo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
     
//utilisation de la bibiothéque yup pour définir un schéma de validation des données
const schema = yup.object().shape(
    {
        email: yup.string().required('l\'email est requis').email('l\'email n\'est pas valide'),
        password: yup.string().required('Le mot de passe est requis'),
        macAdresse: yup.string().required('Le mac adresse est requis'),
    }
);
const Login = () =>{
    
    const { rootStore: { authStore } } = useStore()
    const [macAddress, setMacAddress] = useState('');

    const  { handleSubmit, control, formState: { errors , isSubmitting},reset} = 
                useForm({resolver: yupResolver(schema), defaultValues: { email: "",password: "", macAdresse: ""}
            });
    
    const isAuthenticated = authStore.isAuthenticated;
    useEffect(() => {axios.get('http://localhost:5000/get-mac')
                          .then(response => {
                            setMacAddress(response.data.macAddress);
                                    console.log(response)
                             })
                          .catch(error => {
                            console.error('Erreur lors de la récupération de l\'adresse MAC:', error);
                    });
      }, []);
    const onSubmit = async (data: any) =>{
        try{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const resData = await authStore.login({
                email: data.email,
                password: data.password,
                macAdresse: macAddress
            })
          
            reset();
        }catch(errors){
            console.log(errors)
        }
    
   }
   if(isAuthenticated){
    return <Navigate to="/dashboard/customers" replace/>
  }
    // const logoImageUrl = './images/logo.jpeg';
    return(
        <div className="min-h-screen w-full  flex flex-col items-center justify-center ">
         <img src={logoImageUrl} alt="Logo" style={{ width: '15%', marginBottom: '10px',  }} />
        <div className="text-center mb-4 text-white bg-gradient-to-r from-green-800 to-yellow-300 w-[690px]">
            <Typography variant="h4">LAGANE</Typography>
        </div>
        <Card className="p-4 border rounded-lg shadow"> 
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
                  <h1 className="text-lg font-bold mb-2 text-green-800">Espace de connexion</h1>
                  <Controller name='email' control={control} render={({field}) => (
                  <TextField fullWidth id="email" label="Email" type='email' variant="filled" 
                  // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
                  error={!! errors.email !!} helperText={errors.email ? errors.email.message : ''} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon className='text-green-800'/>
                      </InputAdornment>
                    ),
                  }}
                  {...field} 
              />)} />
                 <Controller name="password" control={control}
                  render={({field}) => (
                    <TextField fullWidth  id="password" 
                    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
                    label="Password"  type="password" variant="filled" error={!! errors.password !!} helperText={errors.password ? errors.password.message:""}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon className='text-green-800'/>
                          </InputAdornment>
                        ),
                      }}    
                    {...field}/>
                 
        )}/>      
              <Button variant='contained'  
                    color='success' 
                    className="px-4 py-2 text-white rounded" 
                    type="submit" disabled={isSubmitting}> {isSubmitting ? "Vérification..." : "Connecter"}</Button>
            </form>
            </CardContent>
        </Card>
      
    </div>
         
        )
    }
     

export default observer(Login)