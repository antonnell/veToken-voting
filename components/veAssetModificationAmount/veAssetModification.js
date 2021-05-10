import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, InputAdornment, Button, Tooltip, Radio, RadioGroup, FormControlLabel, CircularProgress } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '../../utils';
import moment from 'moment';

import stores from '../../stores/index.js';
import { ERROR, INCREASE_LOCK_AMOUNT, INCREASE_LOCK_AMOUNT_RETURNED, APPROVE_LOCK, APPROVE_LOCK_RETURNED } from '../../stores/constants';

import classes from './veAssetModification.module.css';

export default function VeAssetGeneration(props) {
  const [approveLoading, setApproveLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(function () {
    const lockReturned = () => {
      setLockLoading(false);
      setApproveLoading(false);
    };

    stores.emitter.on(INCREASE_LOCK_AMOUNT_RETURNED, lockReturned);
    stores.emitter.on(APPROVE_LOCK_RETURNED, lockReturned);
    stores.emitter.on(ERROR, lockReturned);

    return () => {
      stores.emitter.removeListener(INCREASE_LOCK_AMOUNT_RETURNED, lockReturned);
      stores.emitter.removeListener(APPROVE_LOCK_RETURNED, lockReturned);
      stores.emitter.removeListener(ERROR, lockReturned);
    };
  }, []);

  const setAmountPercent = (percent) => {
    if (!project || !project.tokenMetadata) {
      return;
    }

    setAmount(BigNumber(project.tokenMetadata.balance).times(percent).div(100).toFixed(project.tokenMetadata.decimals));
  };

  const updateProject = () => {
    setProject(props.project);
  };

  useEffect(updateProject, [props]);

  const onLock = () => {
    setAmountError(false);
    let error = false;

    if (!amount || amount === '') {
      setAmountError(true);
      error = true;
    }

    if (!error) {
      setLockLoading(true);

      stores.dispatcher.dispatch({ type: INCREASE_LOCK_AMOUNT, content: { amount, project } });
    }
  };

  const onApprove = () => {
    setAmountError(false);
    setSelectedDateError(false);
    let error = false;

    if (!amount || amount === '') {
      setAmountError(true);
      error = true;
    }

    if (!error) {
      setApproveLoading(true);
      stores.dispatcher.dispatch({ type: APPROVE_LOCK, content: { amount: 'max', project } });
    }
  };

  return (
    <Paper elevation={1} className={classes.projectCardContainer}>
      <Typography variant="h2" className={ classes.sectionHeader }>Lock additional {project && project.tokenMetadata ? project.tokenMetadata.symbol : 'asset'}</Typography>
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
              Balance: {formatCurrency(project?.tokenMetadata?.balance)}
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
      <div className={classes.actionButton}>
        <Button
          fullWidth
          disableElevation
          variant="contained"
          color="primary"
          size="large"
          onClick={onApprove}
          disabled={ approveLoading || !amount || amount === '' || isNaN(amount) || BigNumber(amount).eq(0) || BigNumber(project?.tokenMetadata?.allowance).gte(amount)}
          className={classes.button}
        >
          <Typography variant="h5">{approveLoading ? <CircularProgress size={15} /> : `Approve ${project?.tokenMetadata?.symbol}`}</Typography>
        </Button>
        <Button
          fullWidth
          disableElevation
          variant="contained"
          color="primary"
          size="large"
          onClick={onLock}
          disabled={ lockLoading || !amount || amount === '' || isNaN(amount) || BigNumber(amount).eq(0) || BigNumber(project?.tokenMetadata?.allowance).lt(amount)}
          className={classes.button}
        >
          <Typography variant="h5">{lockLoading ? <CircularProgress size={15} /> : `Lock ${project?.tokenMetadata?.symbol}`}</Typography>
        </Button>
      </div>
      {/*<div className={classes.calculationResults}>
        <div className={classes.calculationResult}>
          <Typography variant="h2">You will receive: </Typography>
          <Typography variant="h2" className={classes.bold}></Typography>
        </div>
      </div>*/}
    </Paper>
  );
}
