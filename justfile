# Load in `.env`
set dotenv-load

export PATH := './target/bin:' + env_var('PATH')
TARGET_DIR := './target/wasm32-unknown-unknown/release'
CONTRACT_ID := '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'
SMARTDEPLOY := TARGET_DIR / 'abundance_token.wasm'
soroban := 'target/bin/soroban'

soroban +args:
    @soroban {{args}}

# Execute plugin
s name +args:
    @just soroban {{ name }} {{ args }}


build profile='release':
    cargo build --profile {{profile}}

build_generated:
    cd target/js-clients/abundance && npm i && npm run build

generate: build && build_generated
    ./target/bin/soroban contract bindings ts \
        --wasm ./target/wasm32-unknown-unknown/release/abundance_token.wasm \
        --id 2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de \
        --root-dir ./target/js-clients/abundance \
        --contract-name abundance-token

dev: generate
    pnpm dev

[private]
setup_default:
   @soroban config identity generate -d default --config-dir $CONFIG_DIR

@setup:
    echo {{ if path_exists(soroban) == "true" { "" } else { `cargo install_soroban` } }}


# Delete non-wasm artifacts
@clean:
    rm -rf .soroban/*.json target/bin/soroban-*
