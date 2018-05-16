// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBzjxN1_Sq7XZEATgyWbMHbYU1sjfM8i7A',
    authDomain: 'fir-demo-923be.firebaseapp.com',
    databaseURL: 'https://fir-demo-923be.firebaseio.com',
    projectId: 'fir-demo-923be',
    storageBucket: 'fir-demo-923be.appspot.com',
    messagingSenderId: '152007194607'
  }
};
