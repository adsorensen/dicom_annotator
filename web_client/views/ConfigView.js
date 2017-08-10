import _ from 'underscore';
import PluginConfigBreadcrumbWidget from 'girder/views/widgets/PluginConfigBreadcrumbWidget';
import View from 'girder/views/View';
import events from 'girder/events';
import { restRequest } from 'girder/rest';
import template from '../templates/configView.pug';
import '../stylesheets/configView.styl';

var ConfigView = View.extend({
    events: {
        'click #domain-save': function (event) {
            event.preventDefault();
            var $key = $('#key-input').val();
            var $value = $('#value-input').val();
            restRequest({
                type: 'PUT',
                path: 'system/annotation_domains',
                data: {
                    newDomainKey: $key,
                    newDomainVal: $value
                },
            }).done((resp) => {
                var domains = resp;
                events.trigger('g:alert', {
                    icon: 'ok',
                    text: 'Domain saved.',
                    type: 'success',
                    timeout: 4000
                });
            });
            $('#key-input').val("");
            $('#value-input').val("");
        },
        'click #save-study': function (event) {
            event.preventDefault();
            var $study = $('#annotator-study').val();
            var list = [$study];
            restRequest({
                path: 'system/annotation_studies',
                data: {
                    studies: $study
                },
                type: 'PUT',
            }).done(_.bind(function (resp) {
                events.trigger('g:alert', {
                    icon: 'ok',
                    text: 'Study saved.',
                    type: 'success',
                    timeout: 4000
                });
            }));
            $('#annotator-study').val("");
        },
        'click #show-studies': function (event) {
            var isVisible = $('#domain-list').is( ":visible" );
            if (isVisible) {
                $('#domain-list').toggle();
            }
            $('#study-list').toggle();
            //$('.hidden').toggle();
            //alert("i am here");
        },
        'click #show-domains': function (event) {
            var isVisible = $('#study-list').is( ":visible" );
            if (isVisible) {
                $('#study-list').toggle();
            }
            $('#domain-list').toggle();
        }
    },
    initialize: function () {
        // restRequest({
        //     path: 'system/annotation_domains',
        // }).done(_.bind(function (resp) {
        //     this.render();
        // }, this));

        var domains;
        restRequest({
            path: '/system/annotation_domains'
        }).then((domainResponse) => {
            this.$('.g-config-breadcrumb-container').after('<div class=".g-study-list-container"></div>');
            domains = domainResponse;
            return restRequest({
                path:'/system/annotation_studies'
            });
        }).done((studiesResponse) => {
            this.$('.g-study-list-container').html(template({
                domains: domains,
                myStudies: studiesResponse
            }));
            this.render();
        });
    },

    render: function () {
        this.$el.html(template());
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
