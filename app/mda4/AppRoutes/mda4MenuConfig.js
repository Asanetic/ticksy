// mda4MenuConfig.js
//
// Sidebar menu for the "mda4" app. Extended by clone-module.js: modules you
// confirm are added below, grouped by the first word of their table name
// (fuel_stations, fuel_pumps -> "Fuel"). Modules already here are never duplicated,
// and the file is copied to _recycled/ before any change - so reorder, rename,
// regroup, add dashboards or quick actions and set `roles` freely.
// Your own grouping: app/<app>/AppRoutes/menuGroups.txt  ("Sales = fuel_sales, sales_orders").

export const mda4SidebarConfig = [

  // ============================================================
  // HOME  (added by clone-module.js)
  // ============================================================
  {
    type: "link",
    label: "Dashboard",
    icon: "fa fa-dashboard",
    href: (routes) => `${routes.mda4}/dashboard/main`,
    roles: []
  },


  // ============================================================
  // ORGANISERS  (added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Organisers",
    icon: "fa fa-folder-o",
    roles: [],
    items: [

      {
        label: "Add New Organiser",
        href: (routes) => `${routes.mda4}/organisers/profile`,
        roles: []
      },
      {
        label: "Manage Organisers",
        href: (routes) => `${routes.mda4}/organisers/list?setgv=sheet`,
        roles: []
      },
      {
        label: "View Organisers",
        href: (routes) => `${routes.mda4}/organisers/list?setgv=table`,
        roles: []
      },
      {
        label: "Import Organisers",
        href: (routes) => `${routes.mda4}/organisers/import`,
        roles: []
      }

    ]
  },

  // ============================================================
  // USERS  (added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Users",
    icon: "fa fa-user",
    roles: [],
    items: [

      {
        label: "Add New User",
        href: (routes) => `${routes.mda4}/users/profile`,
        roles: []
      },
      {
        label: "Manage Users",
        href: (routes) => `${routes.mda4}/users/list?setgv=sheet`,
        roles: []
      },
      {
        label: "View Users",
        href: (routes) => `${routes.mda4}/users/list?setgv=table`,
        roles: []
      },
      {
        label: "Import Users",
        href: (routes) => `${routes.mda4}/users/import`,
        roles: []
      }

    ]
  },

  // ============================================================
  // EVENTS  (added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Events",
    icon: "fa fa-calendar",
    roles: [],
    items: [

      {
        label: "Add New Event",
        href: (routes) => `${routes.mda4}/events/profile`,
        roles: []
      },
      {
        label: "Manage Events",
        href: (routes) => `${routes.mda4}/events/list?setgv=sheet`,
        roles: []
      },
      {
        label: "View Events",
        href: (routes) => `${routes.mda4}/events/list?setgv=table`,
        roles: []
      },
      {
        label: "Import Events",
        href: (routes) => `${routes.mda4}/events/import`,
        roles: []
      }

    ]
  },

  // ============================================================
  // TICKET  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Ticket",
    icon: "fa fa-ticket",
    roles: [],
    items: [
      // <menu-group:ticket>
      {
        type: "submenu",
        label: "Types",
        icon: "fa fa-ticket",
        roles: [],
        items: [
          {
            label: "Add New Type",
            href: (routes) => `${routes.mda4}/tickettypes/profile`,
            roles: []
          },
          {
            label: "Manage Types",
            href: (routes) => `${routes.mda4}/tickettypes/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Types",
            href: (routes) => `${routes.mda4}/tickettypes/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Types",
            href: (routes) => `${routes.mda4}/tickettypes/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Tickets",
        icon: "fa fa-ticket",
        roles: [],
        items: [
          {
            label: "Add New Ticket",
            href: (routes) => `${routes.mda4}/tickets/profile`,
            roles: []
          },
          {
            label: "Manage Tickets",
            href: (routes) => `${routes.mda4}/tickets/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Tickets",
            href: (routes) => `${routes.mda4}/tickets/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Tickets",
            href: (routes) => `${routes.mda4}/tickets/import`,
            roles: []
          }
        ]
      },
      // </menu-group:ticket>
    ]
  },

  // ============================================================
  // ORDER  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Order",
    icon: "fa fa-shopping-cart",
    roles: [],
    items: [
      // <menu-group:order>
      {
        type: "submenu",
        label: "Orders",
        icon: "fa fa-shopping-cart",
        roles: [],
        items: [
          {
            label: "Add New Order",
            href: (routes) => `${routes.mda4}/orders/profile`,
            roles: []
          },
          {
            label: "Manage Orders",
            href: (routes) => `${routes.mda4}/orders/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Orders",
            href: (routes) => `${routes.mda4}/orders/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Orders",
            href: (routes) => `${routes.mda4}/orders/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Items",
        icon: "fa fa-shopping-cart",
        roles: [],
        items: [
          {
            label: "Add New Item",
            href: (routes) => `${routes.mda4}/orderitems/profile`,
            roles: []
          },
          {
            label: "Manage Items",
            href: (routes) => `${routes.mda4}/orderitems/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Items",
            href: (routes) => `${routes.mda4}/orderitems/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Items",
            href: (routes) => `${routes.mda4}/orderitems/import`,
            roles: []
          }
        ]
      },
      // </menu-group:order>
    ]
  },

  // ============================================================
  // PAYMENTS  (added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Payments",
    icon: "fa fa-credit-card",
    roles: [],
    items: [

      {
        label: "Add New Payment",
        href: (routes) => `${routes.mda4}/payments/profile`,
        roles: []
      },
      {
        label: "Manage Payments",
        href: (routes) => `${routes.mda4}/payments/list?setgv=sheet`,
        roles: []
      },
      {
        label: "View Payments",
        href: (routes) => `${routes.mda4}/payments/list?setgv=table`,
        roles: []
      },
      {
        label: "Import Payments",
        href: (routes) => `${routes.mda4}/payments/import`,
        roles: []
      }

    ]
  },

  // ============================================================
  // CHECK INS  (added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Check ins",
    icon: "fa fa-folder-o",
    roles: [],
    items: [

      {
        label: "Add New Check in",
        href: (routes) => `${routes.mda4}/checkins/profile`,
        roles: []
      },
      {
        label: "Manage Check ins",
        href: (routes) => `${routes.mda4}/checkins/list?setgv=sheet`,
        roles: []
      },
      {
        label: "View Check ins",
        href: (routes) => `${routes.mda4}/checkins/list?setgv=table`,
        roles: []
      },
      {
        label: "Import Check ins",
        href: (routes) => `${routes.mda4}/checkins/import`,
        roles: []
      }

    ]
  },

  // ============================================================
  // REPORTS  (added by gen-report.js)
  // ============================================================

  {
    type: "submenu",
    label: "Reports",
    icon: "fa fa-bar-chart",
    roles: [],
    items: [

      {
        type: "submenu",
        label: "Tickets",
        roles: [],
        items: [
          {
            label: "Ticket Bookings",
            href: (routes) => `${routes.mda4}/reports/tickets/tickets/list`,
            roles: []
          }
          // gen-report:group:tickets:end
        ]
      },
      {
        type: "submenu",
        label: "Events",
        roles: [],
        items: [
          {
            label: "Event Performance",
            href: (routes) => `${routes.mda4}/reports/events/events/list`,
            roles: []
          }
          // gen-report:group:events:end
        ]
      },
      {
        type: "submenu",
        label: "Payments",
        roles: [],
        items: [
          {
            label: "Payment Collections",
            href: (routes) => `${routes.mda4}/reports/payments/payments/list`,
            roles: []
          }
          // gen-report:group:payments:end
        ]
      }
      // gen-report:reports:end

    ]
  }
];
