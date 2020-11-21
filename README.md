# Vercel Dashboard Widget (for Sanity)

View your recent [Vercel](https://vercel.com/) deployments and manually trigger builds directly from your [Sanity](https://www.sanity.io/) dashboard.

![image](https://user-images.githubusercontent.com/209129/99883578-55809d80-2c20-11eb-92e9-983b2038d46d.png)

## Features

- Displays a list of recent builds along with deployment aliases, branch / commit messages, build age and creator
- Refreshes periodicallly (every 20 seconds), when the window gains focus and immediately after a manual build is triggered
- Can also optionally display a button for manual builds

## Install

In your Sanity project folder:

```sh
sanity install dashboard-widget-vercel
```

### Configure the plugin

1. If you haven't already configured a dashboard, in your studio's `sanity.json` append the following:

   ```json
   {
     "implements": "part:@sanity/dashboard/config",
     "path": "src/dashboardConfig.js"
   }
   ```

2. In your `dashboardConfig.js` file, append the following:

   ```javascript
   export default {
     widgets: [
       // Add your other widgets here
       // ...
       {
         name: 'vercel',
         options: {
           deployLimit: 5,
           deployHook: '%YOUR_DEPLOY_HOOK%', // optional
           projectId: '%YOUR_PROJECT_ID%',
           token: '%VERCEL_TOKEN%',
         },
         layout: {
           width: 'large',
         },
       },
     ],
   }
   ```

   This will display the 5 most recent deploys from your Vercel project and a button to trigger manual builds.

## Plugin options

- **token** (required)  
  _String_

  Your Vercel API token.

  These can be created in your Vercel account under **Settings > Tokens**.

  Remember that your token has access to your _entire account_, please strongly consider using [environment variables](https://www.sanity.io/docs/studio-environment-variables) rather than hard coding / checking these into source control.

- **deployLimit** (required)  
  _Number (min: 1, max: 20)_

  The number of deployments to display and fetch.

- **projectId** (required)  
  _String_

  Your Vercel project ID.

  These can be retrieved via [Vercel's API](https://vercel.com/docs/api#endpoints/projects/get-projects).

- **teamId**  
  _String_

  Your Vercel team ID.

  Similar to project IDs, you can retrieve these via Vercel's API.

  You'll need to supply this if your project is assigned to a team account – in these cases, just supplying the project ID isn't enough.

- **deployHook**  
  _String_

  Vercel deploy hook URLs used to trigger new builds. If one is provided, a 'deploy' button will appear at the footer of the widget.

  These can be created in Vercel by going to **Project > Settings > Git > Deploy Hooks**.

- **forceSmallLayout**  
  _Boolean_ (default: false)

  This plugin uses media queries to render the table at different breakpoints, and works best if you use a `large` plugin width.

  In the event you'd like to use a `small` or `medium` width, you can force this plugin to render compact items with `forceSmallLayout: true`.

## Good to know

Please keep the following in mind when manually deploying:

> Triggering a Deploy Hook will not rebuild an existing deployment. Instead, it will create a new deployment using the latest source code available on the specified branch.
>
> Currently, no build cache is used when triggering a Deploy Hook.
>
> If you send multiple requests to deploy the same version of your project, previous deployments for the same Deploy Hook will be canceled to reduce build times.

[More information on deploy hooks](https://vercel.com/docs/more/deploy-hooks#technical-details)  
[Vercel rate limits](https://vercel.com/docs/platform/limits#rate-limits)

## Contributing

Contributions, issues and feature requests are welcome!
