module.exports = function makeAllRequired(schema) {
  for (const i in schema.paths) {
    const attribute = schema.paths[i];
    attribute.required = true;
  }
}

