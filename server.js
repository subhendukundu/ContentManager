import path from 'path';
import express from 'express';
import firebase from 'firebase';
import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactMaterialize from 'react-materialize';


/* const componentlistNames = componentNames ?  Object.keys(componentNames).map((key, index) => {
  const ComponentToRender = ReactMaterialize[key];
  return componentNames[key].map(all => {
    return (
      <div>
        <ComponentToRender {...all}>{all.children}</ComponentToRender>
      </div>
    )
  })
}) : ''; */

class GetComponent {
  constructor () {
    const config = {
      apiKey: "AIzaSyD1H3he_wQ2UjFzXkZIiR0gN74EODAQ6vM",
      authDomain: "aemjs-faf0b.firebaseapp.com",
      databaseURL: "https://aemjs-faf0b.firebaseio.com",
      projectId: "aemjs-faf0b",
      storageBucket: "",
      messagingSenderId: "167803884230"
    };
    firebase.initializeApp(config);
  }
  static async getIndividualCompoenetDetails () {
    const app = await firebase.database().ref('pages/test100');
		const snapshot = await app.once('value');
    const { dataForFirebase } = snapshot.val();
    return dataForFirebase;
  }

  static async componentlistNames (componentNames) {
    console.log(componentNames);
    const components = await Object.keys(componentNames).map((key, index) => {
      console.log(key)
      const ComponentToRender = ReactMaterialize[key];
      return componentNames[key].map(all => {
        return (
          renderToString(
            <ComponentToRender {...all}>{all.children}</ComponentToRender>
          )
        )
      })
    });
    return components;
  }
}

new GetComponent();

const DIST_DIR = path.join(__dirname, "public");
const PORT = 1000;
const app = express();

app.use(express.static(DIST_DIR));

app.get("/", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.get("/test.html", async (req, res) => {
  const { componentNames }  = await GetComponent.getIndividualCompoenetDetails();
  const allComponentToRender = await GetComponent.componentlistNames(componentNames);
  res.send(`
  <!DOCTYPE html>
    <head>
      <title>Component Manager</title>
      <link rel="stylesheet" type="text/css" href="./bundle.css">
      <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!-- Import materialize.css -->
      <link href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css" rel="stylesheet">
    </head>
    <body>
      <div id="root">
        ${allComponentToRender}
      <div id="container"></div>
      </div>
      <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>
    </body>
  </html>`);
});

app.listen(PORT, () => {
	console.log("Server Started at port 1000");
});