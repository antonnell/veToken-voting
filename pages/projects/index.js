import React, { useState, useEffect } from 'react';

import { Typography, Paper, Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { withTheme } from '@material-ui/core/styles';

import Layout from '../../components/layout/layout.js';
import ProjectCard from '../../components/projectCard';
import Header  from '../../components/header';

import classes from './projects.module.css';

import stores from '../../stores/index.js';
import { ERROR, GET_PROJECTS, PROJECTS_RETURNED, GAUGES_CONFIGURED } from '../../stores/constants';

import { formatCurrency, formatAddress } from '../../utils';

function Projects({ changeTheme, theme }) {

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
      <div className={ theme.palette.type === 'dark' ? classes.containerDark : classes.container }>
        <div className={ classes.copyContainer }>
          <div className={ classes.copyCentered }>
            <Typography variant='h1' className={ classes.chainListSpacing }><span className={ classes.helpingUnderline }>veToken</span></Typography>
            <Typography variant='h2' className={ classes.helpingParagraph }>Helping emission based projects upgrade to vesting escrow assets</Typography>
            <Typography className={classes.subTitle}>Some interesting information about what this site does. Just select the project from the list to start maximising your rewards.</Typography>
          </div>
          <div className={ classes.socials }>
            <a className={ `${classes.socialButton}` } href='https://github.com/antonnell/networklist-org.git' target='_blank' rel="noopener noreferrer" >
              <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path fill={ '#2F80ED' } d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <Typography variant='body1' className={ classes.sourceCode }>View Source Code</Typography>
            </a>
            <Typography variant='subtitle1' className={ classes.version }>Version 1.0.0</Typography>
          </div>
        </div>
        <div className={ theme.palette.type === 'dark' ? classes.listContainerDark : classes.listContainer }>
          <div className={ theme.palette.type === 'dark' ? classes.headerContainerDark : classes.headerContainer }>
            <Header changeTheme={changeTheme} />
          </div>
          <div className={ classes.cardsContainer }>
            {projects &&
              projects.length > 0 &&
              projects.map((project, idx) => {
                return <ProjectCard key={ idx } project={project} />;
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withTheme(Projects)
