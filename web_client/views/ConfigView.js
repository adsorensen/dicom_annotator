import _ from 'underscore';
import PluginConfigBreadcrumbWidget from 'girder/views/widgets/PluginConfigBreadcrumbWidget';
import View from 'girder/views/View';
import events from 'girder/events';
import { restRequest } from 'girder/rest';
import template from '../templates/configView.pug';
import '../stylesheets/configView.styl';
import '../routes';

var ConfigView = View.extend({
    events: {
        'click #domain-save': function (event) {
            event.preventDefault();
            var $key = $('#key-input').val();
            var $value = $('#value-input').val();
            if ($key == "") {
                events.trigger('g:alert', {
                    text: 'Please enter some text for the key.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else if ($value == "") {
                events.trigger('g:alert', {
                    text: 'Please enter a value for the key.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else {
                restRequest({
                    type: 'PUT',
                    url: '/system/annotation_domains',
                    data: {
                        newDomainKey: $key,
                        newDomainVal: $value
                    },
                }).done((resp) => {
                    //var domains = resp;
                    events.trigger('g:alert', {
                        icon: 'ok',
                        text: 'Domain saved.',
                        type: 'success',
                        timeout: 4000
                    });
                });
                $('#key-input').val("");
                $('#value-input').val("");
            }
        },
        'click #domain-delete': function (event) {
            event.preventDefault();
            var $key = $('#key-input').val();
            var $value = $('value-input').val();
            if ($key == "") {
                events.trigger('g:alert', {
                    text: 'Please enter some text for the key.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else {
                restRequest({
                    type: 'DELETE',
                    url: '/system/annotation_domains',
                    data: {
                        domainKey: $key
                    },
                }).done((resp) => {
                    if (resp == "key not found") {
                        events.trigger('g:alert', {
                            text: 'Domain key was not found.',
                            type: 'warning',
                            timeout: 4000
                        })
                    }
                    else {
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: 'Domain deleted.',
                            type: 'success',
                            timeout: 4000
                        });
                        $('#key-input').val("");
                        $('#value-input').val("");
                    }
                });
            }
        },
        'click #save-study': function (event) {
            event.preventDefault();
            var study = $('#annotator-study').val();
            if (study == "") {
                events.trigger('g:alert', {
                    text: 'Please input a study name.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else
            {
                restRequest({
                    url: 'system/annotation_studies',
                    data: {
                        studies: study
                    },
                    type: 'PUT',
                }).done(_.bind(function (resp) {
                    if (resp == "already exists") {
                        events.trigger('g:alert', {
                            text: study + ' already exists.',
                            type: 'warning',
                            timeout: 4000
                        });
                    }
                    else {
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: study + ' saved.',
                            type: 'success',
                            timeout: 4000
                        });
                    }
                }));
                $('#annotator-study').val("");
            }
        },
        'click #delete-study': function (event) {
            event.preventDefault();
            var studyToRemove = $('#annotator-study').val();
            if (studyToRemove == "") {
                events.trigger('g:alert', {
                    text: 'Please input a study name.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else {
                restRequest({
                    url: 'system/annotation_studies',
                    data: {
                        study: studyToRemove
                    },
                    type: 'DELETE',
                }).done(_.bind(function (resp) {
                    if (resp == "no study found")
                        events.trigger('g:alert', {
                            text: studyToRemove + ' does not exist.',
                            type: 'warning',
                            timeout: 4000
                        });
                    else
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: studyToRemove + ' was deleted.',
                            type: 'success',
                            timeout: 4000
                        });
                }));
                $('#annotator-study').val("");
            }
        },
        'click #show-studies': function (event) {
            var domaintemp;
            restRequest({
                url: '/system/annotation_domains'
            }).then((domainResponse) => {
                this.$('.g-app-footer-container').before('<div class=".g-study-list-container"></div>');
                domaintemp = domainResponse;
                return restRequest({
                    url: '/system/annotation_studies'
                });
            }).done((studiesResponse) => {
                this.$('.g-study-list-container').html(template({
                    myStudies: studiesResponse,
                    domains: domaintemp
                }));
            });
            var isVisible = $('#domain-list').is( ":visible" );
            if (isVisible) {
                $('#domain-list').toggle();
            }
            $('#study-list').toggle();
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
        var domains;
        restRequest({
            url: '/system/annotation_domains'
        }).then((domainResponse) => {
            this.$('.g-app-footer-container').before('<div class=".g-study-list-container"></div>');
            domains = domainResponse;
            return restRequest({
                url: '/system/annotation_studies'
            });
        }).done((studiesResponse) => {
            this.$('.g-study-list-container').html(template({
                myStudies: studiesResponse,
                domains: domains
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
