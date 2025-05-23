import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListIcon from "@mui/icons-material/List";
import ListItemText from "@mui/material/ListItemText";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ViewOrders from "./viewOrders";
import AddProducts from "./addProducts";
import DeleteProducts from "./deleteProducts";
import UpdateProducts from "./updateproducts";
import ViewProducts from "./viewproducts";

import Companylogo from "../images/TataShortlogo.png";
import Tatacliqlog from "../images/tatacliqlogo.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f8bbd0",
      dark: "#ec407a",
    },
  },
});

function AdminHomeContent() {
  return (
    <>
      <Box sx={{ position: "relative", width: "100%", mb: 4, mt: 3 }}>
        <img
          src="https://media.glassdoor.com/l/2c/cc/2f/33/tata-cliq.jpg"
          alt="Tata CLiQ Logo"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "8px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "20px",
            borderRadius: "8px",
            width: { xs: "90%", sm: "80%", md: "60%" },
            backdropFilter: "blur(2px)",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome to Tata CLiQ
          </Typography>
          <Typography variant="h5" gutterBottom>
            Handle the products and orders at ease{" "}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

function AdminLandingPage() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("Home");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuItemClick = (selectedItem) => () => {
    setItem(selectedItem);
    setOpen(false);
  };

  const menuItems = [
    "Home",
    "View orders",
    "View products",
    "Add product",
    "Update product",
    "Delete product",
  ];

  const DrawerList = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={item === text}
              onClick={handleMenuItemClick(text)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.dark,
                  color: "black",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  color: "black",
                },
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: "black",
                },
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (item) {
      case "Home":
        return <AdminHomeContent />;
      case "View orders":
        return <ViewOrders />;
      case "Add product":
        return <AddProducts />;
      case "Update product":
        return <UpdateProducts />;
      case "Delete product":
        return <DeleteProducts />;
      case "View products":
        return <ViewProducts />;
      default:
        return (
          <Typography variant="h5">
            Please select an option from "View Options"
          </Typography>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer(false)}
          ModalProps={{ keepMounted: true }}
        >
          <DrawerList />
        </Drawer>
        <Box sx={{ p: 4, mt: 2, flex: 1 }}>
          {" "}
          <Button variant="contained" onClick={toggleDrawer(true)}>
            <ListIcon />
          </Button>
          <Box
            sx={{
              mt: 1,
              mb: 3,
              backgroundColor: "primary.dark",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={Companylogo}
              alt="Company Logo"
              style={{
                width: "5%",
                height: "80px",
                borderRadius: "10px",
              }}
            />
            <img
              src={Tatacliqlog}
              alt="Tata CLiQ Logo"
              style={{
                width: "25%",
                height: "100px",
                borderRadius: "8px",
              }}
            />
          </Box>
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLandingPage;
