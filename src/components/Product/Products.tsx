import { ProductItem } from './ProductItem/ProductItem';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import { Progressing } from '../Progressing';

export function Products({dataParentToChild}: any) {
    return (
        <>
        <Paper sx={{ 'bgcolor': grey[100], 'mx': 3, 'py': 0.1, 'overflow': 'auto', '&::-webkit-scrollbar': { width: '0.4em' }, '&::-webkit-scrollbar-thumb': { background: '#d6d6d6', borderRadius: '100px'}, '&::-webkit-scrollbar-thumb:hover': {backgroundColor: '#e0e0e0'}}}>
            {dataParentToChild ? <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ m: 2 }}>
                {Array.from(Array(dataParentToChild?.length)).map((_, index) => (
                    <Grid xs={12} sm={4} md={4} xl={3} key={index}>
                        <ProductItem dataParentToChild = {dataParentToChild?.[index]}></ProductItem>
                    </Grid>
                ))}
            </Grid> : <Progressing text='LOADING' />}
        </Paper></>
    );
};
