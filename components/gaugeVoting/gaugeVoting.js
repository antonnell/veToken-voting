import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, InputAdornment, Button, Tooltip, CircularProgress } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '../../utils';

import PieChart from './pieChart';
import GaugeVotesTable from './gaugeVotesTable';

import stores from '../../stores/index.js';
import { ERROR, VOTE, VOTE_RETURNED } from '../../stores/constants';

import classes from './gaugeVoting.module.css';

export default function GaugeVoting({ project }) {
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState(false);
  const [gauge, setGauge] = useState(null);
  const [gaugeError, setGaugeError] = useState(false);

  const [voteLoading, setVoteLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(function () {
    const voteReturned = () => {
      setVoteLoading(false);
      setResetLoading(false);
    };

    stores.emitter.on(VOTE_RETURNED, voteReturned);
    stores.emitter.on(ERROR, voteReturned);

    return () => {
      stores.emitter.removeListener(VOTE_RETURNED, voteReturned);
      stores.emitter.removeListener(ERROR, voteReturned);
    };
  }, []);

  const setAmountPercent = (percent) => {
    if (!project || !project.tokenMetadata) {
      return;
    }

    setAmount(BigNumber(project.tokenMetadata.balance).times(percent).div(100).toFixed(project.tokenMetadata.decimals));
  };

  const onGaugeSelectChanged = (event, theOption) => {
    setGauge(theOption);
  };

  const onVote = () => {
    setAmountError(false);
    setGaugeError(false);
    let error = false;

    if (!gauge) {
      setGaugeError(true);
      error = true;
    }
    if (!amount || amount === '' || isNaN(amount) || BigNumber(amount).gt(100) || BigNumber(amount).lt(0)) {
      setAmountError(true);
      error = true;
    }

    if (!error) {
      setVoteLoading(true);

      stores.dispatcher.dispatch({ type: VOTE, content: { gaugeAddress: gauge.address, amount, project } });
    }
  };

  const onReset = (gauge) => {
    setResetLoading(true);

    stores.dispatcher.dispatch({ type: VOTE, content: { gaugeAddress: gauge.address, amount: '0', project } });
  };

  return (
    <Paper elevation={1} className={classes.projectCardContainer}>
      <div className={classes.split}>
        <div className={classes.half}>
          <Typography variant="h2" className={ classes.sectionHeader }>Vote for your gauge</Typography>
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
                  <div className={classes.text}>{option.lpToken.symbol}</div>
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    ...{
                      placeholder: 'Search gauge'
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
            />
          </div>
          <div className={classes.actionButton}>
            <Button fullWidth disableElevation variant="contained" color="primary" size="large" onClick={onVote} disabled={voteLoading}>
              <Typography variant="h5">{voteLoading ? <CircularProgress size={15} /> : 'Vote'}</Typography>
            </Button>
          </div>
          <div className={classes.calculationResults}>
            <div className={classes.calculationResult}>
              <Typography variant="h3">Current voting power used: </Typography>
              <Typography variant="h3" className={classes.bold}>
                {formatCurrency(project?.userVotesPercent)} %
              </Typography>
            </div>
          </div>
          {
            BigNumber(project?.userVotesPercent).gt(0) &&
            (<div className={classes.gaugeVotesTable}>
              {project?.gauges?.map((gauge, idx) => {
                if (!gauge.userVotesPercent || (gauge.userVotesPercent && BigNumber(gauge.userVotesPercent).eq(0))) {
                  return null;
                }

                return (
                  <div className={classes.calculationResult} key={'gauge'+idx}>
                    <Typography variant="h5">{gauge.lpToken.name}</Typography>
                    <Typography variant="h5" className={classes.bold}>
                      {formatCurrency(gauge.userVotesPercent)} %
                    </Typography>
                    <Button
                      disableElevation
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        onReset(gauge);
                      }}
                      disabled={resetLoading}
                    >
                      <Typography variant="h5">{resetLoading ? <CircularProgress size={15} /> : 'Reset'}</Typography>
                    </Button>
                  </div>
                );
              })}
            </div>)
          }
          {
            BigNumber(project?.userVotesPercent).eq(0) &&
            (<div className={classes.gaugeVotesTable}>
              <Typography>Voting for a gauge increases the emissions that the farm receives. The more votes that your farm receives, the more profitable it will be.</Typography>
            </div>)
          }
        </div>
        <div className={classes.half}>
          <Typography variant="h2" className={ classes.sectionHeader }>Current Vote weighting</Typography>
          <PieChart data={project?.gauges?.sort((a, b) => (a.relativeWeight > b.relativeWeight ? -1 : 1))} />
        </div>
      </div>
      <div><GaugeVotesTable project={ project } /></div>
    </Paper>
  );
}
