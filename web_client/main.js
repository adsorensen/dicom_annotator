import { wrap } from 'girder/utilities/PluginUtils';
import { restRequest } from 'girder/rest';
import DicomView from 'girder_plugins/dicom_viewer/views/DicomView';
import template from './annotationSelect.pug';
import './annotationSelect.styl';
import view from 'views/view'

wrap(DicomView, 'render', function (render) {
    render.call(this);

    restRequest({
        path: '/system/annotation_domains'
    }).done((resp) => {
        this.$('.g-dicom-panes').before('<div class="g-annotation-container"></div>');
        this.$('.g-annotation-container').html(template({
            domains: resp
        }));
    });

    return this;
});

DicomView.prototype.events['change .g-annotation-domain'] = function (e) {
    var domain = $(e.currentTarget).val();
    this.item.editMetadata('annotationDomain', 'annotationDomain', domain, () => {
        this.item.trigger('g:changed');
    });
}
