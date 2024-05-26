// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {Properties, ServiceCategory} from "../app/shared/models/env.model";

const _window: any = window;
const windowEnv = _window['env'];

export const SERVICES: ServiceCategory = windowEnv.SERVICES;
export const PROPERTIES: Properties = windowEnv.PROPERTIES;
export const DEFAULT_TIMEZONE: string = windowEnv.DEFAULT_TIMEZONE;
export const DEFAULT_DATETIME_FORMAT: string = 'DD/MM/YYYY HH:mm:ss';

export const environment = {
    production: false,
    defaultauth: 'fackbackend',
    firebaseConfig: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: ''
    },

    stompDebug: true,
};

// SERVICES.PUBLIC_MINIO_API.url = 'http://demo.unitel.com.la:9019'
// SERVICES.PRIVATE_MINIO_API.url = 'http://demo.10.240.192.173.nip.io:9019'
// SERVICES.CHAT_SERVER_API.url = 'http://ipcc4.10.60.156.127.nip.io:8081'
// SERVICES.CHAT_SERVER_API.url = 'http://chat-server.api.10.60.157.189.nip.io:8443'
// SERVICES.CHAT_SERVER_API.url = 'http://chat-server.api.10.60.157.189.nip.io:8443'
// SERVICES.CHAT_SERVER_API.url = 'http://chat-server.api.10.60.157.189.nip.io:8443'
// SERVICES.CHAT_SERVER_API.url = 'http://ipcc4.10.60.158.230.nip.io:9091'


// local
// SERVICES.TICKET_SERVICE_API.url = "http://ticket.api.10.60.157.189.nip.io:8443"
// SERVICES.TICKET_SERVICE_API.url = "http://ipcc4.127.0.0.1.nip.io:9997"
// SERVICES.TICKET_SERVICE_API.url = "http://ticket.api.10.60.157.189.nip.io:8443"
//
// 230
// SERVICES.CHAT_SERVICE_API.url = "http://chat.api.10.60.157.189.nip.io:8443"
// SERVICES.CHAT_SERVICE_API.url = "http://chat.api.10.60.157.189.nip.io:8443"
// SERVICES.CHAT_SERVICE_API.url = "http://demo.127.0.0.1.nip.io:9999"
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 * chat-service
 *  http://chat.api.10.60.156.127.nip.io:8443/public/api/v1/chat-client/domains/b27d4da6-1f79-43aa-978a-a4008636d3af
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
//
// SERVICES.CHAT_SERVER_API.url = 'https://demo.unitel.com.la/chat-server'
// SERVICES.CHAT_SERVICE_API.url = 'https://demo.unitel.com.la/chat-service'
// SERVICES.TICKET_SERVICE_API.url = 'https://demo.unitel.com.la/ticket-service'
