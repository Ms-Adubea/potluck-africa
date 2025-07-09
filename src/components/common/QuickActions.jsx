import React from 'react'

const QuickActions = () => {
    const actions = {
      potchef: [
        { label: 'Add Meal', icon: Plus },
        { label: 'View Orders', icon: Eye },
        { label: 'Update Profile', icon: User },
        { label: 'Analytics', icon: BarChart3 }
      ],
      potlucky: [
        { label: 'Browse Meals', icon: Search },
        { label: 'Reorder', icon: ShoppingCart },
        { label: 'Rate Meals', icon: Star },
        { label: 'My Profile', icon: User }
      ],
      franchisee: [
        { label: 'Approve Meals', icon: CheckCircle },
        { label: 'View Summary', icon: BarChart3 },
        { label: 'Manage Chefs', icon: Users },
        { label: 'Reports', icon: Package }
      ],
      admin: [
        { label: 'User Management', icon: Users },
        { label: 'Analytics', icon: BarChart3 },
        { label: 'System Settings', icon: Settings },
        { label: 'Reports', icon: Package }
      ]
    };
    return actions[currentRole];
  };


export default QuickActions;