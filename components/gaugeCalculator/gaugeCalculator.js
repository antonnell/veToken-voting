import React, { useState } from 'react';
import { Typography, Paper, TextField, InputAdornment, Button, Tooltip } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '../../utils';

import classes from './gaugeCalculator.module.css';

export default function GaugeCalculator({ project }) {
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState(false);
  const [veAmount, setVeAmount] = useState(0);
  const [veAmountError, setVeAmountError] = useState(false);
  const [vault, setVault] = useState(null);

  const setAmountPercent = (percent) => {
    if (!project || !project.tokenMetadata) {
      return;
    }

    setAmount(BigNumber(project.tokenMetadata.balance).times(percent).div(100).toFixed(project.tokenMetadata.decimals));
  };

  const onVaultSelectChanged = (event, theOption) => {
    setVault(theOption);
  };

  const onCalculate = () => {};

  return (
    <Paper elevation={1} className={classes.projectCardContainer}>
      <Typography variant="h2">Calculate Gauge Lockup amount</Typography>

      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputTitle}>
            <Typography variant="h5" noWrap>
              Select Vault
            </Typography>
          </div>
        </div>
        <Autocomplete
          disableClearable={true}
          options={project?.vaults}
          value={vault}
          onChange={onVaultSelectChanged}
          getOptionLabel={(option) => option.name}
          fullWidth={true}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <img src={option.logo} alt="" width={30} height={30} style={{ marginRight: '10px' }} />
              <div className={classes.text}>{option.name}</div>
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                ...{
                  placeholder: 'Search for vault',
                  startAdornment: vault && (
                    <InputAdornment position="start">
                      <img src={vault?.logo} alt="" width={30} height={30} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          )}
        />
      </div>

      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputTitle}>
            <Typography variant="h5" noWrap>
              Your {project?.tokenMetadata?.symbol} Balance
            </Typography>
          </div>
          <div className={classes.balances}>
            <Typography
              variant="h5"
              onClick={() => {
                setAmountPercent(100);
              }}
              className={classes.value}
              noWrap
            >
              Balance: {!project?.tokenMetadata?.balance ? <Skeleton /> : formatCurrency(project.tokenMetadata.balance)}
            </Typography>
          </div>
        </div>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="0.00"
          value={amount}
          error={amountError}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={project?.tokenMetadata?.logo} alt="" width={30} height={30} />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputTitle}>
            <Typography variant="h5" noWrap>
              Your {project?.veTokenMetadata?.symbol} Balance
            </Typography>
          </div>
          <div className={classes.balances}>
            <Typography
              variant="h5"
              onClick={() => {
                setAmountPercent(100);
              }}
              className={classes.value}
              noWrap
            >
              Balance: {!project?.tokenMetadata?.balance ? <Skeleton /> : formatCurrency(project.tokenMetadata.balance)}
            </Typography>
          </div>
        </div>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="0.00"
          value={veAmount}
          error={veAmountError}
          onChange={(e) => {
            setVeAmount(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={project?.tokenMetadata?.logo} alt="" width={30} height={30} />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={ classes.actionButton }>
        <Button fullWidth disableElevation variant="contained" color="primary" size="large" onClick={onCalculate} >
          <Typography variant="h5">Calculate</Typography>
        </Button>
      </div>
      <div className={ classes.calculationResults }>
        <div className={ classes.calculationResult}>
          <Typography variant='h2'>Vault boost amount: </Typography>
          <Typography variant='h2' className={ classes.bold }></Typography>
        </div>
        <div className={ classes.calculationResult}>
          <Typography variant='h2'>{project?.veTokenMetadata?.symbol} required for max boost:</Typography>
          <Typography variant='h2' className={ classes.bold }></Typography>
        </div>
        <div className={ classes.calculationResult}>
          <Typography variant='h2'>Vault APY: </Typography>
          <Typography variant='h2' className={ classes.bold }></Typography>
        </div>
      </div>
    </Paper>
  );
}
