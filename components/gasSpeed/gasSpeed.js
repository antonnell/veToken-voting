import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { GET_GAS_PRICES, GAS_PRICES_RETURNED } from "../../stores/constants";

import stores from "../../stores/index.js";

import classes from "./gasSpeed.module.css";

export default function GasSpeed({ vault, setParentSpeed }) {
  const storeGasPrices = stores.accountStore.getStore("gasPrices");

  const [gasSpeed, setGasSpeed] = useState("fast");
  const [customSpeed, setCustomSpeed] = useState("");
  const [gasPrices, setGasPrices] = useState(storeGasPrices);

  const handleGasSpeedChanged = (event, newVal) => {
    setGasSpeed(newVal);
    setParentSpeed(newVal);
  };

  const customSpeedChanged = event => {
    if (event.target.value !== "") {
      setGasSpeed("");
    }
    setCustomSpeed(event.target.value);
  };

  useEffect(() => {
    const gasPricesReturned = () => {
      const gasPrices = stores.accountStore.getStore("gasPrices");
      setGasPrices(gasPrices);
    };

    stores.emitter.on(GAS_PRICES_RETURNED, gasPricesReturned);

    return () => {
      stores.emitter.removeListener(GAS_PRICES_RETURNED, gasPricesReturned);
    };

    dispatcher.dispatch(GET_GAS_PRICES);
  }, []);

  return (
    <div className={classes.gasSpeedContainer}>
      <Typography variant="h5" className={classes.title}>
        Transaction Speed
      </Typography>
      <ToggleButtonGroup
        value={gasSpeed}
        exclusive
        onChange={handleGasSpeedChanged}
        className={classes.gasSpeed}
      >
        <ToggleButton value="slow">
          <div className={classes.toggleButtonText}>
            <Typography variant="h5">Slow</Typography>
            <Typography className={classes.smallText}>
              {gasPrices.slow} Gwei
            </Typography>
          </div>
        </ToggleButton>
        <ToggleButton value="standard">
          <div className={classes.toggleButtonText}>
            <Typography variant="h5">Standard</Typography>
            <Typography className={classes.smallText}>
              {gasPrices.standard} Gwei
            </Typography>
          </div>
        </ToggleButton>
        <ToggleButton value="fast">
          <div className={classes.toggleButtonText}>
            <Typography variant="h5">Fast</Typography>
            <Typography className={classes.smallText}>
              {gasPrices.fast} Gwei
            </Typography>
          </div>
        </ToggleButton>
        <ToggleButton value="instant">
          <div className={classes.toggleButtonText}>
            <Typography variant="h5">Instant</Typography>
            <Typography className={classes.smallText}>
              {gasPrices.instant} Gwei
            </Typography>
          </div>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

/*

<TextField
  variant="outlined"
  placeholder="custom"
  value={ customSpeed }
  onChange={ customSpeedChanged }
/>

*/
