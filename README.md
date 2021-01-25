#Classification subsets web application
Statistics Norway
2019-2021

# Installation guide for local environment

## Required software 
*   Git<br>
Download and install git.

*   Node.js (npm)<br>
Download and install [node.js](https://nodejs.org/en/) 

*   Browser<br>
Download and install a modern browser of your choice.<br>
Recommend to use Chrome, the most secure browser today.

## Source code (development branch)
This repo

## Start local server
Install dependencies for the project (production build):
```shell
$ cd /klass-subsets-web
$ npm start
```
In case you need to run a development build do: `$ npm install` instead of `$ npm run build`

## Start application in a browser
[http://localhost:3000/](http://localhost:3000/)

# React web application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm install react-scripts@latest`
Easy to maintain.<br>
Updating your build tooling is typically a daunting and time-consuming task. When new versions of Create React App are released, you can upgrade using this single command.
[https://facebook.github.io/create-react-app/](https://facebook.github.io/create-react-app/)

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved [here:](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved [here:](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved [here:](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved [here:](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved [here:](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved [here:](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

#System documentation
Statistisk Sentralbyrå
Experis Solutions

## Table of Contents
- [SSB Platform - Ansible](#system documentation)
    - [Table of Contents](#table-of-contents)
    - [Resources](#resources)
    - [Python 3 virtual environment](#python-3-virtual-environment)
        - [Traditional virtual environment](#traditional-virtual-environment)
        - [Pipenv](#pipenv)


Datastrukturer
API Veiledning
Tech stack
Frontend
API
Context Management, no Redux
Styling
Tester
Fetcher (SWR)
SWR doc: https://swr.vercel.app/
PWA (drag-and-drop)
Språk (Internationalization)
Backend
Single page
Logg
Installasjonsdokumentasjon
Miljøoversikt
Miljø
Endepunkt
Platform
Ansvar
Produksjonsmiljø PROD
https://subsets-service.prod-bip-app.ssb.no/v1/subsets
BIP (Cloud)
Team Klass, team Stratus
Testmiljø STAGING
https://subsets-service.staging-bip-app.ssb.no/v1/subsets
BIP (Cloud)
Team Klass, team Stratus
Utviklingsmiljø / lokalt miljø
http://localhost:3000/
PC
Hver utvikler er ansvarlig for å bygge, oppdatere og vedlikeholde sitt utviklingsmiljø.
Mer info https://github.com/statisticsnorway/klass-subsets-client

Miljøvariabler
.env
jsconfig.js (baseUrl)
src/defaults.js
src/serviceWorker.js + index.js (register/unregister)
Package.json
nginx.conf
Dockerfile
src/internationalisation/i18n.js
swr
Infrastruktur: Integrasjoner og avhengigheter
Dataflytt
Subset API v2
SSB Component bibliotek
LDS Klass
Klass API
Autentisering
Autorisering
Konsumenter
Cybersikkerhet
Konfidentialitet
Integritet (Input validering, session storage)
Tilgjengelighet
Overvåkning og revisjon
Autentisering
Autorisering
Sesjonsstyring
Avvikshåndtering
Konfigurasjonskontrol
Forbedringsforslag / Teknisk gjeld
Kjente feil
Ikke støtter IE11
Drag-and-drop fungerer ikke på moblile devices
Internationalization is briken.
Ønsket funsksjonalitet
Modification aggregation (signal if a subset has been locally modified).
Skjemavalidering with varsler;
Kommentarer (notes);
Nedlasting:
Opplasting;
Vise alle versjoner for ikke-autoriserte brukere
Vise alle språk for ikke-autoriserte brukere
Abonnere på uttrekks endringer
Oversette seksjonsnavn og emneområde
Automatiserte tester (unit-tester, integrasjonstester)
Rendingsytelse: analyse og effektivisering
Caching strategi (swr)
GSIM-skjema for uttrekkversion, samt LDS lagring av versjoner
Bedre brukeropplevelse (styling, plassering, ol.)
TODOs, FIXMEs, DOCMEs
Github issues
Refactor
Lagring- og publiseringsflow!
Use SWR everywhere
