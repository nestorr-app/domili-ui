#!/bin/sh
npm install --location=global pnpm
pnpm install
NODE_OPTIONS=--max_old_space_size=4096 pnpm build
