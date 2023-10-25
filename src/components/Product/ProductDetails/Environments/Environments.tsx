// import { useEffect, useState } from 'react';
// import { axiosExperience } from '../../../../axios';
import { Stack, Pagination, Grid, Typography } from '@mui/material';
import { EnvironmentsList } from '../../../Component/EnvironmentsList';
import { Progressing } from '../../../Progressing';

export function Environments({ envsWithComponents }: any) {
    return (
        <>
            {envsWithComponents ? envsWithComponents.map((env: any) => (
                <Grid key={env.nameSpace}>
                    <Typography sx={{ fontSize: 20 }}>{env.envPath}</Typography>
                    <EnvironmentsList dataParentToChild={env.components} environment={env.nameSpace} />
                    {/* <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pagination count={5} showFirstButton showLastButton />
                    </Stack> */}
                </Grid>
            )) : ''}
        </>
    );
};
