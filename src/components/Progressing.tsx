import { Grid, Box, CircularProgress, Typography } from '@mui/material';

export function Progressing(props: { text: String }) {
    const { text } = props;

    return (
        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5, mb: 5 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            color: (theme) =>
                                theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                        }}
                        size={80}
                        thickness={1}
                        value={100}
                    />
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                            color: (theme) => (theme.palette.mode === 'light' ? '#686868' : '#686868c9'),
                            animationDuration: '550ms',
                            position: 'absolute',
                            left: 0,
                        }}
                        size={80}
                        thickness={1}
                    />
                </Box>
                <Box
                    sx={{
                        top: 0,
                        left: 2,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                    >{text}</Typography>
                </Box>
            </Box>
        </Grid>
    );
};
