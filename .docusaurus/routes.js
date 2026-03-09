import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/website/__docusaurus/debug',
    component: ComponentCreator('/website/__docusaurus/debug', '718'),
    exact: true
  },
  {
    path: '/website/__docusaurus/debug/config',
    component: ComponentCreator('/website/__docusaurus/debug/config', '396'),
    exact: true
  },
  {
    path: '/website/__docusaurus/debug/content',
    component: ComponentCreator('/website/__docusaurus/debug/content', '5fd'),
    exact: true
  },
  {
    path: '/website/__docusaurus/debug/globalData',
    component: ComponentCreator('/website/__docusaurus/debug/globalData', 'd0b'),
    exact: true
  },
  {
    path: '/website/__docusaurus/debug/metadata',
    component: ComponentCreator('/website/__docusaurus/debug/metadata', 'd92'),
    exact: true
  },
  {
    path: '/website/__docusaurus/debug/registry',
    component: ComponentCreator('/website/__docusaurus/debug/registry', '185'),
    exact: true
  },
  {
    path: '/website/__docusaurus/debug/routes',
    component: ComponentCreator('/website/__docusaurus/debug/routes', '6e8'),
    exact: true
  },
  {
    path: '/website/docs',
    component: ComponentCreator('/website/docs', '5e8'),
    routes: [
      {
        path: '/website/docs',
        component: ComponentCreator('/website/docs', '981'),
        routes: [
          {
            path: '/website/docs',
            component: ComponentCreator('/website/docs', 'ecf'),
            routes: [
              {
                path: '/website/docs/intro',
                component: ComponentCreator('/website/docs/intro', 'c9e'),
                exact: true,
                sidebar: "pixelstormSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
