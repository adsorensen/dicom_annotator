import { wrap } from 'girder/utilities/PluginUtils';
import { restRequest } from 'girder/rest';
import './routes';
import DicomView from 'girder_plugins/dicom_viewer/views/DicomView';
import template from './annotationSelect.pug';
import './annotationSelect.styl';
import View from 'girder/views/View';

wrap(DicomView, 'render', function (render) {
    render.call(this);
    var domains;
    restRequest({
        path: '/system/annotation_domains'
    }).then((domainResponse) => {
        this.$('.g-dicom-panes').before('<div class="g-annotation-container"></div>');
        domains = domainResponse;
        return restRequest({
            path:'/system/annotation_studies'
        });
    }).done((studiesResponse) => {
        this.$('.g-annotation-container').html(template({
            domains: domains,
            myStudies: studiesResponse
        }));
    });
    return this;
});

// Event to handle when the user clicks on the add label button
// Function will grab the selected option from the drop down
// and add a new option to the labels selection box with the 
// name and value from the drop down. If the value of the label
// already exists in the select box, it will not add it.
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
    var labels = "";
    var $tag = $('#study-selection option:selected').text();
    $("#labels > option").each(function() {
        labels += this.value + ";\n";
    });
    labels = labels.slice(0, -2);

    this.item.editMetadata($tag, $tag, labels, () => {
        this.item.trigger('g:changed');
    });
}

// Event to handle when the user clicks the remove label button
// Function will remove the selected value from the selection box
DicomView.prototype.events['click .remove-label'] = function (e) {
    $('#labels option:selected').remove();
}
