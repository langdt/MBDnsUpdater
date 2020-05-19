# MBDnsUpdater
Update Mythic Beasts DNS record for a host (i.e. dynamic dns)

LOGIN=<token user> PASSWORD=<token password> HOST=<host name> node index.js

Each minute it will check your external ip address against the address for the supplied host name.
If they don't match it will call the v2 mythic beast API to update the ip address.

The token login must be configured to manage the host name's ip address.
