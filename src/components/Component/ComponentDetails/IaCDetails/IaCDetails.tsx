import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import DescriptionIcon from '@mui/icons-material/Description';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Grid, Typography } from '@mui/material';

export function IaCDetails(prop: { dataParentToChild: any, org: any, area: any, product: any }) {
    const { dataParentToChild, org, area, product } = prop;
    const [userData, setUserData] = useState({ login: '' });

    useEffect(() => {
        if (dataParentToChild) {
            const userDataObject = JSON.parse(Cookies.get('user'));
            setUserData(userDataObject);
            console.log(userData);
        };
    }, []);

    return (
        <Card square elevation={0} variant="outlined" sx={{ width: '100%', borderColor: '#cdd6e2', borderWidth: '1.5px', backgroundColor: '#f9fafc', display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                {dataParentToChild?.bbdd?.enabled ? <CardContent sx={{ border: '1px solid', borderColor: 'rgba(103,135,193,1)' }}>
                    <Grid container sx={{ m: 0.5, mt: 1, mb: 3, justifyContent: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                            DATABASE
                        </Typography>
                    </Grid>
                    <Grid container sx={{ m: 0.5, mt: 1 }}>
                        <Grid3x3Icon />
                        <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                            Name
                        </Typography>
                    </Grid>
                    <Typography sx={{ ml: 5 }}>{dataParentToChild?.bbdd?.name}</Typography>
                    <Grid container spacing={1} sx={{ m: 0.5, mt: 1 }}>
                        <DescriptionIcon />
                        <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                            Type
                        </Typography>
                        <Typography sx={{ ml: 1.5 }}>{dataParentToChild?.bbdd?.type}</Typography>
                    </Grid>
                    <Grid container spacing={1} sx={{ m: 0.5, mt: 1 }}>
                        <TypeSpecimenIcon />
                        <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                            Version
                        </Typography>
                    </Grid>
                    <Typography sx={{ ml: 5 }}>{dataParentToChild?.bbdd?.version}</Typography>
                    <Grid container spacing={1} sx={{ m: 0.5, mt: 1 }}>
                        <ConstructionIcon />
                        <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                            Tier
                        </Typography>
                    </Grid>
                    <Typography sx={{ ml: 5 }}>{dataParentToChild?.bbdd?.tier}</Typography>
                </CardContent> : ''}
            </CardContent>
        </Card>
    );
}

