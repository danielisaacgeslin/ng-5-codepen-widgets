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
  backoffice: [
    {
      name: 'backoffice',
      dcFile: 'docker-compose.clients.yml',
      domain: 'admin',
      tier: 0
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
      domain: 'custom-categories.api',
      tier: 0
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
      domain: 'e2.api',
      tier: 0
    }
  ],
  gohan: [
    {
      name: 'gohan',
      dcFile: 'docker-compose.clients.yml',
      domain: 'client'
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
      domain: 'sherlock.api',
      tier: 1
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
      domain: 'tms.api',
      tier: 2
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
      domain: 'login',
      tier: 0
    }
  ],
  'watson-service': [
    {
      name: 'watson-service',
      tier: 1
    }
  ]
};
