import Typography from '@mui/material/Typography';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { GeneralDetails } from './GeneralDetails/GeneralDetails';
import { TeamDetails } from './TeamDetails/TeamDetails';
import { grey } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import { axiosExperience } from '../../../axios';
import { CodeDetails } from './CodeDetails/CodeDetails';
import { IaCDetails } from './IaCDetails/IaCDetails';
import { Dialog, Grid, DialogTitle, DialogActions, DialogContent, Card, SvgIcon, styled } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { Progressing } from '../../Progressing';
import { ReactComponent as PythonIcon } from '../../../assets/icons/python.svg';
import { ReactComponent as SpringIcon } from '../../../assets/icons/spring.svg';
import { ReactComponent as JavaIcon } from '../../../assets/icons/java.svg';
import { ReactComponent as NetIcon } from '../../../assets/icons/net.svg';
import { ReactComponent as AngularIcon } from '../../../assets/icons/angular.svg';
import { ReactComponent as LiquibaseIcon } from '../../../assets/icons/liquibase.svg';
import { useEffect } from 'react';
import { PipelineStatus } from './PipelineDetails/PipelineStatus';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
          {value === index && (
              <Box sx={{ pt: 1.5, pb: 1.5, pl: 3, pr: 3 }}>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
      maxWidth: 60,
      width: '100%',
      backgroundColor: '#6486c2',
  },
});

interface StyledTabProps {
  label: string;
}
const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  'textTransform': 'none',
  'fontWeight': theme.typography.fontWeightRegular,
  'fontSize': theme.typography.pxToRem(15),
  'color': '#6486c299',
  '&.Mui-selected': {
      color: '#6486c299',
  },
}));

export function ComponentDetails() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { org, area, product, id } = useParams();
  const [post, setPost] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deletingProject, setDeletingProject] = React.useState(false);
  function getTechnologyIcon(type: String) {
    switch (type) {
      case 'python':
        return PythonIcon;
      case 'java':
        return JavaIcon;
      case 'springboot-restservice':
        return SpringIcon;
      case 'java-restclient':
        return JavaIcon;
      case 'netcore':
        return NetIcon;
      case 'angular':
        return AngularIcon;
      case 'dedalowangular':
        return AngularIcon;
      case 'dedalowspring':
        return SpringIcon;
      case 'dedalowjavamonolithic':
        return JavaIcon;
      case 'dedalowliquibase':
        return LiquibaseIcon;
    }
  }

  const deleteProject = async () => {
    try {
      setDeletingProject(true);
      await axiosExperience.delete(`components/${org}/${area}/${product}/${post.id}`);
      window.location.href = 'http://knot.westeurope.cloudapp.azure.com/';
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    axiosExperience.get(`components/${org}/${area}/${product}/${id}`).then((response) => {
      setPost(response.data);
      // console.log(response.data);
    });
  }, []);

  return (
    <>
      <Grid sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
        {post ?
          <Card sx={{ pt: 4, pb: 4, pl: 1, pr: 1 }}>
            <Grid container spacing={1}>
              <Grid item xl={1} md={1} xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SvgIcon sx={{ fontSize: 70 }} component={getTechnologyIcon(post.technology)} inheritViewBox />
              </Grid>
              <Grid item xl={10} md={10} xs={12} sm={12}>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid>
                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>{post.name}</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item md sm={6} xs={12}>
                    <Typography sx={{ mt: 0.5, fontSize: 14 }}><b>Technology: </b>{post.technology}</Typography>
                  </Grid>
                  <Grid item md sm={6} xs={12}>
                    <Typography sx={{ mt: 0.5, fontSize: 14 }}><b>Creation Date: </b>{post.date}</Typography>
                  </Grid>
                  <Grid item md sm={6} xs={12}>
                    <Typography sx={{ mt: 0.5, fontSize: 14 }}><b>Ha: </b>{post.ha ? 'Si' : 'No'}</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item md sm={6} xs={12}>
                    <Typography sx={{ mt: 0.5, fontSize: 14 }}>
                      <b>Automation Tool: </b>{post.automationTool}
                    </Typography>
                  </Grid>
                  <Grid item md sm={6} xs={12}>
                    <Typography sx={{ mt: 0.5, fontSize: 14 }}>
                      <b>Git Branching: </b>{post.gitBranching}
                    </Typography>
                  </Grid>
                  <Grid item md sm={6} xs={12}>
                    <Typography sx={{ mt: 0.5, fontSize: 14 }}>
                      <b>Registry: </b>{post.containerRegistry}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item md sm={12} xs={12}>
                  <Typography sx={{ mt: 0.5, fontSize: 14 }}>
                    <b>Description: </b>{post.description}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xl={1} md={1} xs={12} sm={12}
                container
                direction="column"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid>
                  <Button sx={{ 'fontSize': '11px', 'width': '55px', 'border': '1px solid #6486c2', 'color': '#6486c2', 'height': '30px', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined">Edit</Button>
                </Grid>
                <Grid>
                  <Button sx={{ 'mt': '10px', 'fontSize': '11px', 'width': '55px', 'border': '1px solid #6486c2', 'color': '#6486c2', 'height': '30px', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" onClick={handleOpen}>Delete</Button>
                </Grid>
              </Grid>
            </Grid>
          </Card> : ''}
        <Box sx={{ mt: 3 }}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: 'transparent' },
              '& .MuiTab-root.Mui-selected': { color: '#6486c2' },
            }}
          >
            <StyledTab label="Releases" />
            <StyledTab label="Team" />
            <StyledTab label="Pipelines" />
            {post && post.devcontainers ? <StyledTab label="Code" /> : ''}
            {post && post.bbdd.enabled ? <StyledTab label="IaC" /> : ''}
          </StyledTabs>
        </Box>
        {/* <Grid sx={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', height: '40px' }}>
          <Button sx={{ 'borderRadius': '20px', 'mr': 3, 'backgroundColor': '#c71020', '&:hover': { backgroundColor: '#c71020c9' }, 'mb': 0.5, 'height': '40px' }}
            variant='contained'
            color='error'
            startIcon={<RemoveIcon />}
            disableElevation
            onClick={handleOpen}
          >
            Delete Component
          </Button>
        </Grid> */}
      </Grid>
      <Paper sx={{ 'bgcolor': grey[100], 'mx': 3, 'p': 0.5 }} elevation={1}>
        <TabPanel value={value} index={0}>
          <GeneralDetails dataParentToChild={post} org={org} area={area} product={product}></GeneralDetails>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TeamDetails dataParentToChild={post} org={org} area={area} product={product}></TeamDetails>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <PipelineStatus dataParentToChild={post} org={org} area={area} product={product}></PipelineStatus>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CodeDetails dataParentToChild={post} org={org} area={area} product={product}></CodeDetails>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <IaCDetails dataParentToChild={post} org={org} area={area} product={product}></IaCDetails>
        </TabPanel>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' sx={{ mt: '15px', ml: '15px', mr: '15px' }}>
          {deletingProject ? '' : 'Are you sure you want to delete the project?'}
        </DialogTitle>
        <DialogContent>
          {deletingProject ? <Progressing text='DELETING' /> : ''}
        </DialogContent>
        {deletingProject ? '' : <DialogActions sx={{ mb: '20px', ml: '15px', mr: '35px' }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={deleteProject} variant="outlined">
            OK
          </Button>
        </DialogActions>}
      </Dialog>
    </>
  );
}
