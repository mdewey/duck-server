const express = require('express')
const fs = require('fs');
const { get } = require('http');
const app = express()
const port = 3000


let rawdata = fs.readFileSync('api.v0.json');
let apiDocs = JSON.parse(rawdata);

const getDataForType = (item) => {
  const { type } = item;
  console.log(item)
  if (type === "string") {
    return item.example || "random example";
  } else if (type === "integer") {
    return 1;
  } else if (type === "boolean") {
    return true;
  }
  else if (type === "object") {
    const sample = {}
    Object.keys(item.properties).forEach(function (key) {
      sample[key] = getDataForType(item.properties[key]);
    });
    return sample;
  }
  else if (type === "array") {
    const sample = {}
    Object.keys(item.items.properties).forEach(function (key) {
      sample[key] = getDataForType(item.items.properties[key]);
    });
    return [sample];
  }
}


Object.keys(apiDocs.paths).forEach(function (key) {
  console.log(key);
  app.get(key, (req, res) => {
    const method = req.method.toLowerCase();
    if (apiDocs.paths[key][method] == undefined) {
      res.send('Method not allowed');
      return;
    }
    if (apiDocs.paths[key][method].responses[200]) {
      const { schema } = apiDocs.paths[key][method].responses[200];
      if (schema['$ref']) {
        const definition = apiDocs.definitions[schema['$ref'].replace('#/definitions/', '')];
        const rv = {};
        Object.keys(definition.properties).forEach(function (key) {
          rv[key] = getDataForType(definition.properties[key]);
        });
        res.send(rv);

      } else {
        if (schema.items) {
          const rv = [];
          const sample = {};
          Object.keys(schema.items.properties).forEach(function (key) {
            sample[key] = getDataForType(schema.items.properties[key]);
          });
          rv.push(sample);
          res.send(rv);
        } else if (schema.properties) {
          const rv = {};
          Object.keys(schema.properties).forEach(function (key) {
            rv[key] = getDataForType(schema.properties[key]);
          });
          res.send(rv);
        } else {
          res.send(schema);
        }
      }
    } else {
      res.send('Method not allowed');
      return;
    }


  });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})