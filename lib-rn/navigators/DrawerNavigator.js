import React from 'react';
import { Dimensions, Platform } from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import DrawerScreen from '../views/Drawer/DrawerScreen';
import DrawerView from '../views/Drawer/DrawerView';
import DrawerItems from '../views/Drawer/DrawerNavigatorItems';

import NavigatorTypes from './NavigatorTypes';

const DefaultDrawerConfig = {
  /*
   * Default drawer width is screen width - header width
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  drawerWidth: Dimensions.get('window').width - (Platform.OS === 'android' ? 56 : 64),
  contentComponent: DrawerItems,
  drawerPosition: 'left',
  moveView: false,
  spaceOnOpen: 0,
  viewOpacity: 0
};

const DrawerNavigator = (routeConfigs, config) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const {
    containerConfig,
    drawerWidth,
    contentComponent,
    contentOptions,
    drawerPosition,
    moveView,
    spaceOnOpen,
    viewOpacity,
    ...tabsConfig
  } = mergedConfig;

  const contentRouter = TabRouter(routeConfigs, tabsConfig);

  const drawerRouter = TabRouter({
    DrawerClose: {
      screen: createNavigator(contentRouter, routeConfigs, config, NavigatorTypes.DRAWER)(props => <DrawerScreen {...props} />)
    },
    DrawerOpen: {
      screen: () => null
    }
  }, {
    initialRouteName: 'DrawerClose'
  });

  const navigator = createNavigator(drawerRouter, routeConfigs, config, NavigatorTypes.DRAWER)(props => <DrawerView {...props} drawerWidth={drawerWidth} contentComponent={contentComponent} contentOptions={contentOptions} drawerPosition={drawerPosition} moveView={moveView} spaceOnOpen={spaceOnOpen} viewOpacity={viewOpacity} />);

  return createNavigationContainer(navigator);
};

export default DrawerNavigator;