# Item Viewer frontend

This is the frontend for the Item Viewer demo application. It is a Vue web app built with Nuxt and Vuetify. It connects to the Item Viewer backend to retrieve item data, then displays the data in the UI.

Note: Before using the frontend, you must first deploy the Item Viewer backend.  
[https://github.com/realitems/item-viewer-backend](https://github.com/realitems/item-viewer-backend)

## Usage

After deploying the backend, copy the URL of the backend endpoint and set it as the value of `PROXY_URL` in `store/index.js`.

To run locally, first install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Once it's running, enter an item ID in the item ID field and click the "View Item" button.

To deploy to production, build the app:

```bash
npm run build
```

Then, deploy the contents of the `dist` folder to your web server.
