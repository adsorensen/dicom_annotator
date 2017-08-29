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
            restRequest({
                type: 'PUT',
                url: '/system/annotation_domains',
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
            var temp = $('#annotator-study').val();
            if (temp == "") {
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
                        study: temp
                    },
                    type: 'DELETE',
                }).done(_.bind(function (resp) {
                    if (resp == "no study found")
                        events.trigger('g:alert', {
                            text: temp + ' does not exist.',
                            type: 'warning',
                            timeout: 4000
                        });
                    else
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: temp + ' was deleted.',
                            type: 'success',
                            timeout: 4000
                        });
                }));
                $('#annotator-study').val("");
            }
            
        },
        'click #show-studies': function (event) {
            var domains;
            restRequest({
                url: '/system/annotation_domains'
            }).then((domainResponse) => {
                this.$('.g-config-show-info').after('<div class=".g-study-list-container"></div>');
                domains = domainResponse;
                return restRequest({
                    url: '/system/annotation_studies'
                });
            }).done((studiesResponse) => {
                this.$('.g-study-list-container').html(template({
                    myStudies: studiesResponse,
                    domains: domains
                }));
                alert(studiesResponse);
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
        // restRequest({
        //     path: 'system/annotation_domains',
        // }).done(_.bind(function (resp) {
        //     this.render();
        // }, this));
        
        var domains;
        restRequest({
            url: '/system/annotation_domains'
        }).then((domainResponse) => {
            this.$('.g-config-breadcrumb-container').after('<div class=".g-study-list-container"></div>');
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
            //alert(studiesResponse);
        });
        //this.render();
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
