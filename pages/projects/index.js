import React, { useState, useEffect } from 'react';

import { Typography, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Layout from '../../components/layout/layout.js';
import ProjectCard from '../../components/projectCard';

import classes from './projects.module.css';

import stores from '../../stores/index.js';
import { ERROR, GET_PROJECTS, PROJECTS_RETURNED, GAUGES_CONFIGURED } from '../../stores/constants';

import { formatCurrency, formatAddress } from '../../utils';

function Projects({ changeTheme }) {

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState(null);

  useEffect(function () {
    const projectsReturned = (projs) => {
      setProjects(projs);
    };

    const gaugesReturned = (projs) => {
      stores.dispatcher.dispatch({ type: GET_PROJECTS, content: {} });
    };

    stores.emitter.on(PROJECTS_RETURNED, projectsReturned);
    stores.emitter.on(GAUGES_CONFIGURED, gaugesReturned);
    stores.dispatcher.dispatch({ type: GET_PROJECTS, content: {} });

    return () => {
      stores.emitter.removeListener(PROJECTS_RETURNED, projectsReturned);
      stores.emitter.removeListener(GAUGES_CONFIGURED, gaugesReturned);
    };
  }, []);

  return (
    <Layout changeTheme={changeTheme}>
      <div className={ classes.projectsContainer }>
        {projects &&
          projects.length > 0 &&
          projects.map((project, idx) => {
            return <ProjectCard key={ idx } project={project} />;
          })}
      </div>
    </Layout>
  );
}

export default Projects;
