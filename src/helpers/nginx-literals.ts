
export const startsWith = `
events {
  worker_connections 1024;
}

http {
  client_max_body_size 100M;
  sendfile on;`;

export const endsWith = `
}`;

export const setServer = (locations: string[]): string => `
  server {
    listen 80;

    gzip on;
    gzip_disable "msie6";

    gzip_comp_level 6;
    gzip_min_length 1100;
    gzip_buffers 16 8k;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml;
    ${locations.join('\n')}
  }
`;

export const setLocation = (
  path: string,
  proxy_instance: string,
  proxy_path: string,
  host?: string,
  size_in_mb?: number,
): string => `
    location ${path.replace('(.*)', '')} {
      rewrite ^${path} ${proxy_path} break;

      client_max_body_size ${size_in_mb || 1}M;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_cache_bypass $http_upgrade;

      proxy_set_header Host ${host || "$host"};
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_pass http://${proxy_instance};
    }`;
