/* eslint-disable import/first */

import events from 'girder/events';
import router from 'girder/router';
import { exposePluginConfig } from 'girder/utilities/PluginUtils';

exposePluginConfig('dicom_annotator', 'plugins/dicom_annotator/config');

import ConfigView from './views/ConfigView';
router.route('plugins/dicom_annotator/config', 'dicomAnnotatorConfig', function () {
    events.trigger('g:navigateTo', ConfigView);
});



// import events from 'girder/events';
// import router from 'girder/router';
// import { exposePluginConfig } from 'girder/utilities/PluginUtils';

// exposePluginConfig('oauth', 'plugins/oauth/config');

// import ConfigView from './views/ConfigView';
// router.route('plugins/oauth/config', 'oauthConfig', function () {
//     events.trigger('g:navigateTo', ConfigView);
// });
