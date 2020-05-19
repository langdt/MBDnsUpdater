const https = require('https'),
    dns = require('dns'),
    conf = require('../conf/config'),
    util = require('util')

module.exports = {
    getExternalIp: (cb) => {
        https.get({
            host: conf.ip_address
        }, (res) => {
            res.on('data', (chunk) => {
                cb(null, chunk.toString())
            })
        }).on('error', (err) => {
            cb(err)
        })
    },
    getDNSIp: (cb) => {
        dns.resolve4(conf.host, cb)
    },
    updateDNS: (ip, cb) => {
        // Not using the ip
        const path = util.format('%s/%s', conf.api_path, conf.host)
        let response_data = '';
        https.get({
            host: conf.api_host,
            path: path,
            headers: {
                'Authorization': 'Basic '
                    + Buffer.from(conf.login + ':' + conf.password).toString('base64')
            }

        }, (res) => {
            res.on('data', (chunk) => {
                response_data += chunk.toString();
            })
            res.on('end', () => {
                cb(null, response_data)
            })
        }).on('error', (err) => {
            cb(err)
        })
    },
}
