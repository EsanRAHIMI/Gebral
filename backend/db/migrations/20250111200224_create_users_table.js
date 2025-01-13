exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable().index('users_name_idx');
    table.string('email', 255).notNullable().unique().index('users_email_idx');
    table.string('password', 255).notNullable();
    table.specificType('role', 'user_role_enum').notNullable().defaultTo('user');
    table.specificType('status', 'user_status_enum').notNullable().defaultTo('active');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
