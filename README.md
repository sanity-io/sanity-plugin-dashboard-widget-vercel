# Vercel Dashboard Widget (for Sanity)

View your recent [Vercel](https://vercel.com/) deployments and manually trigger builds directly from your [Sanity](https://www.sanity.io/) dashboard.

![image](https://user-images.githubusercontent.com/209129/112195398-d0bf8380-8c01-11eb-8857-60c37ae50326.jpg)

## Features

- Displays a list of recent builds along with deployment aliases, branch / commit messages, build age and creator
- Manually trigger deployments straight from your studio (via Vercel deploy hook URLs)
- Display (and deploy) multiple projects at once
- Customise the number of visible deployment line items
- Automatically refreshes deployments periodically, as well as immediately after a manual build is triggered
- Built with [Sanity UI](https://www.sanity.io/ui)

## Install

In your Sanity project folder:

```sh
sanity install dashboard-widget-vercel
```

### Configure your dashboard

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
      layout: {
        width: 'full', // full width is recommended!
      },
    },
  ],
}
```

### Add a deployment target

Simply visit your Sanity dashboard and click the '+' icon in the top right to add a new deploment target.

You'll need to fill in the following:

#### Name (required)

The name assigned to a deployment target, used purely for presentational purposes in the dashboard.

Note that all deployment targets are sorted alphabetically.

#### Vercel Account Token (required)

This can be created in Vercel under **Account > Settings > Tokens**.

#### Vercel Project ID (required)

This can be retrieved via [Vercel's API](https://vercel.com/docs/api#endpoints/projects/get-projects).

#### Vercel Team ID

Similar to project IDs, you can retrieve these via Vercel's API.

If your project is assigned to a team account, you must provide both team and project IDs.

#### Vercel Deploy Hook

The Vercel deploy hook URL used to trigger new builds.

Enabled a manual deployment button if provided.

These can be created in Vercel by going to **Project > Settings > Git > Deploy Hooks**.

#### Number of deploys to display (min: 1, max: 15) (required)

The number of deployments to display and fetch.

## Good to know

### Token security

When setting up new deployment targets, you're asked to provide your Vercel account token. It's important to know that your Vercel token provides unrestricted API access to your entire Vercel account.

Your Vercel token and all other deployment settings are stored in the `vercel` namespace and by design, these [are not publicly accessible](https://www.sanity.io/docs/ids), even with a public dataset.

However, please note that this token is exposed to all _authenticated users_ in your Sanity studio.

If you need to limit exposure of this token to authenticated studio users, consider using [custom access control rules](https://www.sanity.io/docs/access-control) to limit access to documents of type `vercel.deploymentTarget`.

### Deployment considerations

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
