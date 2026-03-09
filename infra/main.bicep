@description('Azure region for the resources.')
param location string = resourceGroup().location

@description('Unique name for the storage account (3-24 lowercase letters/digits).')
param storageAccountName string

@description('SKU for the storage account.')
@allowed(['Standard_LRS', 'Standard_GRS'])
param skuName string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: skuName
  }
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

// $web container is auto-created by 'az storage blob service-properties update --static-website'

@description('Primary static website endpoint.')
output staticWebsiteUrl string = storageAccount.properties.primaryEndpoints.web

@description('Storage account name (used by deployment workflow).')
output storageAccountNameOutput string = storageAccount.name
