import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, InputAdornment, Button, Tooltip, Radio, RadioGroup, FormControlLabel, CircularProgress } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '../../utils';
import moment from 'moment';

import stores from '../../stores/index.js';
import { ERROR, INCREASE_LOCK_DURATION, INCREASE_LOCK_DURATION_RETURNED } from '../../stores/constants';

import classes from './veAssetModification.module.css';

export default function VeAssetGeneration(props) {
  const [lockLoading, setLockLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateError, setSelectedDateError] = useState(false);
  const [selectedValue, setSelectedValue] = useState('week');
  const [project, setProject] = useState(null);

  useEffect(function () {
    const lockReturned = () => {
      setLockLoading(false);
    };

    stores.emitter.on(INCREASE_LOCK_DURATION_RETURNED, lockReturned);
    stores.emitter.on(ERROR, lockReturned);

    return () => {
      stores.emitter.removeListener(INCREASE_LOCK_DURATION_RETURNED, lockReturned);
      stores.emitter.removeListener(ERROR, lockReturned);
    };
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedValue(null);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);

    let days = 0;
    switch (event.target.value) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      case 'years':
        days = 1461;
        break;
      default:
    }
    const newDate = moment().add(days, 'days').format('YYYY-MM-DD');

    setSelectedDate(newDate);
  };

  const updateProject = () => {
    setProject(props.project);
  };

  useEffect(updateProject, [props]);

  const onLock = () => {
    setSelectedDateError(false);
    let error = false;

    if (!selectedDate) {
      setSelectedDateError(true);
      error = true;
    }

    if (!error) {
      setLockLoading(true);

      const selectedDateUnix = moment(selectedDate).unix()

      stores.dispatcher.dispatch({ type: INCREASE_LOCK_DURATION, content: { selectedDate: selectedDateUnix, project } });
    }
  };

  return (
    <Paper elevation={1} className={classes.projectCardContainer}>
      <Typography variant="h2" className={ classes.sectionHeader }>Increase lock duration</Typography>
      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputTitle}>
            <Typography variant="h5" noWrap>
              Relock until
            </Typography>
          </div>
        </div>
        <TextField
          fullWidth
          id="date"
          type="date"
          variant="outlined"
          className={classes.textField}
          onChange={handleDateChange}
          value={selectedDate}
          error={selectedDateError}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputTitle}>
            <Typography variant="h5" noWrap>
              Relock for
            </Typography>
          </div>
        </div>
        <RadioGroup row aria-label="position" name="position" onChange={handleChange} value={selectedValue}>
          <FormControlLabel value="week" control={<Radio color="primary" />} label="1 week" labelPlacement="bottom" />
          <FormControlLabel value="month" control={<Radio color="primary" />} label="1 month" labelPlacement="bottom" />
          <FormControlLabel value="year" control={<Radio color="primary" />} label="1 year" labelPlacement="bottom" />
          <FormControlLabel value="years" control={<Radio color="primary" />} label="4 years" labelPlacement="bottom" />
        </RadioGroup>
      </div>
      <div className={classes.actionButton}>
        <Button
          fullWidth
          disableElevation
          variant="contained"
          color="primary"
          size="large"
          onClick={onLock}
          disabled={ lockLoading}
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
