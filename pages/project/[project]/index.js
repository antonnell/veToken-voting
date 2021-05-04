import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Typography, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Layout from '../../../components/layout/layout.js';
import Balances from '../../../components/balances';
import GaugeCalculator from '../../../components/gaugeCalculator';
import VeAssetGeneration from '../../../components/veAssetGeneration';
import GaugeVoting from '../../../components/gaugeVoting';

import classes from './project.module.css';

import stores from '../../../stores/index.js';
import { ERROR, GET_PROJECT, PROJECT_RETURNED } from '../../../stores/constants';

import { formatCurrency, formatAddress } from '../../../utils';

function Projects({ changeTheme }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(function () {
    const projectReturned = (proj) => {
      setProject(proj);
    };

    stores.emitter.on(PROJECT_RETURNED, projectReturned);

    return () => {
      stores.emitter.removeListener(PROJECT_RETURNED, projectReturned);
    };
  }, []);

  useEffect(
    function () {
      stores.dispatcher.dispatch({ type: GET_PROJECT, content: { id: router.query.project } });
    },
    [router],
  );

  const backClicked = () => {
    router.push('/');
  }

  return (
    <Layout changeTheme={changeTheme} backClicked={ backClicked }>
      <div className={classes.projectContainer}>
        <Balances project={project} />
        <div className={classes.projectCardContainer}>
          <GaugeCalculator project={project} />
          <VeAssetGeneration project={project} />
          <GaugeVoting project={project} />
        </div>
      </div>
    </Layout>
  );
}

export default Projects;
