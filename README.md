
# Komga-Exporter

Prometheus Exporter Service for [Komga](https://github.com/gotson/komga/) written in TS for Deno. Designed for Docker deployments.

## Deployment
1. Create your .env file.
1. Build the Docker image and deploy it! 
1. Connect to Prometheus.
## Run Locally

Clone the project

```bash
  git clone https://github.com/firedfromlife/komga-exporter
```

Go to the project directory

```bash
  cd komga-exporter
```

Create your .env file.

Start the server

```bash
  deno run start
```


## Configuration
The server supports 4 environement variables:

| Key | Type | Default | Description | Example |
| --- | ----| -------| ----------- | ------- |
| API_KEY | String | N/A | API Key for a Komga admin account. | asdf1234 |
| API_URL | String | N/A | The URL of your Komga instance.| [http://komga.example.com](#) |
| PORT | Int | 9780| Port used to serve data.| - |
| TIMEOUT | Int|5000 | *UNUSED* | N/A |

## License

[MIT](https://choosealicense.com/licenses/mit/)

