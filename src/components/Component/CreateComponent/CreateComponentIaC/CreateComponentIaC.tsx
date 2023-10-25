import { FormControlLabel, Paper, Typography, Switch, MenuItem, Grid, FormControl, InputLabel, TextField } from '@mui/material'; import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import { axiosExperience } from '../../../../axios';
import { useConfig } from '../../../ConfigContext';

interface CreateComponentConfigureProps {
    formContent: any;
    id: number;
};

export function CreateComponentIaC({ formContent, id }: CreateComponentConfigureProps) {
    const config = useConfig();
    const [pos, setPos] = useState(0);
    const methods = useFormContext();
    const { register, unregister } = methods;
    const [listBBDD, setListBBDD] = useState(null);
    const [isServerless, setServerless] = useState(formContent.blueprint === 'azfunc');
    // const [listBBDD, setListBBDD] = useState([
    //     {
    //         id: 'postgresql',
    //         name: 'Azure Database for PostgreSQL',
    //         tiers: [
    //             {
    //                 simpleType: 'Basic',
    //                 complexType: 'B_Gen5_1',
    //             },
    //             {
    //                 simpleType: 'General Purpose',
    //                 complexType: 'GP_Gen5_2',
    //             },
    //             {
    //                 simpleType: 'Memory Optimized',
    //                 complexType: 'MO_Gen5_2',
    //             },
    //         ],
    //         versions: ['9.5', '9.6', '10', '10.0', '10.2', '11'],
    //     },
    // ]);
    const [projectData, updateProjectData] = useState({
        BBDD: false,
        BBDDType: listBBDD && listBBDD[0].id,
        BBDDName: '',
        BBDDAdmin: '',
        BBDDAdminPass: '',
        BBDDTier: listBBDD && listBBDD[0].tiers[0],
        BBDDVersion: listBBDD && listBBDD[0].versions[0],
    });
    const [BBDDType, setBBDDType] = useState(listBBDD && listBBDD[0].id);
    const [checkedBBDD, setCheckedBBDD] = useState(false);

    const handleChangeBBDD = () => {
        setCheckedBBDD(!checkedBBDD);
        formContent.BBDD = !checkedBBDD;
    };

    const changeBBDDType = (value: string) => {
        setBBDDType(value);
        unregister(`BBDDType`);
        register('BBDDType', { value: value });
    };

    useEffect(() => {
        unregister(`serverless`);
        register('serverless', { value: { createFunctionApp: isServerless } });
    }, []);

    useEffect(() => {
        axiosExperience.get('components/listConfig/' + formContent.organization + '/' + formContent.area + '/' + formContent.blueprint).then((response) => {
            setListBBDD(response.data.iac.databases);
        });
        for (let i = 0; i < config.newComponent.length; i++) {
            if (id == config.newComponent[i].id) {
                setPos(i);
            }
        };
        unregister(`BBDDType`);
        register('BBDDType', { value: projectData.BBDDType });
        if (formContent.name && formContent.BBDD) {
            updateProjectData({
                ...projectData,
                BBDD: formContent.BBDD,
                BBDDType: formContent.BBDDType,
                BBDDName: formContent.BBDDName,
                BBDDAdmin: formContent.BBDDAdmin,
                BBDDAdminPass: formContent.BBDDAdminPass,
                BBDDVersion: formContent.BBDDVersion,
                BBDDTier: formContent.BBDDTier,
            });
        };
    }, []);

    return (
        <>
            <form>
                <div className='margin-container'>
                    {pos != 0 && <>
                        {config.newComponent[pos].category[0].enabled && <Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
                            <Grid item sx={{ mb: 3 }}>
                                <Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>{config.newComponent[pos].category[0].name}</Typography>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}
                            >
                                {config.newComponent[pos].category[0].subcategory[0].enabled &&
                                    <div>
                                        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', ml: 3 }}>
                                            <Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[0].name}</Typography>
                                        </Grid>
                                        <Grid sx={{ mt: '10px', ml: 3 }}>
                                            <FormControlLabel
                                                control={<Switch />}
                                                label="Active" checked={formContent.BBDD ? formContent.BBDD : checkedBBDD}
                                                onClick={handleChangeBBDD} {...register('BBDD', { required: true })}
                                            />
                                        </Grid>
                                        {formContent.BBDD && listBBDD && <Grid sx={{ m: '20px' }}>
                                            <Grid sx={{ mt: '20px', mb: '30px' }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={4}>
                                                        <TextField type="text" label="DB Name" fullWidth
                                                            defaultValue={projectData.BBDDName}
                                                            {...register('BBDDName', { required: true })} />
                                                    </Grid>
                                                    {config.newComponent[pos].category[0].subcategory[0].items[0].enabled &&
                                                        <Grid item xs={4}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="select-type">{config.newComponent[pos].category[0].subcategory[0].items[0].name}</InputLabel>
                                                                <Select
                                                                    labelId="select-type"
                                                                    id="id-select-type"
                                                                    label={config.newComponent[pos].category[0].subcategory[0].items[0].name}
                                                                    defaultValue={projectData.BBDDType}
                                                                    onChange={(e) => changeBBDDType(e.target.value)}
                                                                >
                                                                    {Array.from(Array(listBBDD.length)).map((_, index) => (
                                                                        <MenuItem key={index} value={listBBDD[index].id}>{listBBDD[index].name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>}
                                                    {config.newComponent[pos].category[0].subcategory[0].items[1].enabled &&
                                                        <Grid item xs={4}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="select-tier">{config.newComponent[pos].category[0].subcategory[0].items[1].name}</InputLabel>
                                                                <Select
                                                                    labelId="select-tier"
                                                                    id="id-select-tier"
                                                                    label={config.newComponent[pos].category[0].subcategory[0].items[1].name}
                                                                    // MenuProps={MenuProps}
                                                                    defaultValue={projectData.BBDDTier ? projectData.BBDDTier.complexType : ''}
                                                                    {...register('BBDDTier', { required: true })}
                                                                >
                                                                    {Array.from(Array(listBBDD.length)).map((_, index) => (
                                                                        listBBDD[index].id === BBDDType ? Array.from(Array(listBBDD[index].tiers.length)).map((_, index2) => (
                                                                            <MenuItem key={index2} value={listBBDD[index].tiers[index2].complexType}>
                                                                                {listBBDD[index].tiers[index2].simpleType}
                                                                            </MenuItem>
                                                                        )) : <MenuItem key={index}></MenuItem>))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>}
                                                    <Grid item xs={4}>
                                                        <TextField type="text" label="Admin" fullWidth
                                                            defaultValue={projectData.BBDDAdmin}
                                                            {...register('BBDDAdmin', { required: true })} />
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <TextField type="password" label="Admin Password" fullWidth
                                                            defaultValue={projectData.BBDDAdminPass}
                                                            {...register('BBDDAdminPass', { required: true })} />
                                                    </Grid>
                                                    {config.newComponent[pos].category[0].subcategory[0].items[2].enabled &&
                                                        < Grid item xs={4}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="select-version">{config.newComponent[pos].category[0].subcategory[0].items[2].name}</InputLabel>
                                                                <Select
                                                                    labelId="select-version"
                                                                    id="id-select-version"
                                                                    label={config.newComponent[pos].category[0].subcategory[0].items[2].name}
                                                                    defaultValue={projectData.BBDDVersion}
                                                                    {...register('BBDDVersion', { required: true })}
                                                                >
                                                                    {Array.from(Array(listBBDD.length)).map((_, index) => (
                                                                        listBBDD[index].id === BBDDType ? Array.from(Array(listBBDD[index].versions.length)).map((_, index2) => (
                                                                            <MenuItem key={index2} value={listBBDD[index].versions[index2]}>
                                                                                {listBBDD[index].versions[index2]}
                                                                            </MenuItem>
                                                                        )) : <MenuItem key={index}></MenuItem>))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>}
                                                </Grid>
                                            </Grid>
                                        </Grid>}
                                    </div>}
                                {config.newComponent[pos].category[0].subcategory[1].enabled && isServerless &&
                                    <div>
                                        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', ml: 3 }}>
                                            <Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[1].name}</Typography>
                                        </Grid>
                                        <Grid sx={{ mt: '10px', ml: 3 }}>
                                            <FormControlLabel
                                                control={<Switch checked={isServerless} disabled={true} />}
                                                label="Active"
                                            />
                                        </Grid>
                                    </div>}
                            </Grid>
                        </Paper>}
                    </>}
                </div>
            </form >
        </>
    );
}
