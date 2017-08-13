import React, { PureComponent } from 'react';
import DrawerLayout from 'react-native-drawer-layout-polyfill';

import addNavigationHelpers from '../../addNavigationHelpers';
import DrawerSidebar from './DrawerSidebar';

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends PureComponent {

  componentWillMount() {
    this._updateScreenNavigation(this.props.navigation);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.navigation.state.index !== nextProps.navigation.state.index) {
      const { routes, index } = nextProps.navigation.state;
      if (routes[index].routeName === 'DrawerOpen') {
        this._drawer.openDrawer();
      } else {
        this._drawer.closeDrawer();
      }
    }
    this._updateScreenNavigation(nextProps.navigation);
  }

  _handleDrawerOpen = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerOpen') {
      this.props.navigation.navigate('DrawerOpen');
    }
  };

  _handleDrawerClose = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerClose') {
      this.props.navigation.navigate('DrawerClose');
    }
  };

  _updateScreenNavigation = navigation => {
    const navigationState = navigation.state.routes.find(route => route.routeName === 'DrawerClose');
    if (this._screenNavigationProp && this._screenNavigationProp.state === navigationState) {
      return;
    }
    this._screenNavigationProp = addNavigationHelpers({
      ...navigation,
      state: navigationState
    });
  };

  _getNavigationState = navigation => {
    const navigationState = navigation.state.routes.find(route => route.routeName === 'DrawerClose');
    return navigationState;
  };

  _renderNavigationView = () => <DrawerSidebar screenProps={this.props.screenProps} navigation={this._screenNavigationProp} router={this.props.router} contentComponent={this.props.contentComponent} contentOptions={this.props.contentOptions} style={this.props.style} />;

  render() {
    const DrawerScreen = this.props.router.getComponentForRouteName('DrawerClose');
    return <DrawerLayout ref={c => {
      this._drawer = c;
    }} drawerWidth={this.props.drawerWidth} onDrawerOpen={this._handleDrawerOpen} onDrawerClose={this._handleDrawerClose} renderNavigationView={this._renderNavigationView} drawerPosition={this.props.drawerPosition === 'right' ? DrawerLayout.positions.Right : DrawerLayout.positions.Left} moveView={this.props.moveView} spaceOnOpen={this.props.spaceOnOpen} viewOpacity={this.props.viewOpacity}>
        <DrawerScreen screenProps={this.props.screenProps} navigation={this._screenNavigationProp} />
      </DrawerLayout>;
  }
}