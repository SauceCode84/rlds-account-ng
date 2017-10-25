// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBXMFZoCp-oGr9JZzBwDME1_vUAMAeK5Ls",
    authDomain: "rlds-invoice.firebaseapp.com",
    databaseURL: "https://rlds-invoice.firebaseio.com",
    projectId: "rlds-invoice",
    storageBucket: "rlds-invoice.appspot.com",
    messagingSenderId: "61007094691"
  },
  apiUrl: "http://localhost:3000"
};
