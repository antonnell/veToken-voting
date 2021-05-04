import React, { useState } from 'react';
import { Typography, Paper, TextField, InputAdornment, Button, Tooltip, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '../../utils';

import classes from './veAssetGeneration.module.css';

export default function VeAssetGeneration({ project }) {
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const [selectedValue, setSelectedValue] = React.useState('week');

  const setAmountPercent = (percent) => {
    if (!project || !project.tokenMetadata) {
      return;
    }

    setAmount(BigNumber(project.tokenMetadata.balance).times(percent).div(100).toFixed(project.tokenMetadata.decimals));
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const onLock = () => {};

  return (
    <Paper elevation={1} className={classes.projectCardContainer}>
      <Typography variant="h2">Generate {project && project.veTokenMetadata ? project.veTokenMetadata.symbol : 'veAsset'}</Typography>

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
              Lock until
            </Typography>
          </div>
        </div>
        <TextField
          fullWidth
          id="date"
          type="date"
          defaultValue="2017-05-24"
          variant="outlined"
          className={classes.textField}
          onChange={handleDateChange}
          value={selectedDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputTitle}>
            <Typography variant="h5" noWrap>
              Lock for
            </Typography>
          </div>
        </div>
        <RadioGroup row aria-label="position" name="position" defaultValue="top">
          <FormControlLabel
            value="week"
            control={<Radio color="primary" />}
            label="1 week"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="month"
            control={<Radio color="primary" />}
            label="1 month"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="year"
            control={<Radio color="primary" />}
            label="1 year"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="years"
            control={<Radio color="primary" />}
            label="4 years"
            labelPlacement="bottom"
          />
        </RadioGroup>
      </div>
      <div className={classes.actionButton}>
        <Button fullWidth disableElevation variant="contained" color="primary" size="large" onClick={onLock}>
          <Typography variant="h5">Lock {project?.tokenMetadata?.symbol}</Typography>
        </Button>
      </div>
      <div className={classes.calculationResults}>
        <div className={classes.calculationResult}>
          <Typography variant="h2">You will receive: </Typography>
          <Typography variant="h2" className={classes.bold}></Typography>
        </div>
      </div>
    </Paper>
  );
}
