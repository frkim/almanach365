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
    allowBlobPublicAccess: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
  properties: {}
}

// Enable static website hosting on the $web container
resource webContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: '$web'
  properties: {
    publicAccess: 'Blob'
  }
}

@description('Primary static website endpoint.')
output staticWebsiteUrl string = storageAccount.properties.primaryEndpoints.web

@description('Storage account name (used by deployment workflow).')
output storageAccountNameOutput string = storageAccount.name
