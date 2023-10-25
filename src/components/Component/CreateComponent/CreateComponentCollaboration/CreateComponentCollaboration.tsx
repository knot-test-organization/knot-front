import { FormControlLabel, Grid, Paper, Typography, Switch, FormControl, MenuItem } from '@mui/material'; import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import { useConfig } from '../../../ConfigContext';

interface CreateComponentConfigureProps {
    formContent: any;
    id: number;
};

export function CreateComponentCollaboration({ formContent, id }: CreateComponentConfigureProps) {
    const config = useConfig();
    const [pos, setPos] = useState(0);
    const methods = useFormContext();
    const { register } = methods;

    const [checkedConnectivity, setCheckedConnectivity] = useState(false);

    const handleChangeConnectivity = () => {
        setCheckedConnectivity(!checkedConnectivity);
        formContent.connectivity = !checkedConnectivity;
    };

    useEffect(() => {
        for (let i = 0; i < config.newComponent.length; i++) {
            if (id == config.newComponent[i].id) {
                setPos(i);
            }
        };
    }, []);

    return (
        <>
            <form>
                <div className='margin-container'>
                    {pos != 0 ? <>
                        {config.newComponent[pos].category[0].enabled ? <Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
                            <Grid item sx={{ mb: 3 }}>
                                <Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>{config.newComponent[pos].category[0].name}</Typography>
                            </Grid>
                            {config.newComponent[pos].category[0].subcategory[0].enabled ? <>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', ml: 3 }}>
                                    <Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[0].name}</Typography>
                                </Grid>
                                <Grid sx={{ mt: '10px', ml: 3 }}>
                                    <FormControlLabel
                                        control={<Switch />}
                                        label="Active" checked={formContent.connectivity ? formContent.connectivity : checkedConnectivity}
                                        onClick={handleChangeConnectivity} {...register('connectivity', { required: true })}
                                    />
                                </Grid>
                                {formContent.connectivity ? <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', mt: 1, ml: 10 }}>
                                    <Typography sx={{ mr: 2 }}>Tool</Typography>
                                    <FormControl sx={{ width: '20%' }}>
                                        <Select defaultValue="MicrosoftTeams">
                                            <MenuItem value='MicrosoftTeams'>MicrosoftTeams</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> : ''}
                            </> : ''}
                        </Paper> : ''}
                    </> : ''}
                </div>
            </form>
        </>
    );
}
