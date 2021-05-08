import React, { useState, useEffect } from 'react';

import { Typography, Paper, TextField, InputAdornment, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import classes from './balances.module.css';
import BigNumber from 'bignumber.js';

import stores from '../../stores/index.js';
import { VAULTS_UPDATED, ETHERSCAN_URL, LEND_UPDATED } from '../../stores/constants';

import { formatCurrency, formatAddress } from '../../utils';

function Balances({ project }) {

  return (
    <Paper elevation={1} className={classes.overviewContainer}>
      <div className={classes.overviewCard}>
        <div>
          <Typography variant="h5">{project?.tokenMetadata?.symbol} balance</Typography>
          <Typography variant="h2">
            {!project?.tokenMetadata?.balance ? <Skeleton style={{ minWidth: '200px ' }} /> : `$ ${formatCurrency(project?.tokenMetadata?.balance, 4)}`}
          </Typography>
        </div>
      </div>
      <div className={classes.separator}></div>
      <div className={classes.overviewCard}>
        <div>
          <Typography variant="h5">{project?.veTokenMetadata?.symbol} balance</Typography>
          <Typography variant="h2">{!project?.veTokenMetadata?.balance ? <Skeleton style={{ minWidth: '200px ' }} /> : `$ ${formatCurrency(project?.veTokenMetadata?.balance, 4)}`}</Typography>
        </div>
      </div>
      <div className={classes.separator}></div>
      <div className={classes.overviewCard}>
        <div>
          <Typography variant="h5">Total {project?.veTokenMetadata?.symbol}</Typography>
          <Typography variant="h2">{!project ? <Skeleton style={{ minWidth: '200px ' }} /> : `$ ${formatCurrency(project?.veTokenMetadata?.totalSupply, 0)}`}</Typography>
        </div>
      </div>
    </Paper>
  );
}

export default Balances;
