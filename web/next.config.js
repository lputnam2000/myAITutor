/** @type {import('next').NextConfig} */
const {withAxiom} = require('next-axiom');

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true
    }
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

module.exports = withAxiom(withBundleAnalyzer(nextConfig))
