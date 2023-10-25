import { Routes, Route, useLocation } from 'react-router-dom';
import { CreateComponent } from './components/Component/CreateComponent/CreateComponent';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { CatalogPage } from './components/Admin/Catalog/CatalogPage';
import { ConfigPage } from './components/Admin/Config/ConfigPage';
import { OrganizationPage } from './components/Admin/Organization/OrganizationPage';
import { OrganizationDetails } from './components/Admin/Organization/OrganizationDetails/OrganizationDetails';
import { AreaDetails } from './components/Admin/Organization/AreaDetails/AreaDetails';
import { BlueprintDetails } from './components/Admin/Organization/BlueprintDetails/BlueprintDetails';
import { NotFound } from './components/NotFound';
import { ComponentDetails } from './components/Component/ComponentDetails/ComponentDetails';
// import { Components } from './components/Components/Components';
import { ConfigProvider } from './components/ConfigContext';
import VerticalMenu from './components/VerticalMenu';
import { LoginHeader } from './components/LoginHeader';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import './components/simplebarcustom.css';
import { ProductDetails } from './components/Product/ProductDetails/ProductDetails';
import { CreateProduct } from './components/Product/CreateProduct/CreateProduct';
import { UpdateProduct } from './components/Product/UpdateProduct/UpdateProduct';

export function App() {
  const location = useLocation();

  // Check if the current location matches the login route
  const isLoginPage = location.pathname === '/login';

  return (
    <ConfigProvider>
      <SimpleBar style={{ maxHeight: '100vh' }}>
      <div style={{ display: 'flex' }}>
      {!isLoginPage && <VerticalMenu />} {/* Render VerticalMenu unless it's the login route */}
      <div style={{ width: '100%'}}>
      {!isLoginPage ? <Header /> : <LoginHeader />} {/* Render Header unless it's the login route */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ConfigPage />} />
          <Route path="/admin/catalog" element={<CatalogPage />} />
          <Route path="/admin/organization" element={<OrganizationPage />} />
          <Route path="/admin/organization/organizationDetails/:mode/:id" element={<OrganizationDetails />} />
          <Route path="/admin/organization/areaDetails/:mode/:idOrganization/:idArea" element={<AreaDetails />} />
          <Route path="/admin/organization/blueprintDetails/:mode/:idOrganization/:idArea/:idBlueprint" element={<BlueprintDetails />} />
          {/* <Route path="/proyects" element={<Components />} /> */}
          <Route path="/productDetails/:org/:area/:id" element={<ProductDetails />} />
          <Route path="/productDetails/:org/:area/:id/newcomponent" element={<CreateComponent />} />
          <Route path="/productDetails/:org/:area/:product/componentDetails/:id" element={<ComponentDetails />} />
          <Route path='/newproduct' element={<CreateProduct />} />
          <Route path='/productDetails/:org/:area/:id/editproduct' element={<UpdateProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </div>
      </SimpleBar>
    </ConfigProvider>
  );
}
