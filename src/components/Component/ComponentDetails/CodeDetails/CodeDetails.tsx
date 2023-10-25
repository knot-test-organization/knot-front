import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Button, Modal, FormControl, Select, MenuItem } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { axiosExperience, axiosAPIGithub } from '../../../../axios';

export function CodeDetails(prop: { dataParentToChild: any, org: any, area: any, product: any }) {
  const { dataParentToChild, org, area, product } = prop;
  const [component, setComponent] = useState(dataParentToChild);
  const [userData, setUserData] = useState({ login: '' });
  const [open, setOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [buttonLoadingStates, setButtonLoadingStates] = useState([]);
  const [branches, setBranches] = useState([
    { label: 'master', name: 'master' },
  ]);
  const regions = [
    { label: 'Europe West', name: 'EuropeWest' },
    { label: 'Southeast Asia', name: 'SoutheastAsia' },
    { label: 'US East', name: 'USEast' },
    { label: 'US West', name: 'USWest' },
  ];
  const machineTypes = [
    { label: '2-core', name: 'basicLinux32gb' },
    { label: '4-core', name: 'standardLinux32gb' },
  ];

  const [branch, setBranch] = useState('');
  const [devcontainer, setDevcontainer] = useState(dataParentToChild?.devcontainers[0]);
  const [region, setRegion] = useState(regions[0].name);
  const [machineType, setMachineType] = useState(machineTypes[0].name);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkStatus = async (displayName: string) => {
    try {
      const response = await axiosAPIGithub.get('repos/' + dataParentToChild.organizationName + '/' + dataParentToChild.id + '/codespaces');
      if (response.data) {
        for (const codespace of response.data.codespaces) {
          if (codespace.display_name === displayName) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const createCodespace = async () => {
    const newComponent = component;
    const user = Cookies.get('user');
    const accessToken = Cookies.get('access_token');
    if (user) {
      const userParse = JSON.parse(user);
      const newCodespace = {
        username: userParse.login,
        repositoryId: component?.id,
        branch: branch,
        devContainer: devcontainer,
        region: region,
        machineType: machineType,
      };
      component.codespaces = [...component.codespaces, newCodespace];
      setComponent(component);
      handleClose();
      if (branch === '' || devcontainer === undefined) {
        setShowErrorMessage(true);
        return;
      }
      try {
        const { data } = await axiosExperience.put<any>(
          // 'http://knot.westeurope.cloudapp.azure.com/api/Applications',
          `components/${org}/${area}/${product}/createCodespaces/${component.id}/${userParse.login}`,
          {
            username: userParse.login,
            repositoryId: component?.id,
            branch: branch,
            devContainer: devcontainer,
            region: region,
            machineType: machineType,
          }, {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        },
        );
        console.log('response', data);
        setShowErrorMessage(false);
        setComponent(newComponent);
        // window.location.href = window.location.href;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteCodespace = async (index: number) => {
    const codespace = component.codespaces[index];
    const user = Cookies.get('user');
    if (user) {
      const userParse = JSON.parse(user);
      const indexToRemove = component.codespaces.findIndex((codespace: any) => {
        return (
          codespace.username === userParse.login &&
          codespace.repositoryId === codespace.repositoryId &&
          codespace.branch === codespace.branch &&
          codespace.devContainer === codespace.devContainer &&
          codespace.region === codespace.region &&
          codespace.machineType === codespace.machineType
        );
      });
      if (indexToRemove !== -1) {
        component.codespaces.splice(indexToRemove, 1); // Remove one element at the specified index
        setComponent({ ...component }); // Update the state with a new object to trigger a re-render
      };
      try {
        const { data } = await axiosExperience.put<any>(
          // 'http://knot.westeurope.cloudapp.azure.com/api/Applications',
          `components/${org}/${area}/${product}/deleteCodespaces/${component.id}`,
          {
            username: userParse.login,
            repositoryId: codespace.repositoryId,
            branch: codespace.branch,
            devContainer: codespace.devContainer,
            region: codespace.region,
            machineType: codespace.machineType,
          }, {
          headers: {
            Accept: 'application/json',
          },
        },
        );
        console.log('response', data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goToCodespace = async (displayName: string) => {
    const accessToken = Cookies.get('access_token');
    axiosAPIGithub.get('repos/' + dataParentToChild.organizationName + '/' + dataParentToChild.id + '/codespaces').then((response) => {
      if (response.data) {
        for (let index = 0; index < response.data.codespaces.length; index++) {
          const element = response.data.codespaces[index];
          if (element.display_name === displayName) {
            const url = 'https://' + element.name + '.github.dev/';
            window.open(url, '_blank');
          }
        };
      };
    });
  };

  // Declare updateTimer in the outer scope
  let updateTimer: NodeJS.Timeout;

  useEffect(() => {
    if (dataParentToChild) {
      setComponent(dataParentToChild);
      const userDataObject = JSON.parse(Cookies.get('user'));
      setUserData(userDataObject);
      const updateButtonLoadingStates = async () => {
        const newLoadingStates = await Promise.all(
          dataParentToChild?.codespaces?.map(async (_: any, index: string | number) => {
            const displayName = dataParentToChild?.codespaces[index].devContainer;
            const status = await checkStatus(displayName);
            return status;
          }));
        setButtonLoadingStates(newLoadingStates);
      };
      updateButtonLoadingStates();
      axiosExperience.get('components/listRepoBranches/' + dataParentToChild?.id, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      }).then((response) => {
        if (response.data) {
          setBranches(response.data);
        };
      });
    };
    return () => {
      clearInterval(updateTimer);
    };
  }, [component]);

  useEffect(() => {
    if (dataParentToChild) {
      setComponent(dataParentToChild);
      updateTimer = setInterval(() => {
        const updateButtonLoadingStates = async () => {
          const newLoadingStates = await Promise.all(
            dataParentToChild?.codespaces?.map(async (_: any, index: string | number) => {
              const displayName = dataParentToChild?.codespaces[index].devContainer;
              const status = await checkStatus(displayName);
              return status;
            }));
          setButtonLoadingStates(newLoadingStates);
        };
        updateButtonLoadingStates();
      }, 20000);
    };
    return () => {
      clearInterval(updateTimer);
    };
  }, [component]);

  return (
    <Grid sx={{ width: '100%' }}>
      {component?.sonarqubeScan ? <Card sx={{ mb: 3 }}>
            <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
            <CardContent sx={{ p: 3 }}>
              <Typography align='center' sx={{ mb: 1, fontWeight: 'bold' }}>Code Quality</Typography>
              <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Quality gate](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/quality_gate?project=${component?.id}&token=squ_1d47bf3c64f5f0f627d331a2e6d2c02c8f7019ed)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid> */}
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Bugs](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=bugs&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Code Smells](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=code_smells&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Coverage](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=coverage&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Duplicated Lines (%)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=duplicated_lines_density&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Lines of Code](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=ncloc&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Maintainability Rating](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=sqale_rating&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Quality Gate Status](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=alert_status&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Reliability Rating](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=reliability_rating&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Security Hotspots](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=security_hotspots&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Security Rating](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=security_rating&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Technical Debt](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=sqale_index&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
                <Grid sx={{ m: 0.5 }}>
                  <ReactMarkdown>{`[![Vulnerabilities](http://knot-sonar.westeurope.cloudapp.azure.com:9000/api/project_badges/measure?project=${component?.id}&metric=vulnerabilities&token=sqa_034409a7d2b4bcf23abc5a77322a82093b34c640)](http://knot-sonar.westeurope.cloudapp.azure.com:9000/dashboard?id=${component?.id})`}</ReactMarkdown>
                </Grid>
              </Grid>
            </CardContent>
          </Card> : ''}
    <Card square elevation={0} variant="outlined" sx={{ width: '100%', borderColor: '#cdd6e2', borderWidth: '1.5px', backgroundColor: '#f9fafc', display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        {Array.from(Array(component?.codespaces?.length)).map((_, index) => (
          userData.login === component?.codespaces[index].username ? <Card key={index} sx={{ width: '100%', m: 2 }}>
            <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
            <CardContent>
              <Grid container sx={{ m: 0.5, mt: 1, mb: 3, justifyContent: 'center' }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {component?.codespaces[index].devContainer.toUpperCase()}
                </Typography>
              </Grid>
              <Grid container sx={{ m: 0.5, mt: 1 }}>
                <Typography sx={{ ml: 0.5, color: '#6486c2' }}>
                  Branch:
                </Typography>
                <Typography sx={{ ml: 0.5 }}>
                  {component?.codespaces[index].branch}
                </Typography>
              </Grid>
              <Grid container sx={{ m: 0.5, mt: 1 }}>
                <Typography sx={{ ml: 0.5, color: '#6486c2' }}>
                  Devcontainer:
                </Typography>
                <Typography sx={{ ml: 0.5 }}>
                  {component?.codespaces[index].devContainer}
                </Typography>
              </Grid>
              <Grid container sx={{ m: 0.5, mt: 1 }}>
                <Typography sx={{ ml: 0.5, color: '#6486c2' }}>
                  Machine Type:
                </Typography>
                <Typography sx={{ ml: 0.5 }}>
                  {component?.codespaces[index].machineType}
                </Typography>
              </Grid>
              <Grid container sx={{ m: 0.5, mt: 1 }}>
                <Typography sx={{ ml: 0.5, color: '#6486c2' }}>
                  Region:
                </Typography>
                <Typography sx={{ ml: 0.5 }}>
                  {component?.codespaces[index].region}
                </Typography>
              </Grid>
              <Grid container sx={{ m: 0.5, mt: 3, justifyContent: 'center' }} >
                <Button variant='outlined'
                  color='error'
                  onClick={() => deleteCodespace(index)}
                >
                  Delete
                </Button>
                <Button
                  variant='contained'
                  endIcon={buttonLoadingStates[index] ? (<SendIcon />) : (<CircularProgress size='15px' sx={{ m: '5px' }} color="inherit" />)}
                  onClick={() => goToCodespace(component?.codespaces[index].devContainer)}
                  sx={{ ml: 8 }}
                >
                  Start coding!
                </Button>
              </Grid>
            </CardContent>
          </Card> : ''
        ))}
      </CardContent>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {component?.devcontainers.length !== 0 ? <Button sx={{ 'backgroundColor': 'black', 'm': 1, '&:hover': { backgroundColor: '#282828' } }}
          variant='contained'
          color='primary'
          onClick={handleOpen}
          startIcon={<GitHubIcon />}
        >
          Create Codespace
        </Button> : ''}
      </CardContent>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Grid sx={{ display: 'flex' }}>
            <Typography sx={{ mr: '35%', mb: '3%' }} id="modal-modal-title" variant="h6" component="h2">
              Create a new codespace
            </Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
          </Grid>
          {showErrorMessage && (branch === '' || devcontainer === undefined) && (<span style={{ color: 'red' }}>Please fill in the branch and devcontainer fields.</span>)}
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mt: 3, mr: '5%' }}>
              Branch
            </Typography>
            <FormControl sx={{ mt: 3, width: '100%' }}>
              <Select
                value={branch}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => setBranch(e.target.value)}
              >
                {branches ? branches.map((branch, index) => (
                  <MenuItem key={index} value={branch.name}>{branch.label}</MenuItem>
                )) : ''}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mt: 3, mr: '5%' }}>
              Devcontainer
            </Typography>
            <FormControl sx={{ mt: 3, width: '100%' }}>
              <Select
                value={devcontainer}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => setDevcontainer(e.target.value)}
              >
                {component ? component.devcontainers.filter((container: string) =>
                  !component.codespaces.some((codespace: { username: string, devContainer: string }) => codespace.devContainer === container && codespace.username === userData.login),
                ).map((container: string, index: number) => (
                  <MenuItem key={index} value={container}>
                    {container.replace('cpp', 'c++').replace('-', ' ').replace('-', ' ').replace('-', ' ')}
                  </MenuItem>
                )) : null}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mt: 3, mr: '5%' }}>
              Region
            </Typography>
            <FormControl sx={{ mt: 3, width: '100%' }}>
              <Select
                value={region}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => setRegion(e.target.value)}
              >
                {regions ? regions.map((region, index) => (
                  <MenuItem key={index} value={region.name}>{region.label}</MenuItem>
                )) : ''}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mt: 3, mr: '5%' }}>
              Machine Type
            </Typography>
            <FormControl sx={{ mt: 3, width: '100%' }}>
              <Select
                value={machineType}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => setMachineType(e.target.value)}
              >
                {machineTypes ? machineTypes.map((machineType, index) => (
                  <MenuItem key={index} value={machineType.name}>{machineType.label}</MenuItem>
                )) : ''}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <Button sx={{ mr: 1, paddingLeft: 4, paddingRight: 4 }} variant="outlined" color="primary" onClick={handleClose}>Cancel</Button>
            <Button sx={{ paddingLeft: 4, paddingRight: 4 }} variant="contained" color="primary" onClick={createCodespace}>Create</Button>
          </Grid>
        </Box>
      </Modal>
    </Card>
    </Grid>
  );
}

