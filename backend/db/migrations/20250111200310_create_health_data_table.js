exports.up = function (knex) {
  return knex.schema.createTable("health_data", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .string("user_id", 50)
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.integer("step_count").defaultTo(0);
    table.float("calories_burned").defaultTo(0.0);
    table.integer("heart_rate").defaultTo(0);
    table.string("health_metric_type", 50).defaultTo("general");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("health_data");
};
