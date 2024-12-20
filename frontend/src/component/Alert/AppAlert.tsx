/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/rootStore';
import { AlertTitle } from '@mui/material';

const AppAlert = () => {
  const { rootStore: { alertStore } } = useStore();
  const { isAlertOpen, close, alertData } = alertStore;

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={isAlertOpen}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                close();
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
          severity={alertData?.status}
        >
          <AlertTitle>
         {alertData?.status.toUpperCase() ?? 'error'}
          </AlertTitle>
          {alertData?.message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default observer(AppAlert);
