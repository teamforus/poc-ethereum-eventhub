# Event-driven Platform Forus Concept

This project is build as an aid to show the advantages of event-driven services API. 

## Definitions

(Event) Hub: The messager of the event-driven system. All events are send to and from this instance

Instance: an application that executes a certain function. For example, all ethereum-related executions are executed on the Blockchain instance, whereas database executions are done on the database instance. All listeners and the hub itself are instances. 

Listener: an instance that listens to events on the event hub. No listener may be dependent on other listeners. 

## Events

Some events can have a certain sequence in which their occur. This will be noted in 
the event section. Any events that occur out of this sequence, are marked with "OOS".

All events contain a header, made from the event name and event data (eventName and eventData, respectively)

In the eventData, the following data kan be found, although sometimes optional. 

- previousEvent: the event that caused this event. Note that the previous event can also contain a previous event, creating a stacktrace;
- sender: the source of the event (to be determined what this will be: IP, URI, identifier known by instances);
- timestamp: timestamp on which the event was called on;

### ERC20 - Transfer

This event is split into multiple messages, in sequence. 

#### requestErc20Transfer

Trigger: when a user requests a transfer from his wallet to someone else's. 

Additional data:
- to: the receiver of the transaction;
- amount: the amount that the receiver should send

#### savedErc20Transfer

Trigger: when a caching system has saved the request

#### executedErc20Transfer

Trigger: when an instance has proved that the transfer is valid and executed. Caching systems should now remove this from cache and all database systems can save the new data
as truth. 

#### failedErc20Transfer (OOS)

Trigger: when an instance has proved that the ERC20 transfer request is not valid or
impossible. 

Additional data: 
- errorMessage: contains the error message explaining why this system deemed this transaction invalid

### Status and maintenance

#### requestStatus

Trigger: when an instance wants to see the version of all instances listening to the hub. 
Note that these must be implemented on listeners in order for the hub to notices them. 

#### requestVersion 

Trigger: when an instance wants to know the version of all instances listening to the hub. 

#### status

Trigger: when an instance receives the `requestStatus` event, is has to send this event.

Additional data: 
- statusCode: can be "_OK_" if the instance is doing fine, "_ERROR_" if the server is 
**not working** due to an error or "_OFFLINE_" if a result was expected, but none was given.
- errorMessage: if the server is suffering from an error. Note that this can be set, even if
 the statusCode is not "_ERROR_". In that case, the instance is suffering from a non-fatal 
 error. 

 #### version

Trigger: when an instance receives the `requestVersion` event, it has to send this event.

 Additional data:
 - release: first part of version index
 - patch: second part of the version index
 - hotfix: third and final part of version index. 

 Note that these can be combined to form \<release>.\<patch>.\<hotfix>. E.g. version 2.1.14 for release 2, patch 1 and hotfix 14.