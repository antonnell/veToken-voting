import React, { useState } from 'react';
import { Typography, Paper, TextField, InputAdornment, Button, Tooltip } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '../../utils';

import PieChart from './pieChart'
import GaugeVotesTable from './gaugeVotesTable'

import classes from './gaugeVoting.module.css';

export default function GaugeVoting({ project }) {
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState(false);
  const [veAmount, setVeAmount] = useState(0);
  const [veAmountError, setVeAmountError] = useState(false);
  const [gauge, setGauge] = useState(null);

  const setAmountPercent = (percent) => {
    if (!project || !project.tokenMetadata) {
      return;
    }

    setAmount(BigNumber(project.tokenMetadata.balance).times(percent).div(100).toFixed(project.tokenMetadata.decimals));
  };

  const onGaugeSelectChanged = (event, theOption) => {
    setGauge(theOption);
  };

  const onCalculate = () => {};

  return (
    <Paper elevation={1} className={classes.projectCardContainer}>
      <div className={ classes.split }>
        <div className={ classes.half }>
          <Typography variant="h2">Vote for your gauge</Typography>
          <div className={classes.textField}>
            <div className={classes.inputTitleContainer}>
              <div className={classes.inputTitle}>
                <Typography variant="h5" noWrap>
                  Select Gauge
                </Typography>
              </div>
            </div>
            <Autocomplete
              disableClearable={true}
              options={project?.gauges}
              value={gauge}
              onChange={onGaugeSelectChanged}
              getOptionLabel={(option) => option.lpToken.symbol}
              fullWidth={true}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <img src={option.logo} alt="" width={30} height={30} style={{ marginRight: '10px' }} />
                  <div className={classes.text}>{option.lpToken.symbol}</div>
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    ...{
                      placeholder: 'Search for gauge',
                      startAdornment: gauge && (
                        <InputAdornment position="start">
                          <img src={gauge?.logo} alt="" width={30} height={30} />
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
                  Vote Percent
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
          <div className={ classes.actionButton }>
            <Button fullWidth disableElevation variant="contained" color="primary" size="large" onClick={onCalculate} >
              <Typography variant="h5">Calculate</Typography>
            </Button>
          </div>
          <div className={ classes.calculationResults }>
            <div className={ classes.calculationResult}>
              <Typography variant='h2'>Gauge boost amount: </Typography>
              <Typography variant='h2' className={ classes.bold }></Typography>
            </div>
            <div className={ classes.calculationResult}>
              <Typography variant='h2'>{project?.veTokenMetadata?.symbol} required for max boost:</Typography>
              <Typography variant='h2' className={ classes.bold }></Typography>
            </div>
            <div className={ classes.calculationResult}>
              <Typography variant='h2'>Gauge APY: </Typography>
              <Typography variant='h2' className={ classes.bold }></Typography>
            </div>
          </div>
        </div>
        <div className={ classes.half }>
          <Typography variant="h2">Current Vote weighting</Typography>
          <PieChart data={ project?.gauges?.sort((a, b) => a.relativeWeight > b.relativeWeight ? -1 : 1) } />
        </div>
      </div>
      <div>
        {/* <GaugeVotesTable gauges={ project?.gauges } /> */}
      </div>
    </Paper>
  );
}
