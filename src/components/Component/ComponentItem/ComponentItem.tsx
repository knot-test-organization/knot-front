import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LinkIcon from '@mui/icons-material/Link';
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
import Box from '@mui/material/Box';

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

export function ComponentItem({ dataParentToChild }: any) {
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
              Technology: {dataParentToChild?.technology}
            </Typography>
          </Grid>
          <Grid sx={{ mt: 1, display: 'flex' }}>
            <Typography color="text.primary" sx={{ fontSize: 14 }}>
              View Source:
            </Typography>
            <a href={'https://github.com/' + dataParentToChild?.organizationName + '/' + dataParentToChild?.id} target="_blank" rel="noreferrer" style={{ 'textDecoration': 'none', 'color': 'black' }}>
              <LinkIcon sx={{ ml: 1 }} />
            </a>
          </Grid>
          <Grid>
            <Typography color="text.primary" sx={{ fontSize: 14, whiteSpace: 'pre-line', minHeight: '3em', maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Description: {dataParentToChild?.description}
            </Typography>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dataParentToChild ? dataParentToChild?.environments.map((env: any) => (
              <Grid item md sm xs key={env.nameSpace}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 14 }}>{env.nameSpace}</Typography>
                  <Grid sx={{ backgroundColor: env.enabled ? '#69C82D' : '#9C9999', p: 1, ml: 1, borderRadius: 15 }}></Grid>
                </Box>
              </Grid>
            )) : ''}
          </Grid>
        </CardContent>
      </Grid>
    </Card>
  );
}
