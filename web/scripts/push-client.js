export class PushClient{
    constructor(stateChangeCb, subscriptionUpdate, publicAppKey) {
		this._stateChangeCb = stateChangeCb;
        this._subscriptionUpdate = subscriptionUpdate;
		this._publicApplicationKey = publicAppKey;
        
        this._state = {
			UNSUPPORTED: {
				id: 'UNSUPPORTED',
				interactive: false,
				pushEnabled: false,
			},
			INITIALISING: {
				id: 'INITIALISING',
				interactive: false,
				pushEnabled: false,
			},
			PERMISSION_DENIED: {
				id: 'PERMISSION_DENIED',
				interactive: false,
				pushEnabled: false,
			},
			PERMISSION_GRANTED: {
				id: 'PERMISSION_GRANTED',
				interactive: true,
			},
			PERMISSION_PROMPT: {
				id: 'PERMISSION_PROMPT',
				interactive: true,
				pushEnabled: false,
			},
			ERROR: {
				id: 'ERROR',
				interactive: false,
				pushEnabled: false,
			},
			STARTING_SUBSCRIBE: {
				id: 'STARTING_SUBSCRIBE',
				interactive: false,
				pushEnabled: true,
			},
			SUBSCRIBED: {
				id: 'SUBSCRIBED',
				interactive: true,
				pushEnabled: true,
			},
			STARTING_UNSUBSCRIBE: {
				id: 'STARTING_UNSUBSCRIBE',
				interactive: false,
				pushEnabled: false,
			},
			UNSUBSCRIBED: {
				id: 'UNSUBSCRIBED',
				interactive: true,
				pushEnabled: false,
			},
		};

        if (!('serviceWorker' in navigator)) {
            	this._stateChangeCb(this._state.UNSUPPORTED, 'Service worker not ' +
        'available on this browser');
			console.log('Service worker not ' +
        'available on this browser');
			return;
		} 

        if (!('PushManager' in window)) {
			this._stateChangeCb(this._state.UNSUPPORTED, 'PushManager not ' +
        'available on this browser');
        console.log('PushManager not ' +
        'available on this browser');
			return;
		}

		if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
			this._stateChangeCb(this._state.UNSUPPORTED, 'Showing Notifications ' +
        'from a service worker is not available on this browser');
         console.log('Showing Notifications ' +
        'from a service worker is not available on this browser');
			return;
		}

		this.init();
    }

    	async init() {
		    await navigator.serviceWorker.ready;
		    this._stateChangeCb(this._state.INITIALISING);
			this.subscribeDevice();
		    this.setUpPushPermission();
	}

    _permissionStateChange(permissionState) {
        console.log('Permission state change: ' + permissionState);
		// If the notification permission is denied, it's a permanent block
		switch (permissionState) {
		case 'denied':
			this._stateChangeCb(this._state.PERMISSION_DENIED);
            console.log('Permission set as denied');
			break;
		case 'granted':
			this._stateChangeCb(this._state.PERMISSION_GRANTED);
             console.log('Permission set as granted');
			break;
		case 'default':
			this._stateChangeCb(this._state.PERMISSION_PROMPT);
             console.log('Permission set as default');
			break;
		default:
			console.error('Unexpected permission state: ', permissionState);
			break;
		}
	}

    	async setUpPushPermission() {
		try {
			this._permissionStateChange(Notification.permission);

			const reg = await navigator.serviceWorker.ready;
			// Let's see if we have a subscription already
			const subscription = await reg.pushManager.getSubscription();
			console.log('subscription via pushManager: ' + subscription);
			// Update the current state with the
			// subscriptionId and endpoint
			this._subscriptionUpdate(subscription);
			if (!subscription) {
                console.log('something went wrong with subscription!');
				// NOOP since we have no subscription and the permission state
				// will inform whether to enable or disable the push UI
				return;
			}

			this._stateChangeCb(this._state.SUBSCRIBED);
		} catch (err) {
			console.error('setUpPushPermission() ', err);
			this._stateChangeCb(this._state.ERROR, err);
		}
	}

	async subscribeDevice() {
		this._stateChangeCb(this._state.STARTING_SUBSCRIBE);
		console.log('[subscribeDevice] starting subscribe...')

		try {
			switch (Notification.permission) {
			case 'denied':
				console.log('[subscribeDevice] => permission denied')
				alert('permission denied');
				throw new Error('Push messages are blocked.');
			case 'granted':
					alert('permission granted');
					console.log('[subscribeDevice] => permission granted')
				break;
			default:
				await new Promise((resolve, reject) => {
					Notification.requestPermission((result) => {
						if (result !== 'granted') {
							console.log('[subscribeDevice] => Bad permission result')
								alert('Bad permission result: '+ result);
							reject(new Error('Bad permission result'));
						}
						else{
							console.log('[subscribeDevice] result of Notification.requestPermission: ' + result)
							alert('permission granted');
						}

						resolve();
					});
				});
			}

			// We need the service worker registration to access the push manager
			// try {
			// 	const reg = await navigator.serviceWorker.ready;
			// 	const subscription = await reg.pushManager.subscribe(
			// 		{
			// 			userVisibleOnly: true,
			// 			applicationServerKey: this._publicApplicationKey,
			// 		},
			// 	);
			// 	this._stateChangeCb(this._state.SUBSCRIBED);
			// 	this._subscriptionUpdate(subscription);
			// } catch (err) {
			// 	this._stateChangeCb(this._state.ERROR, err);
			// }
		} catch (err) {
			console.error('subscribeDevice() error: ', err);
			// Check for a permission prompt issue
			this._permissionStateChange(Notification.permission);
		}
	}

    
}