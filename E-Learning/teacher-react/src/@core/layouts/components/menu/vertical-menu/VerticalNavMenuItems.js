import React from 'react';
// ** Vertical Menu Components
import VerticalNavMenuLink from './VerticalNavMenuLink'
import VerticalNavMenuGroup from './VerticalNavMenuGroup'
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader'

// ** Utils
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@layouts/utils'
import { getLoggedInUser, isUserPlanExpired } from '../../../../../helpers/backend-helpers';

const VerticalMenuNavItems = props => {
  // ** Components Object
  const Components = {
    VerticalNavMenuSectionHeader,
    VerticalNavMenuGroup,
    VerticalNavMenuLink
  }

  const loggedInUser = getLoggedInUser();

  // ** Render Nav Menu Items
  let navItems = props.items;

  if (loggedInUser && (loggedInUser.teacher.status === 'new' || isUserPlanExpired()) ) {
    navItems = navItems.filter(item => item.newUserAccessible);
  }

  const RenderNavItems = navItems.map((item, index) => {

    const TagName = Components[resolveNavItemComponent(item)]

    return <TagName key={item.id || item.header} item={item} {...props} />
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
