# Vercel Dashboard Widget (for Sanity)

View your recent [Vercel](https://vercel.com/) deployments and manually trigger builds directly from your [Sanity](https://www.sanity.io/) dashboard.

![image](https://user-images.githubusercontent.com/209129/99883578-55809d80-2c20-11eb-92e9-983b2038d46d.png)

## Features

- Displays a list of recent builds along with deployment aliases, branch / commit messages, build age and creator
- Refreshes periodically (every 20 seconds), when the window gains focus and immediately after a manual build is triggered
- Can also optionally display a button for manual builds

## Install

In your Sanity project folder:

```sh
sanity install dashboard-widget-vercel
```

### Configure the plugin

If you haven't configured a [dashboard](https://www.sanity.io/docs/dashboard) yet:

```sh
sanity install @sanity/dashboard
```

In your studio's `sanity.json` append the following to `plugins` and `parts`:

```javascript
"plugins": [
  // ...
  "dashboard-widget-vercel"
],
"parts": [
  // ...
  {
    "implements": "part:@sanity/dashboard/config",
    "path": "dashboardConfig.js"
  }
]
```

In `dashboardConfig.js`, ensure that `widgets` includes the following:

```javascript
export default {
  widgets: [
    // ...
    {
      name: 'vercel',
      options: {
        deployLimit: 5,
        deployHook: '%YOUR_DEPLOY_HOOK%', // optional
        forceSmallLayout: false, // optional
        projectId: '%YOUR_PROJECT_ID%',
        teamId: '%YOUR_PROJECT_ID%', // optional
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

### token: string (required)

Your Vercel API token.

These can be created in Vercel under **Account > Settings > Tokens**.

Remember that your token has access to your _entire account_, please strongly consider using [environment variables](https://www.sanity.io/docs/studio-environment-variables) as opposed to hard coding / checking these into source control.

### deployLimit: number (min: 1, max: 15) (required)

The number of deployments to display and fetch.

### projectId: string (required)

Your Vercel project ID.

These can be retrieved via [Vercel's API](https://vercel.com/docs/api#endpoints/projects/get-projects).

### teamId: string

Your Vercel team ID.

Similar to project IDs, you can retrieve these via Vercel's API.

_If your project is assigned to a team account, you must provide both team and project IDs_.

### deployHook: string

Vercel deploy hook URLs used to trigger new builds.

If one is provided, a 'deploy' button will appear at the footer of the widget.

These can be created in Vercel by going to **Project > Settings > Git > Deploy Hooks**.

### forceSmallLayout: boolean (default: false)

This plugin uses media queries to render the table differently at varying breakpoints and works best if you specify `width: large` in the plugin `layout` object.

In the event you'd like to use a `small` or `medium` width, you can force this plugin to render compact items with `forceSmallLayout: true` which will display much more nicely at more constrained widths.

## Good to know

Your Vercel token is currently bundled in the Sanity studio application payload and currently publicly accessible. This will be addressed in a future release - see [#2](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/issues/2)

Please also keep the following in mind when manually deploying:

> Triggering a Deploy Hook will not rebuild an existing deployment. Instead, it will create a new deployment using the latest source code available on the specified branch.
>
> Currently, no build cache is used when triggering a Deploy Hook.
>
> If you send multiple requests to deploy the same version of your project, previous deployments for the same Deploy Hook will be canceled to reduce build times.

[More information on deploy hooks](https://vercel.com/docs/more/deploy-hooks#technical-details)  
[Vercel rate limits](https://vercel.com/docs/platform/limits#rate-limits)

## Contributing

Contributions, issues and feature requests are welcome!
