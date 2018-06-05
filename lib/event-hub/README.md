# Azure EventHub implementation

This package contains the implementation of the Azure EventHub.

## How to use

This package offers methods, that can be used as implemented by assigning the package as 
a constant: `const eventHub = require('event-hub');`

From there on, configure the package by feeding it a json configuration. The json must
follow the following structure: 

~~~~
// Note: all json is camelCased
{
    "eventHub": {
        "connectionString": "<Your Azure Eventhub connection string>",
        "eventHubName": "<Your Azure Eventhub name>"
    },
    // Other json configuration
}
~~~~

It is advised to have a `config.json` in your root folder and include it when needed by the application. This also helps in configuring other parts of your listener application. 

In javascript, the following methods are known:

~~~~
const eventHub = require('event-hub');
// Optional, but useful
const config = require('config.json');

// This must be done first
eventHub.configure(config);

// Start listening using the configuration given above
// onEvent is a function which accepts eventName and optional
// eventData.
eventHub.start(onEvent)

// Send a message to the Azure EventHub
eventHub.send(eventName, eventData);

// Stop listening
eventHub.stop();
~~~~