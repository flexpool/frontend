# Crowdin Admin Guide

This document describes how to pull & push Crowdin translations via Crowdin CLI.

## Setup

1. Install Crowdin CLI: [Crowdin CLI Installation Page](https://support.crowdin.com/cli-tool/#installation).
2. Get an API token on [Crowdin Profile Settings > API Keys](https://crowdin.com/settings#api-key).
3. Copy the example `crowdin.yml` config file:
```sh
cp crowdin.yml.example crowdin.yml
```
4. Fill in your API token in your `crowdin.yml` config file:
```yml
#
# Your Crowdin credentials
#
'project_id': '453244'
'api_token': '<YOUR_CROWDIN_API_TOKEN_HERE>' # <--- HERE
'base_path': './src/locales'
'base_url': 'https://api.crowdin.com'
```

## Usage

To pull new translations, do:
```sh
crowdin pull
```

Likewise, to push translations:
```
crowdin push
```