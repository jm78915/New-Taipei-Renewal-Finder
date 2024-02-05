# New Taipei Renewal Finder

## Environment Variables

- Copy the .env.example file to a new file named .env and fill in the necessary values:

```plaintext
# Facebook App Configurations
REACT_APP_FB_APP_ID=
REACT_APP_FB_XFBML=true
REACT_APP_FB_VERSION=v19.0

# Google Client ID for Google Sign-In
REACT_APP_GOOGLE_CLIENT_ID=
```

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
