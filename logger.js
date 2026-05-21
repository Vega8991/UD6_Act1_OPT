const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

function write(level, message, meta = {}) {
    if (LEVELS[level] > CURRENT) return;
    const entry = { timestamp: new Date().toISOString(), level, message, ...meta };
    (level === 'error' ? process.stderr : process.stdout).write(JSON.stringify(entry) + '\n');
}

function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        write('info', 'http_request', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration_ms: Date.now() - start,
            ip: req.ip,
        });
    });
    next();
}

module.exports = {
    info:  (msg, meta) => write('info',  msg, meta),
    warn:  (msg, meta) => write('warn',  msg, meta),
    error: (msg, meta) => write('error', msg, meta),
    debug: (msg, meta) => write('debug', msg, meta),
    requestLogger,
};
