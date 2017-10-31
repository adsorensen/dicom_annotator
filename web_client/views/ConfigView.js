import _ from 'underscore';
import PluginConfigBreadcrumbWidget from 'girder/views/widgets/PluginConfigBreadcrumbWidget';
import View from 'girder/views/View';
import { confirm } from 'girder/dialog';
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
            var $study = $('#annotator-study').val();
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
            else if ($study == "") {
                events.trigger('g:alert', {
                    text: 'Please enter a study. ', 
                    type: 'warning',
                    timeout: 5000
                });
            }
            else {
                restRequest({
                    type: 'PUT',
                    url: '/system/annotation_domains',
                    data: {
                        study: $study,
                        newKey: $key,
                        newValue: $value
                    },
                }).done((resp) => {
                    events.trigger('g:alert', {
                        icon: 'ok',
                        text: 'Domain saved into study.',
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
            var $study = $('#annotator-study').val();
            if ($study == "") {
                events.trigger('g:alert', {
                    text: 'Please enter a study.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else if ($key == "") {
                confirm({
                    text: 'You are about to delete an entire study ' +
                        'with all of it\'s labels. Proceed?',
                    yesText: 'Delete study',
                    confirmCallback: () => {
                        restRequest({
                            url: 'system/annotation_domains',
                            data: {
                                study: $study,
                                domainKey: ''
                            },
                            type: 'DELETE',
                        }).done(_.bind(function (resp) {
                            if (resp == "study not found")
                                events.trigger('g:alert', {
                                    text: $study + ' does not exist.',
                                    type: 'warning',
                                    timeout: 4000
                                });
                            else
                                events.trigger('g:alert', {
                                    icon: 'ok',
                                    text: $study + ' was deleted.',
                                    type: 'success',
                                    timeout: 4000
                                });
                        }));
                        $('#annotator-study').val('');
                    }
                });
            }

            else {
                restRequest({
                    type: 'DELETE',
                    url: '/system/annotation_domains',
                    data: {
                        study: $study,
                        domainKey: $key
                    },
                }).done((resp) => {
                    if (resp == "study not found") {
                        events.trigger('g:alert', {
                            text: 'The study was not found.',
                            type: 'warning',
                            timeout: 4000
                        })
                    }
                    else if (resp == "domain key not found in the study.") {
                        events.trigger('g:alert', {
                            text: 'The label key was not found in the study.',
                            type: 'warning',
                            timout: 4000
                        })
                    }
                    else {
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: 'Domain deleted from the study.',
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
            var studyToAdd = $('#annotator-study').val();
            if (studyToAdd == "") {
                events.trigger('g:alert', {
                    text: 'Please input a study name.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else
            {
                restRequest({
                    url: 'system/annotation_domains',
                    data: {
                        study: studyToAdd,
                        newKey: '',
                        newValue: ''
                    },
                    type: 'PUT',
                }).done(_.bind(function (resp) {
                    if (resp == "already exists") {
                        events.trigger('g:alert', {
                            text: studyToAdd + ' already exists.',
                            type: 'warning',
                            timeout: 4000
                        });
                    }
                    else {
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: studyToAdd + ' has been saved.',
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
            var $study = $('#annotator-study').val();
            if ($study == "") {
                events.trigger('g:alert', {
                    text: 'Please input a study name.',
                    type: 'warning',
                    timeout: 5000
                });
            }
            else {
                confirm({
                    text: 'You are about to delete an entire study ' +
                        'with all of it\'s labels. Proceed?',
                    yesText: 'Delete study',
                    confirmCallback: () => {
                        restRequest({
                            url: 'system/annotation_domains',
                            data: {
                                study: $study,
                                domainKey: ''
                            },
                            type: 'DELETE',
                        }).done(_.bind(function (resp) {
                            if (resp == "study not found")
                                events.trigger('g:alert', {
                                    text: $study + ' does not exist.',
                                    type: 'warning',
                                    timeout: 4000
                                });
                            else
                                events.trigger('g:alert', {
                                    icon: 'ok',
                                    text: $study + ' was deleted.',
                                    type: 'success',
                                    timeout: 4000
                                });
                        }));
                        $('#annotator-study').val('');
                    }
                });
            }
        },
        'click #show-studies': function (event) {
            var domains;
            var studyVisible = $('#study-list').is( ":visible" );
            var labelVisible = $('#labels').is(":visible");
            var text = $('#show-studies').text();
            var tempStudy = $('#annotator-study').val();
            var tempKey = $('#key-input').val();
            var tempValue = $('#value-input').val();
            restRequest({
                url: '/system/annotation_domains'
            }).then((domainResponse) => {
                domains = domainResponse;
                return restRequest({
                    url: '/system/annotation_labels'
                });
            }).done((studyResponse) => {
                this.$el.html(template({
                    studies: domains,
                    studyLabels: studyResponse
                }));
                if (text == 'Show Studies') {
                    $('#show-studies').text('Hide Studies');
                }
                else {
                    $('#show-studies').text('Show Studies');
                    $('#show-labels').toggle();
                }

                if (labelVisible) {
                    $('#labels').toggle();
                }
                else {
                    $('#labels').toggle();
                }

                if (studyVisible) {
                    $('#study-list').toggle();
                }
                $('#annotator-study').val(tempStudy);
                $('#key-input').val(tempKey);
                $('#value-input').val(tempValue);
            });
        },
        'click #show-labels': function (event) {
            var isVisible = $('#study-list').is( ":visible" );
            var $study = $('#study-list option:selected').text();
            var $value = $('#study-list option:selected').val();
            var tempStudy = $('#annotator-study').val();
            var tempKey = $('#key-input').val();
            var tempValue = $('#value-input').val();
            var domains;
            restRequest({
                url: '/system/annotation_domains'
            }).then((domainResponse) => {
                domains = domainResponse;
                return restRequest({
                    url: '/system/annotation_labels',
                    data: {
                        study: $study
                    },
                });
            }).done((studyResponse) => {
                this.$el.html(template({
                    studies: domains,
                    studyLabels: studyResponse
                }));
                if (isVisible) {
                    $('#show-studies').text('Hide Studies');
                }
                $("#study-list").val($value);
                $('#annotator-study').val(tempStudy);
                $('#key-input').val(tempKey);
                $('#value-input').val(tempValue);
            });
        }, 
    },
    initialize: function () {
        var domains;
        this.render();
    },

    render: function () {
        var domains;
        restRequest({
            url: '/system/annotation_domains'
        }).then((domainResponse) => {
            domains = domainResponse;
            return restRequest({
                url: '/system/annotation_labels',
                data: {
                    study: ''
                },
            });
        }).done((studyResponse) => {
            this.$el.html(template({
                studies: domains,
                studyLabels: studyResponse
            }));
            $('#show-labels').toggle();
            $('#labels').toggle();
            $('#study-list').toggle();
        });

        if (!this.breadcrumb) {
            this.breadcrumb = new PluginConfigBreadcrumbWidget({
                pluginName: 'Dicom Annotator',
                el: this.$('.g-config-breadcrumb-container'),
                data: {
                    domains: {},
                    myStudies: {}
                },
                parentView: this
            }).render();
        }
        return this;
    },

    deleteStudy: function (study) {
        restRequest({
            type: 'DELETE',
            url: '/system/annotation_domains',
            data: {
                study: study,
                domainKey: ''
            },
        }).done((resp) => {
            if (resp == "study not found") {
                events.trigger('g:alert', {
                    text: 'Study was not found.',
                    type: 'warning',
                    timeout: 4000
                })
            }
            else {
                events.trigger('g:alert', {
                    icon: 'ok',
                    text: 'Domain deleted from the study.',
                    type: 'success',
                    timeout: 4000
                });
                $('#key-input').val("");
                $('#value-input').val("");
            }
        });
    },
});

export default ConfigView;
