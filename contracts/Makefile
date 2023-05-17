default: build

all: test

test: build
	cargo test

build-rust:
	cargo build --target wasm32-unknown-unknown --release 
	@ls -l target/wasm32-unknown-unknown/release/*.wasm

build-ts: build-rust
	soroban contract bindings ts --network futurenet --id 2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de --out target/ts --name abundance-token

build: build-rust build-ts

fmt:
	cargo fmt --all --check

clean:
	cargo clean
