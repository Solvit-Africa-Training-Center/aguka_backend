module.exports = {
  apps: [
    {
      name: 'aguka-backend',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '300M',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      autorestart: true,

      env: {
        NODE_ENV: 'development',
        ENV: 'DEV',
        PORT: 3000,
      },

      env_production: {
        NODE_ENV: 'production',
        ENV: 'PROD',
        PORT: 3000,
      },
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
