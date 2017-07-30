import $ from 'jquery';
import _ from 'underscore';
import daikon from 'daikon';

import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkInteractorStyleImage from 'vtk.js/Sources/Interaction/Style/InteractorStyleImage';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';

import { restRequest, apiRoot } from 'girder/rest';
import View from 'girder/views/View';

import ViewTemplate from '../annotationSelect.pug';
import '../annotationSelect.styl';

var DicomView = View.extend({
    events: {
    	'click .add-label': function (event) {
            event.preventDefault();
            this.addLabel();
        },
        'click .save-label': function (event) {
            event.preventDefault();
            this.saveLabels();
        },
    },
    initialize: function (settings) {
        this.item = settings.item;
        this.files = [];
        this.index = 0;
        this.first = true;
        this.playing = false;
        this.playRate = settings.playRate || 500;
        this.imageData = null;
        this.imageDataCache = {};
        this.tagCache = {};
        this.xhr = null;
        this.loadFileList();
        this.labels = [];
    },

    addLabel: function () {
        var text = document.getElementById("labels").value;
        alert("here");
        if(this.contains(text))
        {
            alert(text + " has already been added");
        }
        else
        {
            var select = document.getElementById('labels');
            var opt = document.createElement('option');
            opt.value = text;
            opt.innerHTML = text;
            select.appendChild(opt);
            this.labels.push(text);
        }
        this.printLabels();
    },

    addLabel: function () {

    },

    removeLabel: function () {
        var text = document.getElementById("labelText").value;
        if(text != "")
        {
            if (this.contains(text))
            {
                var index = this.labels.indexOf(text);
                this.labels.splice(index, 1);
                alert(text + " was removed from the labels");
                this.printLabels();
            }
            else
            {
                alert("Didn't find \"" + text + "\" to remove");
            }
        }
        var x = document.getElementById("labels");
        x.remove(x.selectedIndex);
        //alert(x + " was removed.....");
    },

    contains: function (text) {
        //text = text.toLowerCase;
        for(var i=0; i<this.labels.length; i++)
        {
            if(this.labels[i].toLowerCase() === text.toLowerCase())
            {
                return true;
            }
        }
        return false;
    },
})