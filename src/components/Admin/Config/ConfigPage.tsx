import { Divider, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import { useState, useEffect } from 'react';
import { axiosExperience } from '../../../axios';
import { Progressing } from '../../Progressing';

export function ConfigPage() {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        axiosExperience.get('administration/config').then((response) => {
            setConfig(response.data);
        });
        // setConfig([
        //     {
        //         'id': 'environments',
        //         'name': 'Environments',
        //         'category': [
        //             {
        //                 'id': 'dev',
        //                 'key': 'Environment 1',
        //                 'name': 'development',
        //                 'description': 'This environment is used for software and application development. It is a controlled environment where developers can test and debug their code before deploying it to a production environment.',
        //                 'subcategory': [],
        //             },
        //             {
        //                 'id': 'pre',
        //                 'key': 'Environment 2',
        //                 'name': 'stage',
        //                 'description': 'This environment is used for additional testing and evaluation before deploying a solution to production. Here, teams can test new features, perform performance testing and make sure everything is working properly before releasing a new version or upgrade.',
        //                 'subcategory': [],
        //             },
        //             {
        //                 'id': 'pro',
        //                 'key': 'Environment 3',
        //                 'name': 'production',
        //                 'description': 'This is the environment where the final version of the software or application runs. This is where end users interact with the product and the day-to-day operation takes place.',
        //                 'subcategory': [],
        //             },
        //         ],
        //     },
        // ]);
    }, []);

    return (
        <Grid sx={{ p: 3 }}>
            {config ? <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 25, mb: 2 }}>Configuration</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid sx={{ p: 3, backgroundColor: '#F5F5F5' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>General Configuration</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Grid sx={{ backgroundColor: '#FBFBFB', p: 3 }}>
                            {config.map((data: any) => (
                                <Grid item key={data.id} xs={12}>
                                    <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{data.name} </Typography>
                                    <Grid sx={{ mb: 2 }}>
                                        <TableContainer component={Paper}>
                                            <Table size="small">
                                                <TableHead sx={{ backgroundColor: '#6486c2' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 15, width: 150 }}>Key</TableCell>
                                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 15, width: 200 }}>Value</TableCell>
                                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Description</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.category ? data.category.map((category: any) => (
                                                        <TableRow key={category.id}>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>{category.key}</TableCell>
                                                            <TableCell>{category.name}</TableCell>
                                                            <TableCell>{category.description}</TableCell>
                                                        </TableRow>
                                                    )) : ''}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> : <Progressing text='LOADING' />}
        </Grid>
    );
}
