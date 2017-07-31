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
    //alert("here");
    this.item.editMetadata('annotationDomain', 'annotationDomain', domain, () => {
        this.item.trigger('g:changed');
    });
}

// Event to handle when the user clicks on the add label button
// Function will grab the selected option from the drop down
// and add a new option to the labels selection box with the 
// name and value from the drop down
DicomView.prototype.events['click .add-label'] = function (e) {
    var $label = $('#selection option:selected').text();
    var $value = $('#selection option:selected').val();
    if ($("#labels option[value=" + $value + "]").length > 0)
    {
        alert($label + " already exists");
    }
    else
    {
        $('#labels').append($('<option>', {
        value: $value,
        text: $label
        }));
    }
}

// Event to handle when the user clicks the save labels button
// Function will take all labels currently in the selection box
// and add them to the girder item metadata
DicomView.prototype.events['click .save-labels'] = function (e) {
    
}

// Event to handle when the user clicks the remove label button
// Function will remove the selected value from the selection box
DicomView.prototype.events['click .remove-label'] = function (e) {
    $('#labels option:selected').remove();

}
