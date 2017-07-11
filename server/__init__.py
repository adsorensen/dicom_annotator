from girder.utility import setting_utilities
from girder.models.model_base import ValidationException
from girder.api import access
from girder.api.describe import autoDescribeRoute, Description
from girder.utility.model_importer import ModelImporter

@setting_utilities.validator('annotation_domain_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], list):
        raise ValidationException('Annotation domain list must be a list')

@access.public
@autoDescribeRoute(
    Description('Return the list of annotation domains')
)
def getAnnotationDomains(params):
    return ModelImporter.model('setting').get('annotation_domain_list', default=[])

def load(info):
    info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
