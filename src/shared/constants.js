export const ORIGIN_API = (typeof process.env.VUE_APP_ATTACK_ORIGIN_API === 'string')
  ? process.env.VUE_APP_ATTACK_ORIGIN_API : window.location.origin;
export const ORIGIN_AUTH = (typeof process.env.VUE_APP_ATTACK_ORIGIN_AUTH === 'string')
  ? process.env.VUE_APP_ATTACK_ORIGIN_AUTH : window.location.origin;

export const USER_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  DELETED: 'deleted',
};

export const AREA_TYPE_LAND = 1;
export const AREA_TYPE_SEA = 2;

export const GAME_STATUS = {
  NEW: 'new',
  STARTED: 'started',
  RUNNING: 'running',
  DONE: 'done',
};

export const mapStylesEditor = [
  {
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const mapStylesGame = [
  {
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];
