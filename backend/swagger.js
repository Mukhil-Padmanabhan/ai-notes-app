const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const deepmerge = require('deepmerge');

const notesDoc = YAML.load('./swagger/notes.yaml');
const authDoc = YAML.load('./swagger/auth.yaml');

const mergedSwaggerDoc = deepmerge(notesDoc, authDoc);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwaggerDoc));
};
