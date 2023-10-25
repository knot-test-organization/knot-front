import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SvgIcon from '@mui/material/SvgIcon';
// import { ReactComponent as ContainerRegistryIcon } from '../../assets/icons/container-registry.svg';
// import { ReactComponent as GithubIcon } from '../../assets/icons/github.svg';
// import { ReactComponent as TektonIcon } from '../../assets/icons/tekton.svg';
import { ReactComponent as PythonIcon } from '../../../assets/icons/python.svg';
import { ReactComponent as SpringIcon } from '../../../assets/icons/spring.svg';
import { ReactComponent as JavaIcon } from '../../../assets/icons/java.svg';
import { ReactComponent as NetIcon } from '../../../assets/icons/net.svg';
import { ReactComponent as AngularIcon } from '../../../assets/icons/angular.svg';
import { ReactComponent as LiquibaseIcon } from '../../../assets/icons/liquibase.svg';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

function getTechnologyIcon(type: String) {
  switch (type) {
    case 'python':
      return PythonIcon;
    case 'java':
      return JavaIcon;
    case 'springboot-restservice':
      return SpringIcon;
    case 'java-restclient':
      return JavaIcon;
    case 'netcore':
      return NetIcon;
    case 'angular':
      return AngularIcon;
    case 'dedalowangular':
      return AngularIcon;
    case 'dedalowspring':
      return SpringIcon;
    case 'dedalowjavamonolithic':
      return JavaIcon;
    case 'dedalowliquibase':
      return LiquibaseIcon;
  }
}

export function EnvironmentItem(props: { dataParentToChild: any, environment: any }) {
  const { dataParentToChild, environment } = props;
  const [version, setVersion] = useState(null);

  useEffect(() => {
    dataParentToChild.environments.map((env: any) => {
      if (env.nameSpace === environment) {
        setVersion(env.version);
      };
    });
  }, []);
  return (
    <Card>
      <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
      <Grid sx={{ p: 1 }}>
        <CardHeader sx={{ '.MuiCardHeader-avatar': { mr: 1.5 }, 'pb': 0 }}
          action={
            <IconButton href={`${window.location.pathname}/componentDetails/${dataParentToChild?.id}`}>
              <ArrowForwardIosIcon />
            </IconButton>
          }
          titleTypographyProps={{ fontSize: 18, fontWeight: 'bold' }}
          title={dataParentToChild?.name}
          avatar={
            <SvgIcon sx={{ fontSize: 40 }} component={getTechnologyIcon(dataParentToChild?.technology.toString())} inheritViewBox />
          }
        />
        <CardContent>
          <Grid sx={{ mt: 1 }}>
            <Typography color="text.primary" sx={{ fontSize: 14 }}>
              Version: {version ? environment === 'dev' ? version.slice(0, 7) : version : ''}
            </Typography>
          </Grid>
          <Grid sx={{ mt: 1 }}>
            <Typography color="text.primary" sx={{ fontSize: 14 }}>
              Type: {dataParentToChild?.type}
            </Typography>
          </Grid>
          <Grid sx={{ mt: 1 }}>
            <Typography color="text.primary" sx={{ fontSize: 14 }}>
              Technology: {dataParentToChild?.technology}
            </Typography>
          </Grid>
        </CardContent>
      </Grid>
    </Card>
  );
}
