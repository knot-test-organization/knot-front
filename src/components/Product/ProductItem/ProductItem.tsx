import { Card, CardContent, CardHeader, Typography, Grid, SvgIcon, IconButton, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ReactComponent as ProductIcon } from '../../../assets/icons/product.svg';
import { grey } from '@mui/material/colors';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { useEffect, useState } from 'react';
import { axiosExperience } from '../../../axios';
// import Cookies from 'js-cookie';

function getTypeIcon(type: String) {
  switch (type) {
    case 'front':
      return <WebIcon sx={{ color: '#6486c2' }} />;
    case 'microservice':
      return <MiscellaneousServicesIcon sx={{ color: '#6486c2' }} />;
    case 'batch':
      return <StorageIcon sx={{ color: '#6486c2' }} />;
    default:
      return '';
  }
}

export function ProductItem({ dataParentToChild }: any) {
  const [typesWithComponents, setTypesWithComponents] = useState(null);

  useEffect(() => {
    axiosExperience.get('products/' + dataParentToChild.organization + '/' + dataParentToChild.area + '/' + dataParentToChild.id + '/components/types').then((response) => {
      setTypesWithComponents(response.data);
    });
  }, []);

  return (
    <Card>
      <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
      <Grid sx={{ p: 1 }}>
        <CardHeader sx={{ '.MuiCardHeader-avatar': { mr: 1.5 }, 'pb': 0 }}
          action={
            <IconButton href={'/productDetails/' + dataParentToChild?.organization + '/' + dataParentToChild?.area + '/' + dataParentToChild?.id}>
              <ArrowForwardIosIcon />
            </IconButton>
          }
          titleTypographyProps={{ fontSize: 18, fontWeight: 'bold' }}
          title={dataParentToChild?.name}
          avatar={
            <SvgIcon sx={{ fontSize: 50 }} component={ProductIcon} inheritViewBox />
          }
        />
        <CardContent>
          <Grid>
            <Typography color="text.primary" sx={{ fontSize: 14 }}>
              <b>Organization: </b>{`${dataParentToChild?.organization} > ${dataParentToChild?.area}`}
            </Typography>
          </Grid>
          <Grid sx={{ mt: 1 }}>
            <Typography color="text.primary" sx={{ fontSize: 14 }}>
              <b>Product Owner: </b>{dataParentToChild?.po}
            </Typography>
          </Grid>
          <Grid sx={{ mt: 1 }}>
            <Typography color="text.primary" sx={{ fontSize: 14, whiteSpace: 'pre-line', minHeight: '3em', maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <b>Description: </b>{dataParentToChild?.description}
            </Typography>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {typesWithComponents ? typesWithComponents.map((type: any) => (
              <Grid item md sm xs key={type.id}>
                <Box sx={{ borderTop: '1px solid #6486c2', borderBottom: '1px solid #6486c2', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getTypeIcon(type.id)}
                  <Typography sx={{ ml: 0.5, fontSize: 13.5 }}>{type.label}</Typography>
                  <Typography sx={{ ml: 0.5, fontSize: 13.5 }}>{type.components ? type.components.length : '0'}</Typography>
                </Box>
              </Grid>
            )) : ''}
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
