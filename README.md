# chatAppWeb

This is a little project for school web development course. The app is built live and is hosted by myself.

This site is not to be used to any illegal activities and the app could be removed from public view at a later date without warning.

## Install instructions

Working site is made and can be found in
[https://chatapp.ydns.eu](https://chatapp.ydns.eu)

# Information

This is a school lecture project that I decided to make live.
This project will be hidden after school class is over.

## Extra details

This chat app will work as backend for a mobile app too.<br>
[Located in this repo.](https://github.com/artopeur/chatapp)

## Project details

Built with HTML and javascript using socket.io both in backend and in frontend as the socket manager. This backend is encrypted with ssl certificates from lets encrypt.

The site is using [YDNS](https://ydns.io/) as provider to dynamic dns services. It is free to use dynamic dns service located in Germany.

The server doesn't store any information from the users, not even log files. It could be peer to peer encrypted, but that wasn't the in the scope of the school work.

### Backend

There was some difficulties setting up the live site. The reverse proxy didn't start working with Caddy, so as a workaround the caddy collected certificates are used in the backend, exposed at port 3000. The backend is not protected by anything and other chat apps could be connected to use this API

### Work to be done

- The site is not updated automatically to the YDNS site, but should hold for the duration of the classwork review.

- I will get to this at some point

----

