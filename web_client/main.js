import { wrap } from 'girder/utilities/PluginUtils';
import { restRequest } from 'girder/rest';
import DicomView from 'girder_plugins/dicom_viewer/views/DicomView';
import template from './annotationSelect.pug';
import './annotationSelect.styl';
//import view from 'views/view;
import View from 'girder/views/View';
//import annotationView from './views/view';

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

DicomView.prototype.events['click .add-label'] = function (e) {
    var $tempvalue2 = $('#selection option:selected').val();
    var $tempvalue = $('#selection option:selected').text();
    alert($tempvalue2);
    $('#labels').append($('<option>', {
        value: 1,
        text: $tempvalue
    }));

    // var select = document.getElementById('labels');
    // var opt = document.createElement('option');
    // opt.value = text;
    // opt.innerHTML = text;
    // select.appendChild(opt);
    // this.labels.push(text);
}

DicomView.prototype.events['click .save-labels'] = function (e) {
    
}

// contains: function (text) {
//         //text = text.toLowerCase;
//         for(var i=0; i<this.labels.length; i++)
//         {
//             if(this.labels[i].toLowerCase() === text.toLowerCase())
//             {
//                 return true;
//             }
//         }
//         return false;
//     },
