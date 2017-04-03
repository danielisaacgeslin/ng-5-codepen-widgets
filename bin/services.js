// service-name: {
//   'path': 'service-path', // if different from service-name
//   'domain': 'service-path', // if different from service-name
//   dcFile: null, // or docker-compose.clients.yml or whatever
// }

module.exports = {
  'adserver-proxy-service': {},
  'analytics-service': {
    domain: 'analytics.api'
  },
  backoffice: {
    dcFile: 'docker-compose.clients.yml',
    domain: 'admin'
  },
  'blacklist-service': {
    domain: 'blacklist',
    tier: 0
  },
  'campaign-service': {
    domain: 'campaigns.api'
  },
  'creative-preview-service': {
    domain: 'preview'
  },
  'custom-categories-service': {
    domain: 'custom-categories.api',
    tier: 0
  },
  'email-service': {},
  'error-service': {
    domain: 'errors.api'
  },
  'event-bigdata-service': {
    domain: 'e2.api',
    tier: 0
  },
  gohan: {
    dcFile: 'docker-compose.clients.yml',
    domain: 'client'
  },
  'publisher-panel': {
    dcFile: 'docker-compose.clients.yml',
    domain: 'publishers'
  },
  'sherlock-service': {
    domain: 'sherlock.api',
    tier: 1
  },
  'studio-service': {
    path: 'studio/server',
    domain: 'studio.api'
  },
  'studio-client': {
    path: 'studio/client',
    dcFile: 'docker-compose.clients.yml',
    domain: 'studio'
  },
  'tag-manager-service': {
    domain: 'tms.api',
    tier: 2
  },
  'tagging-service': {
    domain: 'tagging.api'
  },
  'user-service': {
    domain: 'login',
    tier: 0
  },
  'watson-service': {
    tier: 1
  }
};
