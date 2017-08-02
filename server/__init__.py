from girder.utility import setting_utilities
from girder.models.model_base import ValidationException
from girder.api import access
from girder.api.describe import autoDescribeRoute, Description
from girder.utility.model_importer import ModelImporter
from . import constants

@setting_utilities.validator('annotation_domain_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], dict):
        raise ValidationException('Annotation domain list must be a dictionary')

@setting_utilities.validator('annotation_study_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], list):
        raise ValidationException('Annotation study list must be a list')

@access.public
@autoDescribeRoute(
    Description('Return the list of annotation domains')
)
def getAnnotationDomains(params):
    return ModelImporter.model('setting').get('annotation_domain_list', default=[])

@access.public
@autoDescribeRoute(
    Description('Load the list of annotation domains')
)
def putAnnotationDomains(params):
    return ModelImporter.model('setting').set('annotation_domain_list', constants.PluginSettings.labelsDictionary)

@access.public
@autoDescribeRoute(
    Description('Set the list of annotation studies')
)
def putAnnotationStudies(params):
    return ModelImporter.model('setting').set('annotation_study_list', constants.PluginSettings.labelsList)

@access.public
@autoDescribeRoute(
    Description('Get the list of annotation studies')
)
def getAnnotationStudies(params):
    return ModelImporter.model('setting').get('annotation_study_list', default=[])


def load(info):
    info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_domains',), putAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_studies',), putAnnotationStudies)
    info['apiRoot'].system.route('GET', ('annotation_studies',), getAnnotationStudies)
