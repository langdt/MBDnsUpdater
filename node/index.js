const ip = require('./lib/ip'),
    conf = require('./conf/config'),
    async = require('async'),
    cron = require('cron'),
    {createLogger, format, transports} = require('winston'),
    {combine, timestamp, printf, splat } = format

const printFormatter = printf(info => {
    return (info.timestamp + " | " +
        info.message.split("\n")[0])
});
const log = createLogger({
    format: combine(
        timestamp(),
        splat(),
        printFormatter
    ),
    transports: [
        new transports.Console()
    ]
})

const job = new cron.CronJob('10 * * * * *', function() {
    async.parallel({
        dns: (cb) => {
            ip.getDNSIp(cb)
        },
        ip: (cb) => {
            ip.getExternalIp(cb)
        }
    }, (err, result) => {
        if (err) {
            log.error('Error: %j', err)
            return
        }
        const current_ip = result.ip
        const [dns_entry] = result.dns
        log.debug('IP: %s, DNS IP: %s', current_ip, dns_entry)
        if (current_ip != dns_entry) {
            log.info('IP %s != DNS %s', current_ip, dns_entry);
            ip.updateDNS(current_ip, (err, data) => {
                if (err) {
                    log.error('Error updating DNS %j', err);
                } else {
                    log.info('Updated DNS:  %s', data)
                }
            });
        } else {
            log.info('IP Address %s is up to date', current_ip)
        }
    })

})
job.start()
