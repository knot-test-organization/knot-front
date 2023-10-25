import { Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import { useState, useEffect } from 'react';
import { axiosExperience } from '../../../axios';
import { Progressing } from '../../Progressing';

export function CatalogPage() {
    const [catalog, setCatalog] = useState(null);

    useEffect(() => {
        axiosExperience.get('administration/catalog').then((response) => {
            setCatalog(response.data);
         });
    }, []);

    return (
        <Grid sx={{ width: '100%' }}>
            {catalog ? <>
                <Grid sx={{ width: '100%', pt: 5, pl: 7, pr: 5 }} container spacing={2}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: 25, ml: 2 }}>Catalog</Typography>
                  {catalog.map((data: any) => (
                    <Grid item key={data.id} xs={12}>
                    <Card>
                      <Grid sx={{ backgroundColor: '#6486c2', height: '6px' }}></Grid>
                      <Typography align='center' sx={{ mt: 2, mb: 4, fontWeight: 'bold', fontSize: 23 }}>{data.name}</Typography>
                      <Grid sx={{ mr: 2, ml: 2, mb: 2 }} container spacing={2}>
                        <Grid sx={{ pr: 6 }} container spacing={2}>
                          {data.category ? data.category.map((category: any) => (
                            <Grid item key={category.id} xs={12}>
                              <Card>
                                <Grid sx={{ backgroundColor: 'lightgray', height: '5px' }}></Grid>
                                <Typography align='left' sx={{ mt: 2, ml: 2, fontWeight: 'bold', fontSize: 18 }}>{category.name}</Typography>
                                <CardContent sx={{ pt: '0px', pb: '0px' }}>
                                  {category.subcategory ? category.subcategory.map((subcategory: any) => (
                                    <TableContainer key={subcategory.id}>
                                      <Table sx={{ mt: 2 }}>
                                        <TableHead sx={{ height: '15px' }}>
                                          <TableRow sx={{ backgroundColor: '#6486c2', height: '15px' }}>
                                            <TableCell sx={{ pt: '10px', pb: '8px', pl: '16px', fontWeight: 'bold', color: 'white', width: '35%' }} align='left'>{subcategory.name}</TableCell>
                                            <TableCell sx={{ pt: '10px', pb: '8px', pl: '16px', width: '65%' }}></TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {subcategory.items ? subcategory.items.map((items: any) => (
                                            <TableRow key={items.id}>
                                              <TableCell align='left' sx={{ pt: '10px', pb: '8px', pl: '16px' }}>{items.name}</TableCell>
                                              <TableCell align='left' sx={{ pt: '10px', pb: '8px', pl: '16px' }}>{items.description}</TableCell>
                                            </TableRow>
                                          )) : ''}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  )) : ''}
                                </CardContent>
                              </Card>
                            </Grid>
                          )) : ''}
                        </Grid>
                      </Grid>
                    </Card>
                    </Grid>
                  ))}
                </Grid>
            </> : <Progressing text='LOADING' />}
        </Grid>
    );
}
