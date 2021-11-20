import React from "react";
import { withStyles } from '@mui/styles';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { useHistory } from "react-router";

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
}

const Icon = ({ icon, text, redirect }) => {
  return (
      <ListItemButton onClick={redirect}>
          <ListItemIcon>
              {icon}
          </ListItemIcon>
          <ListItemText primary={text}/>
      </ListItemButton>
  )
}

const Navbar = props => {
  const { classes } = props;
  const history = useHistory()

  const sideList = () => (
    <div
      className={classes.list}
      onKeyDown={props.toggleDrawerHandler}
      onClick={props.toggleDrawerHandler}
    >
      <List>
        <Icon text="Users" icon={<GroupIcon />} redirect={() => history.push("/users")} />
        <Icon text="Products" icon={<ProductionQuantityLimitsIcon />} redirect={() => history.push("/products")} />
      </List>
    </div>
  );

  return (
    <Drawer open={props.open} onClose={props.toggleDrawerHandler}>
      {sideList()}
    </Drawer>
  );
};

export default withStyles(styles)(Navbar);
