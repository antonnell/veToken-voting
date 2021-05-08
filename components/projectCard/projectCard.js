import { Typography, Paper, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { formatCurrency } from '../../utils';

import classes from './projectCard.module.css';

export default function ProjectCard({ project }) {
  const router = useRouter();

  function handleNavigate() {
    router.push('/project/' + project.id);
  }

  return (
    <Paper elevation={ 1 } className={classes.projectCardContainer} onClick={handleNavigate}>
      <div className={classes.projectCardTitle}>
        <div className={classes.projectCardLogo}>
          <img src={project.logo ? project.logo : '/tokens/unknown-logo.png'} alt="" height={ 70 }/>
        </div>
        <div className={classes.projectCardName}>
          <Typography variant="h2" className={classes.fontWeightBold}>
            {project.name}
          </Typography>
          <Typography variant="h5" className={classes.fontWeightBold}>
            {project.url}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
