import {PushClient} from './push-client.js';
import {APP_KEY} from './constants.js';

export function pushPreparing() {
    console.log('--> Try to preparing pushes...');

    	
    var x = new AppController();
}

class AppController{
    constructor(){
        this._stateChangeListener = this._stateChangeListener.bind(this);
        this._subscriptionUpdate = this._subscriptionUpdate.bind(this);

        this._pushClient = new PushClient(
            this._stateChangeListener,
            this._subscriptionUpdate,
			APP_KEY,
            );

			
    }

    	_stateChangeListener(state, data) {
		if (typeof state.interactive !== 'undefined') {
			if (state.interactive) {
                console.log('state is interactive');
			} else {
                 console.log('state is not interactive');
			}
		}

		switch (state.id) {
		case 'UNSUPPORTED':
            alert('Push Not Supported.\n' + data);
			break;
		case 'ERROR':
			 alert('Ooops! a Problem Occurred.\n' + data);
			break;
		default:
			break;
		}
	}

    _subscriptionUpdate(subscription) {
       console.log('subscription updated: ' +subscription);
	}

    	
}