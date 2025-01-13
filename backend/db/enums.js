// backend/db/enums.js

const knexEnums = [
    {
      name: 'user_role_enum',
      values: ['admin', 'user'],
    },
    {
      name: 'user_status_enum',
      values: ['active', 'inactive'],
    },
  ];
  
  module.exports = knexEnums;
  