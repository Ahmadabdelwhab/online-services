const morgan = require('morgan');
const getmac = require('getmac');
const getIP = require('ipware')().get_ip;
const requestIp = require('request-ip');
// Custom token to add MAC address
morgan.token('mac-address', (req) => {
  try {
    return getmac.default();
  } catch (error) {
    console.error('Error fetching MAC address:', error);
    return 'unknown';
  }
});

// Custom token to add IP address
morgan.token('ip-address', (req) => {
    console.log(requestIp.getClientIp(req));
    var ip = requestIp.getClientIp(req);
    return ip;
});

// Configure Morgan with custom format
const morganConfig = morgan(':remote-addr - MAC: :mac-address - IP: :ip-address - :method :url :status :res[content-length] - :response-time ms');

module.exports = morganConfig;
