import _ from 'underscore';

import PluginConfigBreadcrumbWidget from 'girder/views/widgets/PluginConfigBreadcrumbWidget';
import View from 'girder/views/View';
import events from 'girder/events';
import { restRequest } from 'girder/rest';

import ConfigViewTemplate from '../templates/configView.pug';

var ConfigView = View.extend({
    events: {
        'click .g-widget-metadata-save-button': function (event) {
            event.preventDefault();
            var $key = $('#g-key-input').val();
            var $value = $('#g-value-input').val();
            alert("hello");
            restRequest({
                type: 'GET',
                path: 'system/annotation_domains',
            }).done((resp) => {
                var domains = resp;
            });
            alert(domains);
            alert("done");
        },
        'click .save-button': function (event) {
            event.preventDefault();
            var $study = $('#annotator-study').val();
            var list = [$study];
            //alert(list);
            restRequest({
                path: 'system/annotation_studies',
                //contentType: 'application/json',
                //data: JSON.stringify($study),
                data: ["test1", "test2", "TEST3"],
                type: 'PUT',
            }).done(_.bind(function (resp) {
                alert(resp);
                events.trigger('g:alert', {
                    icon: 'ok',
                    text: 'Study saved.',
                    type: 'success',
                    timeout: 4000
                });
            }));
            $('#annotator-study').val("");
        }
    },
    initialize: function () {
        restRequest({
            //type: 'GET',
            path: 'system/annotation_domains',
            // data: {
            //     list: JSON.stringify(['provenance.resources'])
            // }
        }).done(_.bind(function (resp) {
            this.render();
            // this.$('#provenance.resources').val(
            //     resp['provenance.resources']
            // );
        }, this));
    },

    render: function () {
        this.$el.html(ConfigViewTemplate());

        if (!this.breadcrumb) {
            this.breadcrumb = new PluginConfigBreadcrumbWidget({
                pluginName: 'Dicom Annotator',
                el: this.$('.g-config-breadcrumb-container'),
                parentView: this
            }).render();
        }

        return this;
    },

    // _saveSettings: function (settings) {
    //     restRequest({
    //         type: 'PUT',
    //         path: 'system/setting',
    //         data: {
    //             list: JSON.stringify(settings)
    //         },
    //         error: null
    //     }).done(_.bind(function () {
    //         events.trigger('g:alert', {
    //             icon: 'ok',
    //             text: 'Settings saved.',
    //             type: 'success',
    //             timeout: 4000
    //         });
    //     }, this)).fail(_.bind(function (resp) {
    //         this.$('#g-provenance-error-message').text(
    //             resp.responseJSON.message
    //         );
    //     }, this));
    // }
});

export default ConfigView;
