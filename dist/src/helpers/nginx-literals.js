"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocation = exports.setServer = exports.endsWith = exports.startsWith = void 0;
exports.startsWith = "\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  client_max_body_size 100M;\n  sendfile on;";
exports.endsWith = "\n}";
var setServer = function (locations) { return "\n  server {\n    listen 80;\n\n    gzip on;\n    gzip_disable \"msie6\";\n\n    gzip_comp_level 6;\n    gzip_min_length 1100;\n    gzip_buffers 16 8k;\n    gzip_proxied any;\n    gzip_types\n        text/plain\n        text/css\n        text/js\n        text/xml\n        text/javascript\n        application/javascript\n        application/json\n        application/xml\n        application/rss+xml\n        image/svg+xml;\n    ".concat(locations.join('\n'), "\n  }\n"); };
exports.setServer = setServer;
var setLocation = function (path, proxy_instance, proxy_path, host, size_in_mb, host_scheme, read_timeout) {
    var proxy_read_timeout = "".concat(read_timeout ? "      proxy_read_timeout ".concat(read_timeout, "s;\n") : "");
    return "\n    location ".concat(path.replace('(.*)', ''), " {\n      rewrite ^").concat(path, " ").concat(proxy_path, " break;\n\n      client_max_body_size ").concat(size_in_mb || 1, "M;\n\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection \"upgrade\";\n      proxy_cache_bypass $http_upgrade;\n").concat(proxy_read_timeout, "\n      proxy_set_header Host ").concat(host || "$host", ";\n      proxy_set_header X-Real-IP $remote_addr;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header X-Forwarded-Proto $scheme;\n\n      proxy_pass ").concat(host_scheme || "http", "://").concat(proxy_instance, ";\n    }");
};
exports.setLocation = setLocation;
//# sourceMappingURL=nginx-literals.js.map