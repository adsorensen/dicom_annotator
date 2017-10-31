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
        url: '/system/annotation_domains',
    }).then((domainResponse) => {
        this.$('.g-dicom-panes').before('<div class="g-annotation-container"></div>');
        domains = domainResponse;
        var firstStudy = Object.keys(domains)[0];
        return restRequest({
            url:'/system/annotation_labels',
            data: {
                study: firstStudy
            },
            type: 'GET',
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
// and add the value of them to the girder item metadata, which 
// will have the tag of the study selected.
DicomView.prototype.events['click .save-labels'] = function (e) {
    var labels = "";
    var $tag = $('#study-selection option:selected').text();
    if( $('#labels').has('option').length == 0 ) {
        alert("Please select at least one label from the dropdown.");
    }
    else {
        $("#labels > option").each(function() {
            labels += this.value + ";\n";
        });
        labels = labels.slice(0, -2);

        this.item.editMetadata($tag, $tag, labels, () => {
            this.item.trigger('g:changed');
        });
        $('#labels')
            .find('option')
            .remove()
            .end()
        ;
    }
}


DicomView.prototype.events['change #study-selection'] = function (e) {
    var $tag = $('#study-selection option:selected').text();
    var domains;
    restRequest({
        url: '/system/annotation_domains',
    }).then((domainResponse) => {
        domains = domainResponse;
        return restRequest({
            url:'/system/annotation_labels',
            data: {
                study: $tag
            },
            type: 'GET',
        });
    }).done((studiesResponse) => {
        this.$('.g-annotation-container').html(template({
            domains: domains,
            myStudies: studiesResponse
        }));
        $("#study-selection").val($tag);
    });
    
}

// Event to handle when the user clicks the remove label button
// Function will remove the selected value from the selection box
DicomView.prototype.events['click .remove-label'] = function (e) {
    $('#labels option:selected').remove();
    var temp = "adfkl";
    restRequest({
        method: 'GET',
        url: '/system/annotation_studies'
    }).done(_.bind(function (resp) {
        temp = JSON.stringify(resp);
        for (var t in temp)
        {
            if (temp.hasOwnProperty(t)) {
                console.log(t + " -> " + temp[t]);
            }
        }
    }, this));
}
