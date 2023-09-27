// import { ToastContainer } from "./helpers";
// Themes
// import "./assets/scss/Saas.scss";
// import "./assets/scss/Modern.scss";
// import "./assets/scss/Material.scss";
// import "./assets/scss/Corporate.scss";
import { ToastContainer } from "react-toastify";

import AuthContext from "./auth/hooks/authContext";
import authService from "./auth/services/authService";
import { ShopCartProvider } from "./core/stores/shops/shop-cart-context";
// import "./assets/scss/Corporate.scss";
// import "./assets/scss/Creative.scss";
// import "./assets/scss/Material.scss";
import AppRoutes from "./routes/AppRoutes";
import HlpProvider from "./shared/contexts/hlp-context";

import "rc-tooltip/assets/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/scss/Default.scss";

const App = () => {
  const authUser = authService.authUser();

  return (
    <AuthContext.Provider value={authUser}>
      {/* <AuthProvider> */}
      <HlpProvider>
        <ShopCartProvider>
          <ToastContainer></ToastContainer>
          <AppRoutes />
        </ShopCartProvider>
      </HlpProvider>
      {/* </AuthProvider> */}
    </AuthContext.Provider>
  );
};

export default App;
