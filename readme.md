# Climb Weather Map
<p>
This is mostly a learning tool for myself but I also wanted this feature from a few better built crag weather sites so here it is
To be built via vite. The code relies on cloudflare r2 to pull in the data. <br>
The database gets updated daily in the morning so values may be out of sync until 5 am EST or so. (side effect of cloudflare subrequest limits);<br>
Data is based off of 
</P> 

[OpenBeta/climbing-data](https://github.com/OpenBeta/climbing-data)
 date grabbed: (2023-02-23)



## OpenLayers + Vite (doc)
Then change into your directory and start a development server:

    cd my-app
    npm start

To generate a build ready for production:

    npm run build

Then deploy the contents of the `dist` directory to your server.  You can also run `npm run serve` to serve the results of the `dist` directory for preview.
