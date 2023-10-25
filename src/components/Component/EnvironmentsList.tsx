import { EnvironmentItem } from './EnvironmentItem/EnvironmentItem';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import { Progressing } from '../Progressing';

export function EnvironmentsList(props: { dataParentToChild: any, environment: any }) {
    const { dataParentToChild, environment } = props;
    return (
        <>
        <Paper sx={{ 'bgcolor': grey[100], 'mt': 1, 'mb': 2, 'py': 0.1, 'overflow': 'auto', 'maxHeight': '430px', '&::-webkit-scrollbar': { width: '0.4em' }, '&::-webkit-scrollbar-thumb': { background: '#d6d6d6', borderRadius: '100px'}, '&::-webkit-scrollbar-thumb:hover': {backgroundColor: '#e0e0e0'}}}>
            {dataParentToChild ? <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ m: 2 }}>
                {Array.from(Array(dataParentToChild?.length)).map((_, index) => (
                    <Grid xs={12} sm={4} md={4} xl={3} key={index}>
                        <EnvironmentItem dataParentToChild = {dataParentToChild?.[index]} environment={environment}></EnvironmentItem>
                    </Grid>
                ))}
            </Grid> : <Grid sx={{ p: 1 }}></Grid>}
        </Paper></>
    );
};
