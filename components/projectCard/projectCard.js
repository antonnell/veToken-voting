import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { formatCurrency } from '../../utils';

import classes from './projectCard.module.css';
import stores from '../../stores/index.js';

import { CONFIGURE_RETURNED, CONNECT_WALLET } from '../../stores/constants';


export default function ProjectCard({ project }) {
  const router = useRouter();

  const [account, setAccount] = useState(null);

  const handleNavigate = () => {
    if(account && account.address) {
      router.push('/project/' + project.id);
    } else {
      callConnect()
    }
  }

  const callConnect = () => {
    stores.emitter.emit(CONNECT_WALLET)
  }

  useEffect(function () {
    const accountConfigured = () => {
      setAccount(stores.accountStore.getStore('account'))
    }

    stores.emitter.on(CONFIGURE_RETURNED, accountConfigured)

    setAccount(stores.accountStore.getStore('account'))

    return () => {
      stores.emitter.removeListener(CONFIGURE_RETURNED, accountConfigured)
    };
  }, []);

  return (
    <Paper elevation={ 1 } className={classes.projectCardContainer} onClick={handleNavigate}>
      <div className={classes.projectCardTitle}>
        <div className={classes.projectCardLogo}>
          <img src={project.logo ? project.logo : '/tokens/unknown-logo.png'} alt="" height={ 70 }/>
        </div>
        <div className={classes.projectCardName}>
          <Typography variant="h2" className={classes.fontWeightBold}>
            {project.name}
          </Typography>
          <Typography variant="h5" className={classes.fontWeightBold}>
            {project.url}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
