# Load in `.env`
set dotenv-load

export PATH := './target/bin:' + env_var('PATH')
TARGET_DIR := './target/wasm32-unknown-unknown/release'
CONTRACT_ID := 'CBUM3YE3MZPESPT7CPPPYTX2766HVEX4GPN3HBDLUFJGAVTVIWNP56DW'
WASM := TARGET_DIR / 'abundance_token.wasm'
soroban := 'target/bin/soroban'

soroban +args:
    @soroban {{args}}

# Execute plugin
s name +args:
    @just soroban {{ name }} {{ args }}

deploy: build
    echo "update CONTRACT_ID in justfile with: $(soroban contract deploy --network futurenet --source default --wasm {{ WASM }}), then run 'just init'"

init: && generate
    soroban contract invoke --network futurenet --source default --id {{ CONTRACT_ID }} -- \
    initialize \
    --symbol '"41424E44"' \
    --decimal 7 \
    --name '"4162756E64616E636520546F6B656E"' \
    --admin `soroban config identity address default`

build profile='release':
    cargo build --profile {{profile}} --target wasm32-unknown-unknown

clean_generated:
    rm -rf node_modules/abundance-token && rm -rf node_modules/.vite && rm -rf node_modules/.astro 

install_generated: clean_generated
    npm i -S abundance-token@./target/js-clients/abundance

generate: build && install_generated
    ./target/bin/soroban contract bindings typescript \
        --wasm {{ WASM }} \
        --id {{ CONTRACT_ID }} \
        --root-dir ./target/js-clients/abundance \
        --rpc-url "https://rpc-futurenet.stellar.org:443/soroban/rpc" \
        --network-passphrase "Test SDF Future Network ; October 2022" \
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
