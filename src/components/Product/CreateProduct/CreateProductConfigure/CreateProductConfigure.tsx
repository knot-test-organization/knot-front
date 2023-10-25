import { Paper, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { axiosExperience } from '../../../../axios';
import { useConfig } from '../../../ConfigContext';

interface Area {
    id: string;
    name: string;
    creationDate: string;
    blueprints: Blueprint[];
};

interface Blueprint {
    id: string;
    name: string;
    type: string;
    creationDate: string;
};

interface CreateComponentConfigureProps {
    formContent: any;
    id: number;
};

export function CreateProductConfigure({ formContent, id }: CreateComponentConfigureProps) {
    const config = useConfig();
    const [pos, setPos] = useState(0);
    const [organizations, setOrganizations] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState('');
    const [selectedArea, setSelectedArea] = useState('');

    const methods = useFormContext();
    const { register, unregister, getValues } = methods;
    const [projectData, updateProjectData] = useState({
        id: '',
        name: '',
        description: '',
        organization: '',
        area: '',

    });

    const changeOrganization = (organization: any) => {
        unregister(`organization`);
        register('organization', { value: organization });
        setSelectedOrg(organization);
        axiosExperience.get('administration/organization/' + organization + '/areas').then((response) => {
            setAreas(response.data);
        });
    };

    const changeArea = (area: any) => {
        unregister(`area`);
        register('area', { value: area });
        setSelectedArea(area);
    };

    useEffect(() => {
        axiosExperience.get('administration/organization').then((response) => {
            setOrganizations(response.data);
            if (formContent.organization && formContent.area) {
                setSelectedOrg(formContent.organization);
                axiosExperience.get('administration/organization/' + formContent.organization + '/areas').then((response) => {
                    setAreas(response.data);
                });
                setSelectedArea(formContent.area);
            };
        });
        if (formContent.name) {
            updateProjectData({
                id: formContent.id,
                name: formContent.name,
                description: formContent.description,
                organization: formContent.organization,
                area: formContent.area,

            });
            unregister('idCheck');
        };
        for (let i = 0; i < config.newProduct.length; i++) {
            if (id == config.newProduct[i].id) {
                setPos(i);
            }
        }
    }, []);

    return (
        <>
            <form>
                <div className='margin-container'>
                    {<Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>{config.newProduct[pos].category[0].name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {!formContent.idCheck ? (
                                    <TextField
                                        id='id'
                                        label='ID'
                                        variant='outlined'
                                        name='id'
                                        fullWidth
                                        defaultValue={projectData.id}
                                        {...register('id', { required: true, maxLength: 20 })}
                                    />) :
                                    <TextField
                                        error
                                        id='id-error'
                                        label='Error'
                                        fullWidth
                                        defaultValue={projectData.id}
                                        {...register('id', { required: true, maxLength: 20 })}
                                        helperText='Incorrect entry.'
                                    />
                                }
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id='name'
                                    label='Name'
                                    variant='outlined'
                                    name='name'
                                    fullWidth
                                    defaultValue={projectData.name}
                                    {...register('name', { required: true, maxLength: 20 })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='description'
                                    label={config.newProduct[pos].category[0].subcategory[2].name}
                                    variant='outlined'
                                    name='description'
                                    multiline
                                    fullWidth
                                    defaultValue={projectData.description}
                                    {...register('description', { required: true, maxLength: 20 })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-chip-label">{config.newProduct[pos].category[0].subcategory[3].name}</InputLabel>
                                    <Select
                                        id="demo-select"
                                        value={selectedOrg}
                                        input={<OutlinedInput id="select-multiple-chip" label={config.newProduct[pos].category[0].subcategory[3].name} />}
                                        onChange={(e) => changeOrganization(e.target.value)}>
                                        {organizations.map((organization) => (
                                            <MenuItem
                                                key={organization.id}
                                                value={organization.id}
                                            >
                                                {organization.name}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-chip-label" >{config.newProduct[pos].category[0].subcategory[4].name}</InputLabel>
                                    <Select
                                        id="demo-select"
                                        value={selectedArea}
                                        input={<OutlinedInput id="select-multiple-chip" label={config.newProduct[pos].category[0].subcategory[4].name} />}
                                        onChange={(e) => changeArea(e.target.value)}
                                    >
                                        {areas.map((area) => (
                                            <MenuItem
                                                key={area.id}
                                                value={area.id}
                                            >
                                                {area.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                    }
                </div>
            </form>
        </>
    );
}
