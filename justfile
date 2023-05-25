# Load in `.env`
set dotenv-load

export PATH := './target/bin:' + env_var('PATH')
TARGET_DIR := './target/wasm32-unknown-unknown/release'
CONTRACT_ID := '3d0ad3712bcb251a0dc899882313ad7167c9400a5f51444d86ab6c3f93faa513'
SMARTDEPLOY := TARGET_DIR / 'abundance_token.wasm'
soroban := 'target/bin/soroban'

soroban +args:
    @soroban {{args}}

# Execute plugin
s name +args:
    @just soroban {{ name }} {{ args }}


build profile='release':
    cargo build --profile {{profile}} --target wasm32-unknown-unknown

build_generated:
    cd target/js-clients/abundance && npm i && npm run build

clean_generated:
    rm -rf node_modules/abundance-token && rm -rf node_modules/.vite && rm -rf node_modules/.astro 

install_generated: clean_generated
    npm i -S abundance-token@./target/js-clients/abundance

generate: build && build_generated install_generated
    ./target/bin/soroban contract bindings ts \
        --wasm ./target/wasm32-unknown-unknown/release/abundance_token.wasm \
        --id 3d0ad3712bcb251a0dc899882313ad7167c9400a5f51444d86ab6c3f93faa513 \
        --root-dir ./target/js-clients/abundance \
        --contract-name abundance-token

dev: generate
    npm run dev

[private]
setup_default:
   @soroban config identity generate -d default --config-dir $CONFIG_DIR

@setup:
    echo {{ if path_exists(soroban) == "true" { "" } else { `cargo install_soroban` } }}


# Delete non-wasm artifacts
@clean:
    rm -rf .soroban/*.json target/bin/soroban-*
