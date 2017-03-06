# laBibliotecaPubSubWebServer
La Biblioteca web server.  Contains Pub/Sub architecture with Redis data store.

Server also contains a data producer script, pulling data from 
Spotify, and MovieDb apis

Technologies include NodeJs, ExpressJs, and Redis.

Flow of laBiblioteca:

1) Data Provider pulls records from MovieDb and Spotify APIs every 4 seconds.

2) Data provider pushes json to laBiblioteca's web server via POST in Express.

3) On POST, Express middleware saves records to Redis db, trims records in Redis to most recent 10, and then pushes the latest records to a websocket hosted by laBiblioteca API.

4) LaBiblioteca client subscribes to observable from its respective movie or music websocket.

5) Ionic 2 displays streaming data, unshifting the latest record to top of display.
