import { Products } from './Product/Products';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import React, { ChangeEvent, useState } from 'react';
import { axiosExperience } from '../axios';
import Cookies from 'js-cookie';

export const Dashboard = () => {
  const [post, setPost] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  interface Product {
    name: string;
  }
  React.useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      const userParse = JSON.parse(user);
      axiosExperience.get('products/listProducts/' + userParse.login).then((response) => {
        setPost(response.data);
      });
    }
  }, []);
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  return (
    <>
      <Box sx={{ mx: 3, mt: 1.5, mb: 1, display: 'flex', alignItems: 'center' }}>
        <TextField sx={{ my: 1 }} size="small" placeholder="Search ..."
          onChange={handleSearchChange}
          value={searchQuery}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <Box sx={{ my: 1, mr: 0.5, display: 'flex', flexDirection: 'row-reverse', flexGrow: 1 }}>
          <Button sx={{ 'border': '1px solid #6486c2', 'color': '#6486c2', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} href="/newproduct" startIcon={<AddIcon />} variant="outlined" size="small" disableElevation>New Product</Button>
        </Box>
      </Box>
      <Products
        dataParentToChild={post?.filter((product: Product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
      />
    </>
  );
};
