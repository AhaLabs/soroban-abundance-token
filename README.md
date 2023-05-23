🌳 Abundance Token
==================

Money might not grow on trees, but anyone can mint themselves this [Soroban](https://eips.ethereum.org/EIPS/eip-20) [Fungible Token](https://soroban.stellar.org/docs/reference/interfaces/token-interface)!

This copies the UI from an [Ethereum Abundance Token](https://github.com/chadoh/abundance-token), connecting it to Soroban instead.

This project uses raw JS rather than React, which will help drive development of less React-enmeshed JS developer libraries for Soroban.


Contributing
============

## Prerequisites 

0. Install [just](https://github.com/casey/just#readme): `cargo install just`
0. Install [Node.js](https://nodejs.org/en/download/package-manager/) ≥ 16 and [pnpm](https://pnpm.io/)

Get the frontend working:
0. Clone this repo and `cd` into its directory
0. Install dependencies with `pnpm install`
0. Build project bindings
0. Run frontend app in development mode with `just dev` (see other commands you can run with `just --list` and in the `scripts` section of `package.json`)

The Abundance Token source code lives in [./contract](./contract). If you want to make CLI calls to the deployed contract:

0. Install [Soroban CLI](https://soroban.stellar.org/docs/reference/soroban-cli)

1. Configure a Futurenet network shortcut:

       soroban config network add --global \
                           --rpc-url https://rpc-futurenet.stellar.org:443/soroban/rpc \
                           --network-passphrase "Test SDF Future Network ; October 2022" \
                           futurenet

2. You probably also want to configure a default identity:

       soroban config identity generate --global default

3. Now add an alias to your shell, maybe in your `.zprofile` (zsh) or `.bash_profile` (bash) or equivalent for your system:

       alias abundance="soroban contract invoke --network futurenet --source default --id 2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de --"

4. Check that it worked:

      abundance --help


