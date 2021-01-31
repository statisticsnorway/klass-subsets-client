# Classification subsets web application

## Table of Contents
- [UI Usage](#ui-usage)
- [Data structures](#data-structures)
  - [Internal](#internal)
  - [Subsets API](#subsets-api)
  - [Klass API](#klass-api)
  - [GSIM schema](#gsim-schema)
- [API Guide](#api-guide)
- [Tech Stack](#tech-stack)
  - [React web application](#react-web-application)
- [Frontend](#frontend)
  - [Context Management](#context-management)
  - [Styling](#styling)
  - [Tests](#tests)
  - [Fetcher](#fetcher)
  - [PWA](#pwa)
  - [Internationalization](#internationalization)
  - [Session management](#session-management)
  - [Error handling](#error-handlig)
  - [Cache](#cache)
  - [File structure](#file-structure)
- [Backend](#backend)
  - [Single page](#single-page)
  - [Log](#log)
  - [Deployment](#deployment)
    - [Localhost](#lLocalhost)
    - [Staging](#staging)
    - [Production](#production)
- [Configuration](#configuration)
  - [React scripts](#react-scripts)
- [Integrations and dependencies](#integrations-and-dependencies)
  - [Data flow](#data-flow)
  - [Authentication](#authentication)
  - [Authorisation](#authorisation)
- [Technical debt](#Technical-debt)
  - [Known bugs](#known-bugs)
- [Performance](#performance)
- [User experience](#user-experience)
- [Accessibility](#accessibility)

# UI Usage
The application consist of two main parts:
- View subsets (public).
- Subset draft editor (admin). 
  
## View subsets
This part allows any user to view and search published and drafted subsets. This part does not require authentication.

## Subset draft editor
The editor is a six step interactive form.

# Data structures

### Internal
The main internal data structure is the `Subset.prototype`. It is responsible for holding all data about the subset draft and provide calculations and validation during editing.
In order to persist the user data session storage is used. It updates on each change in the draft.

## Subsets API
### `GET /subsets`
### `GET /subsets/{subsetId}/`
### `GET /subsets/{subsetId}/versions/{versionId}`
### `POST /subsets/{subsetId}/`
### `POST /subsets/{subsetId}/versions/{versionId}`
### `PUT /subsets/{subsetId}/`
### `PUT /subsets/{subsetId}/versions/{versionId}`
### `DELETE /subsets/{subsetId}/`
### `DELETE /subsets/{subsetId}/versions/{versionId}`

## Klass API
### `/classificationFamilies`
### `/ssbsections`
### `/classifications/{classificationId}`
### `/classifications/{classificationId}/versions/{versionId}`
### `/classifications/{classificationId}/codesAt...`

### GSIM schema 

# Client API Guide
### `/subsets`
To get overview over all published and saved subsets in the system.
Search by name through the subsets.
### `/subsets/{subsetId}/`
Shows a particular subset by setting the subsets ID instead of `{subsetsId}`.
A subsets preview page allows to open its versions, as well as open in edition mode.
### `/subsets/{subsetId}/versions/{versionId}`
Shows a particular version of a particular subset. One have to put correct `{subsetUd}` and `{versionId}`in the URL.
### `/editor/*` redirects to `/auth/editor/*`
Opens an empty form for creation and saving a new subset with versions.
Only SSB employees are allowed to create and edit subsets. By redirecting to `/auth` application will redirect to login page.
### `/editor?step={ Metadata | Versions | Codes | Oreder | Review }`
Users can specify a particular form step by naming it as a search parameter `step`. 
If the step name is wrong or outdated, the application will show the first step.
### `/editor?step={ Metadata | Versions | Codes | Oreder | Review }&subsetsId={subsetId}&versionsId={versionId}`
In addition to form step, users can specify `{subsetId}` and `{versionId}`.
### `/auth/save?metadata={ true | false }`
An extra step to save or publish a subset's metadata. 
The payload will be generated from the session storage variable `draft`.
### `/auth/save?version={ true | false }`
An extra step to save or publish a subset's version, which is set to be current.
The payload will be generated from the session storage variable `draft`.
### `/auth/save?metadata={ true | false }version={ true | false }`
An extra step to save or publish a subset's metadata.
An extra step to save or publish a subset's version, which is set to be current.
The payload will be generated from the session storage variable `draft`.

# Tech Stack
React 17 med React hooks
Docker

## React web application
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Frontend

## Context Management

## Styling
CSS

## Tests
Jest

## Fetcher
SWR

## PWA
Issues with drag-and-drop. Additional library has to be installed to convert browser drag-and-drop events into respective mobile events.
Mobile users can still reorder codes by using numbers and arrows.
Issues with responsive design.

## Internationalization
Internationalization is implemented with i18n.js library. The set up is for three languages (nb, nn, en), but oly two in use.

## Session storage
The local session storage is used to keep subset draft in memory throughout editing, site refresh and navigation.
The subset draft resets in session storage when user chose to start a new subset draft. All unsaved changes from the previous edition will be discarded without warning.
Current subset draft in edition mode will be overwritten by next subset draft opened in the editor. All unsaved changes from the previous edition will be discarded without warning.

## Error handling

## Cache
Standard caching is disabled as long as service worker is unregistered. It should be registered before shipping to the production.
SWR library has its own way to cache the response and update the content (stale-while-revalidate), this behaviour can be cofigured.

## Essential File structure
```text
.
├── src
│ ├── components
│ ├── controllers
│ │ ├── context
│ │ ├── klass-api
│ │ └── subsets-api
│ ├── internationalization
│ ├── models
│ │ └── Subset.prototype
│ ├── pages
│ │ ├── SearchSubsets
│ │ ├── editor
│ │ ├── subset
│ │ └── changelog
│ ├── utils
│ └── views
│ │ ├── code
│ │ └── Subset
│ ├── App.js
│ ├── defaults.js
│ └── serviceWorker.js
├── .env
├── azure-pipelines.yml
├── Dockerfile
├── jsconfig.json
├── nginx.conf
├── package.json
└── README.md
```

# Backend

## Deployment

### Localhost

#### Required software
*   Git<br>
    Download and install git.

*   Node.js (npm)<br>
    Download and install [node.js](https://nodejs.org/en/)

*   Browser<br>
    Download and install a modern browser of your choice.<br>
    Recommend to use Chrome, the most secure browser today.

#### Start local server
Install dependencies for the project (production build):
```shell
$ cd /klass-subsets-client
$ npm start
```
In case you need to run a development build do: `$ npm install` instead of `$ npm run build`

#### Start application in a browser
[http://localhost:3000/](http://localhost:3000/)

# Configuration

## React scripts
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

# Integrations and dependencies
## Data flow
## Authentication
## Authorisation]
## Technical debt
## Known bugs
#Performance

# User experience
# Accessibility