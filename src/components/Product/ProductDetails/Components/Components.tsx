// import { useEffect, useState } from 'react';
// import { axiosExperience } from '../../../../axios';
import { ComponentsList } from '../../../Component/ComponentsList';
import { Grid, Stack, Pagination, Typography } from '@mui/material';
import { Progressing } from '../../../Progressing';

export function Components({ typesWithComponents }: any) {
    return (
        <>
            {typesWithComponents ? typesWithComponents.map((type: any) => (
                <Grid key={type.id}>
                    <Typography sx={{ fontSize: 20 }}>{type.label}</Typography>
                    <ComponentsList dataParentToChild={type.components} />
                    {/* <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pagination count={5} showFirstButton showLastButton />
                    </Stack> */}
                </Grid>
            )) : ''}
        </>
    );
};
