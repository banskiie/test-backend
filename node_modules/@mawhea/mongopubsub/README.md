## Mongopubsub

Mongopubsub is a pub/sub implementation for Node.js and MongoDB. It utilizes Mongo's capped collections and tailable
cursors to notify subscribers of inserted documents that match a given query.

## Example

```javascript
import { MubSub } from '@mawhea/mongopubsub';
import mongoose from 'mongoose';
import { Db } from 'mongodb';

const {
    MONGODB_URI = 'mongodb://localhost:27017/mongopubsub_example'
} = process.env; 

let mubsub: MubSub;
let mongoDb: Db;

const init = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('🎉 Connected to database successfully');
      mongoDb = mongoose.connections[0].db;
      mubsub = new MubSub({
        mongoDb
      });
      mubsub.on(`error`, (error) => {
        console.error(`Mubsub Error`, error);
      });
      mubsub.once(`ready`, (error) => {
        console.log(`Mubsub Ready`, `Mubsub is ready to publish and subscribe`);
        resolve();
      });
    } catch (error) {
      console.error(`Mongoose connect() error`, error);
      reject(error);
    }
  });
}

const run = async () => {
  await init();
  const event = `foo`;
  const callback = (message) => {
    console.log(`Event[${event}] Message received`, { message });
  };
  const subscription = mubsub.subscribe({ event, callback });
  
  mubsub.publish({event, message: { hello: `world`}})
};

await run();
```

## Usage

### Instantiate

You pass a Db instance in the constructure options
```javascript
import { MubSub } from '@mawhea/mongopubsub';
import mongoose from 'mongoose';

await mongoose.connect(MONGODB_URI);
const mongoDb = mongoose.connections[0].db;
const mubsub = new MubSub({
  mongoDb
});
```

### Channels

A channel maps one-to-one with a capped collection (Mongopubsub will create these if they do not already exist in the
database). Optionally specify the byte size of the collection and/or the max number of documents in the collection when
creating a channel.

**WARNING**: You should not create lots of channels because Mongopubsub will poll from the cursor position.

```javascript
var mubsub = new MubSub('foo', {
  size: 100000,
  max: 500
});
```

Options:

- `size` max size of the collection in bytes, default is 5mb
- `max` max amount of documents in the collection

**WARNING**: Don't remove collections with running publishers. It's possible for `mongod` to recreate the collection on
the next insert (before Mubsub has the chance to do so). If this happens the collection will be recreated as a normal,
uncapped collection.

### Subscribe

```javascript
var subscription = mubsub.subscribe({
  event,
  callback
});
```

Subscriptions register a callback to be called whenever a document matching the specified event is inserted (published)
into the collection (channel). You can omit the event to match all inserted documents. To later unsubscribe a particular
callback, call `unsubscribe` on the returned subscription object:

```javascript
subscription.unsubscribe();
```

### Publish

```javascript
mubsub.publish({
  event,
  message
});
```

Publishing a document simply inserts the document into the channel's capped collection. A callback is optional.

### Listen to events

The following events will be emitted:

```javascript
// The given event was published
mubsub.on('myevent', console.log);

// Any event was published
mubsub.on('message', console.log);

// mongopubsub is ready to receive new documents
mubsub.on('ready', console.log);

// Channel error
mubsub.on('error', console.log);

// Tailable cursor error
mubsub.on('cursor-error', console.log);

// Tailable cursor ended
mubsub.on('cursor-end', console.log);

// Tailable cursor closed
mubsub.on('cursor-close', console.log);
```

### Close

```javascript
mubsub.close();
```

Closes the MongoDB connection.

## Install

    npm install @mawhea/mongopubsub

## Tests

    npm run test

You can optionally specify the MongoDB URI to be used for tests:

    MONGODB_URI=mongodb://localhost:27017/mongopubsub_tests npm run test
