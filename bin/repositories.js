/*
repo-name: [
  {
    name: <service1Name>,
    domain: <service1Domain>,
    dcFile: ... // if different from service.name
  }
]
*/

module.exports = {
  'adserver-proxy-service': [
    {
      name: 'adserver-proxy-service'
    }
  ],
  'analytics-service': [
    {
      name: 'analytics-service',
      domain: 'analytics.api'
    }
  ],
  'audit-service': [
    {
      name: 'audit-service',
      domain: 'audit.api'
    }
  ],
  backoffice: [
    {
      name: 'backoffice',
      dcFile: 'docker-compose.clients.yml',
      domain: 'admin'
    }
  ],
  'blacklist-service': [
    {
      name: 'blacklist-service',
      domain: 'blacklist'
    }
  ],
  'campaign-service': [
    {
      name: 'campaign-service',
      domain: 'campaigns.api'
    }
  ],
  'creative-preview-service': [
    {
      name: 'creative-preview-service',
      domain: 'preview'
    }
  ],
  'custom-categories-service': [
    {
      name: 'custom-categories-service',
      domain: 'custom-categories.api'
    }
  ],
  'email-service': [
    {
      name: 'email-service'
    }
  ],
  'error-service': [
    {
      name: 'error-service',
      domain: 'errors.api'
    }
  ],
  'event-bigdata-service': [
    {
      name: 'event-bigdata-service',
      domain: 'e2.api'
    }
  ],
  'geolocation-service': [
    {
      name: 'geolocation-service'
    }
  ],
  gohan: [
    {
      name: 'gohan',
      dcFile: 'docker-compose.clients.yml',
      domain: 'client',
      buildCopyDirs: [
        '/code/node_modules:node_modules',
        '/code/packages/creative-library/node_modules:packages/creative-library/node_modules',
        '/code/packages/client/node_modules:packages/client/node_modules'
      ]
    }
  ],
  'publisher-panel': [
    {
      name: 'publisher-panel',
      dcFile: 'docker-compose.clients.yml',
      domain: 'publishers'
    }
  ],
  'sherlock-service': [
    {
      name: 'sherlock-service',
      domain: 'sherlock.api'
    }
  ],
  studio: [
    {
      name: 'studio-service',
      domain: 'studio.api'
    },
    {
      name: 'studio-client',
      dcFile: 'docker-compose.clients.yml',
      domain: 'studio'
    }
  ],
  'tag-manager-service': [
    {
      name: 'tag-manager-service',
      domain: 'tms.api'
    }
  ],
  'tagging-service': [
    {
      name: 'tagging-service',
      domain: 'tagging.api'
    }
  ],
  'user-service': [
    {
      name: 'user-service',
      domain: 'login'
    }
  ],
  'watson-service': [
    {
      name: 'watson-service'
    }
  ],
  'topurls-service': [],
  'aggregation-service': [],
  'blacklisted-traffic-service': [],
  'adserver-report-extraction-task': []
};
